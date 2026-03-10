'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import ExperienceEditor from '@/components/editor/ExperienceEditor';
import SkillsEditor from '@/components/editor/SkillsEditor';
import EducationEditor from '@/components/editor/EducationEditor';
import ProjectsEditor from '@/components/editor/ProjectsEditor';
import CertificationsEditor from '@/components/editor/CertificationsEditor';
import AchievementsEditor from '@/components/editor/AchievementsEditor';
import QualityScore from '@/components/editor/QualityScore';
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
                parsedData.certifications = Array.isArray(parsedData.certifications) ? parsedData.certifications : [];
                parsedData.achievements = Array.isArray(parsedData.achievements) ? parsedData.achievements : [];
                parsedData.sectionOrder = Array.isArray(parsedData.sectionOrder) ? parsedData.sectionOrder : [
                    'summary',
                    'experience',
                    'education',
                    'skills',
                    'projects',
                    'certifications',
                    'achievements'
                ];

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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading editor...</p>
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
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Top Bar */}
            <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/dashboard')}
                                className="text-slate-400 hover:text-white hover:bg-white/5"
                            >
                                ← Back
                            </Button>
                            <input
                                type="text"
                                value={resume.title}
                                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                                className="text-xl font-semibold border-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded px-2 bg-transparent text-white placeholder:text-slate-500"
                                placeholder="Untitled Resume"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={saveResume} disabled={saving} className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
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

                                        // Temporarily change title for print (removes "Visish AI" from PDF header/filename)
                                        const originalTitle = document.title;
                                        document.title = resume.title || 'Resume';

                                        window.print();

                                        // Restore title
                                        document.title = originalTitle;
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
                        {/* Quality Score */}
                        <QualityScore data={resumeData} />

                        {/* Template Selector */}
                        <div className="bg-slate-900/50 border border-white/10 rounded-lg shadow-xl p-4">
                            <h3 className="font-semibold mb-3 text-white">Template</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {templateConfigs.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setResume({ ...resume, templateType: template.id })}
                                        className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${resume.templateType === template.id
                                            ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                            : 'border-white/10 hover:border-amber-500/50 text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {template.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Theme Selector */}
                        <div className="bg-slate-900/50 border border-white/10 rounded-lg shadow-xl p-4">
                            <h3 className="font-semibold mb-3 text-white">Color Theme</h3>
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
                        <div className="bg-slate-900/50 border border-white/10 rounded-lg shadow-xl p-4">
                            <h3 className="font-semibold mb-3 text-white">Font Style</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['sans', 'serif', 'mono'].map((font) => (
                                    <button
                                        key={font}
                                        onClick={() => setResume({ ...resume, fontFamily: font })}
                                        className={`p-2 border-2 rounded-lg text-sm font-medium transition-all ${resume.fontFamily === font
                                            ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                            : 'border-white/10 hover:border-amber-500/50 text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {font === 'sans' ? 'Sans Serif' : font === 'serif' ? 'Serif' : 'Monospace'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size Selector */}
                        <div className="bg-slate-900/50 border border-white/10 rounded-lg shadow-xl p-4">
                            <h3 className="font-semibold mb-3 text-white">Text Size</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['small', 'medium', 'large'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setResume({ ...resume, fontSize: size })}
                                        className={`p-2 border-2 rounded-lg text-sm font-medium transition-all ${(resume.fontSize || 'medium') === size
                                            ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                            : 'border-white/10 hover:border-amber-500/50 text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {size.charAt(0).toUpperCase() + size.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section Editor */}
                        <div className="bg-slate-900/50 border border-white/10 rounded-lg shadow-xl p-4">
                            <h3 className="font-semibold mb-3 text-white">Edit Sections</h3>
                            <div className="space-y-2">
                                <Button
                                    className={`w-full justify-start ${activeTab === 'personal' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
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
                        {/* Section Editors */}
                        <div className="bg-slate-900/50 border border-white/10 rounded-lg shadow-xl p-4">
                            {activeTab === 'personal' && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-white">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-slate-400">Full Name</label>
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
                                                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm text-white bg-slate-950 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400">Email</label>
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
                                                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm text-white bg-slate-950 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400">Phone</label>
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
                                                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm text-white bg-slate-950 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400">Location</label>
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
                                                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm text-white bg-slate-950 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400">LinkedIn</label>
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
                                                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm text-white bg-slate-950 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                                placeholder="linkedin.com/in/username"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400">GitHub</label>
                                            <input
                                                type="text"
                                                value={resumeData.personalInfo?.github || ''}
                                                onChange={(e) => setResume({
                                                    ...resume,
                                                    data: {
                                                        ...resumeData,
                                                        personalInfo: { ...resumeData.personalInfo, github: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm text-white bg-slate-950 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                                placeholder="github.com/username"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400">Website</label>
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
                                                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm text-white bg-slate-950 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                                placeholder="yourportfolio.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'summary' && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-white">Professional Summary</h3>
                                    <textarea
                                        value={resumeData.summary || ''}
                                        onChange={(e) => setResume({
                                            ...resume,
                                            data: { ...resumeData, summary: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm text-white bg-slate-950 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
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
                        <div className="bg-slate-900/50 border border-white/10 rounded-lg shadow-xl p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-white">Live Preview</h3>
                                <button
                                    onClick={() => {
                                        setResume((prev: any) => {
                                            const newIsFit = !prev.isFitToPage;

                                            return {
                                                ...prev,
                                                isFitToPage: newIsFit,
                                                // When enabling Smart Fit, force Small font. When disabling, revert to Medium (default).
                                                fontSize: newIsFit ? 'small' : (prev.fontSize === 'small' ? 'medium' : prev.fontSize)
                                            };
                                        });
                                    }}
                                    className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all ${resume.isFitToPage
                                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold border-transparent shadow-lg shadow-amber-500/20'
                                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:border-amber-500/50'
                                        }`}
                                >
                                    <Sparkles className={`w-3 h-3 ${resume.isFitToPage ? 'animate-pulse' : ''}`} />
                                    {resume.isFitToPage ? 'Smart Fit Active' : '✨ Smart Fit 1-Page'}
                                </button>
                            </div>
                            <div
                                id="resume-preview"
                                className="bg-slate-200/50 border rounded-lg overflow-hidden shadow-2xl transition-all duration-500 ease-out origin-top-left"
                                style={{
                                    transform: 'scale(0.65)', // Fixed scale for UI viewing only
                                    width: '153.8%' // Inverse of 0.65
                                }}
                            >
                                <TemplateRenderer
                                    templateType={resume.templateType as TemplateType}
                                    data={resumeData}
                                    colorThemeId={resume.colorTheme}
                                    fontFamily={resume.fontFamily}
                                    fontSize={resume.fontSize || 'medium'}
                                    spacing={resume.isFitToPage ? 'compact' : 'standard'}
                                    sectionOrder={resumeData.sectionOrder || []}
                                    onReorder={(newOrder) => setResume({
                                        ...resume,
                                        data: { ...resumeData, sectionOrder: newOrder }
                                    })}
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
                onSelectPlan={async (plan: string, gateway: 'razorpay', couponCode?: string) => {
                    // ... payment logic remains same ...
                    try {
                        const response = await fetch('/api/payments/razorpay/create-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ plan, couponCode }),
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
                    } catch (error) {
                        console.error('Payment error:', error);
                        alert('Payment failed. Please try again.');
                    }
                }}
            />
        </div>
    );
}
