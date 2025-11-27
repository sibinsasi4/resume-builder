'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UsageWidget from '@/components/subscription/UsageWidget';
import PricingModal from '@/components/subscription/PricingModal';
import { formatDate } from '@/lib/utils';

interface Resume {
    id: string;
    title: string;
    templateType: string;
    updatedAt: string;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPricingModal, setShowPricingModal] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await fetch('/api/resumes');
            if (response.ok) {
                const data = await response.json();
                setResumes(data.resumes);
            }
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        } finally {
            setLoading(false);
        }
    };

    const createNewResume = async () => {
        try {
            const response = await fetch('/api/resumes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Untitled Resume',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                router.push(`/editor/${data.resume.id}`);
            }
        } catch (error) {
            console.error('Failed to create resume:', error);
        }
    };

    const handleSelectPlan = async (plan: string, gateway: 'razorpay' | 'stripe') => {
        try {
            if (gateway === 'razorpay') {
                // Create Razorpay order
                const response = await fetch('/api/payments/razorpay/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plan }),
                });

                const { orderId, amount, currency, keyId } = await response.json();

                // Load Razorpay script
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
                            // Verify payment
                            await fetch('/api/payments/razorpay/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    ...response,
                                    plan,
                                    billingCycle: 'monthly',
                                }),
                            });
                            setShowPricingModal(false);
                            window.location.reload();
                        },
                    };
                    const razorpay = new (window as any).Razorpay(options);
                    razorpay.open();
                };
            } else {
                // Stripe checkout
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
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            VISISH
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">Welcome, {session?.user?.name}</span>
                            <Button variant="outline" size="sm" onClick={() => signOut()}>
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Content - 2 columns */}
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h2>
                            <p className="text-gray-600">Create and manage your professional resumes</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Choose Template Card */}
                            <Card
                                hover
                                className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 cursor-pointer flex items-center justify-center min-h-[200px]"
                                onClick={() => router.push('/templates')}
                            >
                                <div className="text-center">
                                    <div className="text-5xl mb-4">📋</div>
                                    <h3 className="text-xl font-semibold text-purple-600">Choose Template</h3>
                                    <p className="text-sm text-gray-600 mt-2">Start with pre-filled resume</p>
                                </div>
                            </Card>

                            {/* Create New Resume Card */}
                            <Card
                                hover
                                className="border-2 border-dashed border-blue-300 bg-blue-50 cursor-pointer flex items-center justify-center min-h-[200px]"
                                onClick={createNewResume}
                            >
                                <div className="text-center">
                                    <div className="text-5xl mb-4">➕</div>
                                    <h3 className="text-xl font-semibold text-blue-600">Create Blank Resume</h3>
                                    <p className="text-sm text-gray-600 mt-2">Start from scratch</p>
                                </div>
                            </Card>

                            {/* Resume Cards */}
                            {resumes.map((resume) => (
                                <Card key={resume.id} className="overflow-hidden">
                                    {/* Preview Thumbnail */}
                                    <div
                                        className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 border-b border-gray-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => router.push(`/editor/${resume.id}`)}
                                    >
                                        <div className="text-center">
                                            <div className="text-6xl mb-2">📄</div>
                                            <p className="text-xs text-gray-500">Click to preview</p>
                                        </div>
                                    </div>

                                    {/* Resume Info */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                            {resume.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-1">
                                            Template: <span className="capitalize">{resume.templateType}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Updated: {formatDate(resume.updatedAt)}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                size="sm"
                                                onClick={() => router.push(`/editor/${resume.id}`)}
                                                className="flex-1"
                                            >
                                                ✏️ Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.push(`/analysis/${resume.id}`)}
                                            >
                                                📊
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to delete this resume?')) {
                                                        try {
                                                            const response = await fetch(`/api/resumes/${resume.id}`, {
                                                                method: 'DELETE',
                                                            });
                                                            if (response.ok) {
                                                                fetchResumes();
                                                            }
                                                        } catch (error) {
                                                            console.error('Failed to delete resume:', error);
                                                        }
                                                    }
                                                }}
                                                className="text-red-600 hover:bg-red-50"
                                            >
                                                🗑️
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {resumes.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg">No resumes yet. Create your first one!</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        <UsageWidget onUpgrade={() => setShowPricingModal(true)} />
                    </div>
                </div>
            </div>

            {/* Pricing Modal */}
            <PricingModal
                isOpen={showPricingModal}
                onClose={() => setShowPricingModal(false)}
                onSelectPlan={handleSelectPlan}
            />
        </div>
    );
}
