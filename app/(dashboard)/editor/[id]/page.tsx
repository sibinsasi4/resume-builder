'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import ExperienceEditor from '@/components/editor/ExperienceEditor';
import SkillsEditor from '@/components/editor/SkillsEditor';
import EducationEditor from '@/components/editor/EducationEditor';
import ProjectsEditor from '@/components/editor/ProjectsEditor';
import CertificationsEditor from '@/components/editor/CertificationsEditor';
import AchievementsEditor from '@/components/editor/AchievementsEditor';
import PricingModal from '@/components/subscription/PricingModal';
import { ResumeData, TemplateType } from '@/lib/types';
import { colorThemes, templateConfigs } from '@/lib/constants';

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const { status } = useSession();
    const [resume, setResume] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [userSubscription, setUserSubscription] = useState<any>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        fetchResume();
        fetchUserSubscription();
    }, [params.id]);

    const fetchUserSubscription = async () => {
        try {
            const response = await fetch('/api/user/subscription');
            if (response.ok) {
                const data = await response.json();
                setUserSubscription(data.subscription);
            }
        } catch (error) {
            console.error('Failed to fetch subscription:', error);
        }
    };

    const fetchResume = async () => {
        try {
            const response = await fetch(`/api/resumes/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                const fetchedResume = data.resume;

                // Parse and validate resume data
                let parsedData;
                try {
                    parsedData = fetchedResume.data ? JSON.parse(fetchedResume.data) : null;
                } catch (e) {
                    console.error('Failed to parse resume data:', e);
                    parsedData = null;
                }

                // Initialize with default structure if data is invalid
                if (!parsedData || typeof parsedData !== 'object') {
                    parsedData = {
                        personalInfo: {
                            fullName: '',
                            email: '',
                            phone: '',
                            location: '',
                        },
                        summary: '',
                        experience: [],
                        education: [],
                        skills: [],
                        projects: [],
                        certifications: [],
                        achievements: [],
                    };
                }

                // Ensure all required fields exist
                parsedData.personalInfo = parsedData.personalInfo || {
                    fullName: '',
                    email: '',
                    phone: '',
                    location: '',
                };
                parsedData.summary = parsedData.summary || '';
                parsedData.experience = Array.isArray(parsedData.experience) ? parsedData.experience : [];
                parsedData.education = Array.isArray(parsedData.education) ? parsedData.education : [];
                parsedData.skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
                parsedData.projects = Array.isArray(parsedData.projects) ? parsedData.projects : [];
                parsedData.certifications = Array.isArray(parsedData.certifications) ? parsedData.certifications : [];
                parsedData.achievements = Array.isArray(parsedData.achievements) ? parsedData.achievements : [];

                // Set resume with parsed data
                setResume({
                    ...fetchedResume,
                    data: parsedData
                });
            }
        } catch (error) {
            console.error('Failed to fetch resume:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveResume = async () => {
        try {
            setSaving(true);
            const response = await fetch(`/api/resumes/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...resume,
                    data: JSON.stringify(resume.data) // Stringify data for database
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save resume');
            }
        } catch (error) {
            console.error('Failed to save resume:', error);
            alert('Failed to save resume');
        } finally {
            setSaving(false);
        }
    };

    const updateResumeData = (path: string, value: any) => {
        setResume((prev: any) => {
            const newResume = { ...prev };
            const keys = path.split('.');
            let current = newResume.data;

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newResume;
        });
    };

    const checkDownloadAccess = async (): Promise<boolean> => {
        try {
            // Check user's subscription status
            const response = await fetch('/api/user/subscription');
            if (!response.ok) return false;

            const { subscription, usage } = await response.json();

            // If no subscription or free plan, deny access
            if (!subscription || subscription.plan === 'free') {
                alert('⚠️ Download Restricted\n\nYou need to purchase a plan to download PDFs:\n• Pay ₹9 for single download\n• Subscribe to Monthly Pro (₹299) for 30 downloads/month');
                return false;
            }

            // Check if subscription is active
            if (subscription.status !== 'active' && subscription.status !== 'trialing') {
                alert('⚠️ Subscription Inactive\n\nYour subscription is not active. Please renew to download.');
                return false;
            }

            // For pay-per-use, check if they have downloads remaining
            if (subscription.plan === 'payperuse') {
                if (!usage || usage.downloadsUsed >= usage.downloadsLimit) {
                    alert('⚠️ No Downloads Remaining\n\nYou have used all your downloads. Purchase another download for ₹9.');
                    return false;
                }
            }

            // For monthly plans, check download limit
            if (subscription.plan === 'pro' || subscription.plan === 'premium') {
                if (usage && usage.downloadsUsed >= usage.downloadsLimit) {
                    alert('⚠️ Monthly Limit Reached\n\nYou have used all 30 downloads this month. Wait for next month or purchase additional downloads.');
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error('Error checking download access:', error);
            alert('Error checking download access. Please try again.');
            return false;
        }
    };

    const trackDownload = async () => {
        try {
            await fetch('/api/downloads/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeId: resume.id,
                    templateType: resume.templateType
                })
            });
        } catch (error) {
            console.error('Failed to track download:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading editor...</p>
                </div>
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Resume not found</p>
                    <Button onClick={() => router.push('/dashboard')} className="mt-4">
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const resumeData: ResumeData = resume.data;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Bar */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/dashboard')}
                            >
                                ← Back
                            </Button>
                            <input
                                type="text"
                                value={resume.title}
                                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                                className="text-xl font-semibold border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={saveResume} disabled={saving}>
                                {saving ? 'Saving...' : '💾 Save'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    // Check if user has download access
                                    const canDownload = await checkDownloadAccess();
                                    if (canDownload) {
                                        // Save first, then download
                                        await saveResume();
                                        // Track download
                                        await trackDownload();
                                        window.print();
                                    } else {
                                        // Show pricing modal
                                        setShowPricingModal(true);
                                    }
                                }}
                            >
                                📥 Download PDF
                            </Button>
                            <Button size="sm" onClick={() => router.push(`/analysis/${params.id}`)}>
                                📊 Analyze
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Layout */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Panel - Controls */}
                    <div className="space-y-4">
                        {/* Template Selector */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3">Template</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {templateConfigs.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setResume({ ...resume, templateType: template.id })}
                                        className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${resume.templateType === template.id
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        {template.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Theme Selector */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3">Color Theme</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {colorThemes.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setResume({ ...resume, colorTheme: theme.id })}
                                        className={`p-3 rounded-lg border-2 transition-all ${resume.colorTheme === theme.id
                                            ? 'border-gray-900 scale-110'
                                            : 'border-gray-200'
                                            }`}
                                        style={{ backgroundColor: theme.primary }}
                                        title={theme.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Font Selector */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3">Font Style</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['sans', 'serif', 'mono'].map((font) => (
                                    <button
                                        key={font}
                                        onClick={() => setResume({ ...resume, fontFamily: font })}
                                        className={`p-2 border-2 rounded-lg text-sm font-medium transition-all ${resume.fontFamily === font
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        {font === 'sans' ? 'Sans Serif' : font === 'serif' ? 'Serif' : 'Monospace'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size Selector */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3">Text Size</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['small', 'medium', 'large'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setResume({ ...resume, fontSize: size })}
                                        className={`p-2 border-2 rounded-lg text-sm font-medium transition-all ${(resume.fontSize || 'medium') === size
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        {size.charAt(0).toUpperCase() + size.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section Editor */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3">Edit Sections</h3>
                            <div className="space-y-2">
                                <Button
                                    variant={activeTab === 'personal' ? 'primary' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('personal')}
                                >
                                    Personal Info
                                </Button>
                                <Button
                                    variant={activeTab === 'summary' ? 'primary' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('summary')}
                                >
                                    Summary
                                </Button>
                                <Button
                                    variant={activeTab === 'experience' ? 'primary' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('experience')}
                                >
                                    Experience
                                </Button>
                                <Button
                                    variant={activeTab === 'education' ? 'primary' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('education')}
                                >
                                    Education
                                </Button>
                                <Button
                                    variant={activeTab === 'skills' ? 'primary' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('skills')}
                                >
                                    Skills
                                </Button>
                                <Button
                                    variant={activeTab === 'projects' ? 'primary' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('projects')}
                                >
                                    Projects
                                </Button>
                                <Button
                                    variant={activeTab === 'certifications' ? 'primary' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('certifications')}
                                >
                                    Certifications
                                </Button>
                                <Button
                                    variant={activeTab === 'achievements' ? 'primary' : 'ghost'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('achievements')}
                                >
                                    Achievements
                                </Button>
                            </div>
                        </div>

                        {/* Section Editors */}
                        <div className="bg-white rounded-lg shadow p-4">
                            {activeTab === 'personal' && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">Full Name</label>
                                            <input
                                                type="text"
                                                value={resumeData.personalInfo?.fullName || ''}
                                                onChange={(e) => setResume({
                                                    ...resume,
                                                    data: {
                                                        ...resumeData,
                                                        personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">Email</label>
                                            <input
                                                type="email"
                                                value={resumeData.personalInfo?.email || ''}
                                                onChange={(e) => setResume({
                                                    ...resume,
                                                    data: {
                                                        ...resumeData,
                                                        personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">Phone</label>
                                            <input
                                                type="tel"
                                                value={resumeData.personalInfo?.phone || ''}
                                                onChange={(e) => setResume({
                                                    ...resume,
                                                    data: {
                                                        ...resumeData,
                                                        personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">Location</label>
                                            <input
                                                type="text"
                                                value={resumeData.personalInfo?.location || ''}
                                                onChange={(e) => setResume({
                                                    ...resume,
                                                    data: {
                                                        ...resumeData,
                                                        personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">LinkedIn</label>
                                            <input
                                                type="text"
                                                value={resumeData.personalInfo?.linkedin || ''}
                                                onChange={(e) => setResume({
                                                    ...resume,
                                                    data: {
                                                        ...resumeData,
                                                        personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">Website</label>
                                            <input
                                                type="text"
                                                value={resumeData.personalInfo?.website || ''}
                                                onChange={(e) => setResume({
                                                    ...resume,
                                                    data: {
                                                        ...resumeData,
                                                        personalInfo: { ...resumeData.personalInfo, website: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'summary' && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Professional Summary</h3>
                                    <textarea
                                        value={resumeData.summary || ''}
                                        onChange={(e) => setResume({
                                            ...resume,
                                            data: { ...resumeData, summary: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        rows={6}
                                        placeholder="Write a brief summary of your professional background and key achievements..."
                                    />
                                </div>
                            )}

                            {activeTab === 'experience' && (
                                <ExperienceEditor
                                    data={resumeData}
                                    onChange={(newData) => setResume({ ...resume, data: newData })}
                                />
                            )}

                            {activeTab === 'education' && (
                                <EducationEditor
                                    data={resumeData}
                                    onChange={(newData) => setResume({ ...resume, data: newData })}
                                />
                            )}

                            {activeTab === 'skills' && (
                                <SkillsEditor
                                    data={resumeData}
                                    onChange={(newData) => setResume({ ...resume, data: newData })}
                                />
                            )}

                            {activeTab === 'projects' && (
                                <ProjectsEditor
                                    data={resumeData}
                                    onChange={(newData) => setResume({ ...resume, data: newData })}
                                />
                            )}

                            {activeTab === 'certifications' && (
                                <CertificationsEditor
                                    data={resumeData}
                                    onChange={(newData) => setResume({ ...resume, data: newData })}
                                />
                            )}

                            {activeTab === 'achievements' && (
                                <AchievementsEditor
                                    data={resumeData}
                                    onChange={(newData) => setResume({ ...resume, data: newData })}
                                />
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Live Preview */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <h3 className="font-semibold mb-4">Live Preview</h3>
                            <div
                                id="resume-preview"
                                className="border rounded-lg overflow-hidden"
                                style={{ transform: 'scale(0.7)', transformOrigin: 'top left', width: '142.857%' }}
                            >
                                <TemplateRenderer
                                    templateType={resume.templateType as TemplateType}
                                    data={resumeData}
                                    colorThemeId={resume.colorTheme}
                                    fontFamily={resume.fontFamily}
                                    fontSize={resume.fontSize || 'medium'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Modal */}
            <PricingModal
                isOpen={showPricingModal}
                onClose={() => setShowPricingModal(false)}
                onSelectPlan={async (plan: string, gateway: 'razorpay' | 'stripe') => {
                    // Handle payment selection (same as dashboard)
                    try {
                        if (gateway === 'razorpay') {
                            const response = await fetch('/api/payments/razorpay/create-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ plan }),
                            });
                            const { orderId, amount, currency, keyId } = await response.json();
                            const script = document.createElement('script');
                            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                            script.async = true;
                            document.body.appendChild(script);
                            script.onload = () => {
                                const options = {
                                    key: keyId,
                                    amount,
                                    currency,
                                    order_id: orderId,
                                    name: 'VISISH',
                                    description: `${plan} Plan`,
                                    handler: async (response: any) => {
                                        await fetch('/api/payments/razorpay/verify', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ ...response, plan, billingCycle: 'monthly' }),
                                        });
                                        setShowPricingModal(false);
                                        fetchUserSubscription();
                                        alert('Payment successful! You can now download your resume.');
                                    },
                                };
                                const razorpay = new (window as any).Razorpay(options);
                                razorpay.open();
                            };
                        } else {
                            const response = await fetch('/api/payments/stripe/checkout', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ plan, billingCycle: 'monthly' }),
                            });
                            const { url } = await response.json();
                            window.location.href = url;
                        }
                    } catch (error) {
                        console.error('Payment error:', error);
                        alert('Payment failed. Please try again.');
                    }
                }}
            />
        </div>
    );
}
