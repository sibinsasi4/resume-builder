'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UsageWidget from '@/components/subscription/UsageWidget';
import PricingModal from '@/components/subscription/PricingModal';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { formatDate } from '@/lib/utils';
import {
    Users, FileText, DollarSign, TrendingUp, TrendingDown, Download, Eye, Sparkles,
    CreditCard, LogIn, RefreshCw, AlertCircle, CheckCircle, XCircle, Clock
} from 'lucide-react';

interface Resume {
    id: string;
    title: string;
    templateType: string;
    updatedAt: string;
}

interface AdminStats {
    totalUsers: number;
    totalResumes: number;
    totalDownloads: number;
    totalRevenue: number;
    activeSubscriptions: number;
    paidUsers: number;
    freeUsers: number;
    activeUsers24h: number;
    paymentStats: {
        total: number;
        successful: number;
        failed: number;
        successRate: number;
    };
    loginStats: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    financialMetrics: {
        mrr: number;
        arr: number;
        arpu: number;
    };
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
    const isAdmin = session?.user?.role === 'admin';

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        fetchResumes();
        if (isAdmin) {
            fetchAdminStats();
        }
    }, [isAdmin]);

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

    const fetchAdminStats = async () => {
        // Initialize with zero values so UI shows immediately
        const zeroStats: AdminStats = {
            totalUsers: 0,
            totalResumes: 0,
            totalDownloads: 0,
            totalRevenue: 0,
            activeSubscriptions: 0,
            paidUsers: 0,
            freeUsers: 0,
            activeUsers24h: 0,
            paymentStats: { total: 0, successful: 0, failed: 0, successRate: 0 },
            loginStats: { today: 0, thisWeek: 0, thisMonth: 0 },
            financialMetrics: { mrr: 0, arr: 0, arpu: 0 }
        };

        try {
            const response = await fetch('/api/admin/stats', {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAdminStats(data);
            } else {
                console.error('Failed to fetch stats, using zero values');
                setAdminStats(zeroStats);
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            setAdminStats(zeroStats);
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

    const handleSelectPlan = async (plan: string, gateway: 'razorpay', couponCode?: string) => {
        try {
            // Create Razorpay order
            const response = await fetch('/api/payments/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan, couponCode }),
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
                                couponCode,
                            }),
                        });
                        setShowPricingModal(false);
                        window.location.reload();
                    },
                };
                const razorpay = new (window as any).Razorpay(options);
                razorpay.open();
            };
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
            <DashboardNavbar />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {isAdmin ? (
                    /* ADMIN VIEW - 2 Sections */
                    <div className="space-y-8">
                        {/* Section 1: Resume Management */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Resume Management</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card
                                    hover
                                    className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 cursor-pointer flex items-center justify-center min-h-[150px]"
                                    onClick={() => router.push('/templates')}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-3">📋</div>
                                        <h3 className="text-lg font-semibold text-purple-600">Choose Template</h3>
                                        <p className="text-sm text-gray-600 mt-1">Start with pre-filled resume</p>
                                    </div>
                                </Card>
                                <Card
                                    hover
                                    className="border-2 border-dashed border-blue-300 bg-blue-50 cursor-pointer flex items-center justify-center min-h-[150px]"
                                    onClick={createNewResume}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-3">➕</div>
                                        <h3 className="text-lg font-semibold text-blue-600">Create Blank Resume</h3>
                                        <p className="text-sm text-gray-600 mt-1">Start from scratch</p>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Section 2: Admin Dashboard */}
                        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Sparkles className="w-6 h-6" />
                                    📊 Admin Dashboard
                                </h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchAdminStats}
                                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh Data
                                </Button>
                            </div>

                            {adminStats ? (
                                <>
                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl p-4 border border-blue-500/30">
                                            <div className="text-xs text-blue-300 mb-1">Monthly Recurring Revenue</div>
                                            <div className="text-2xl font-bold">₹{adminStats.financialMetrics.mrr.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30">
                                            <div className="text-xs text-purple-300 mb-1">Annual Recurring Revenue</div>
                                            <div className="text-2xl font-bold">₹{adminStats.financialMetrics.arr.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl p-4 border border-green-500/30">
                                            <div className="text-xs text-green-300 mb-1">Avg Revenue Per User</div>
                                            <div className="text-2xl font-bold">₹{adminStats.financialMetrics.arpu.toFixed(0)}</div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div
                                            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                                            onClick={() => router.push('/admin/users')}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="w-4 h-4 text-blue-400" />
                                                <div className="text-xs text-gray-400">Total Users</div>
                                            </div>
                                            <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
                                            <div className="text-xs text-gray-500 mt-1">{adminStats.paidUsers} paid • {adminStats.freeUsers} free</div>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="w-4 h-4 text-green-400" />
                                                <div className="text-xs text-gray-400">Revenue</div>
                                            </div>
                                            <div className="text-2xl font-bold">₹{adminStats.totalRevenue}</div>
                                            <div className="text-xs text-gray-500 mt-1">All time</div>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-4 h-4 text-purple-400" />
                                                <div className="text-xs text-gray-400">Resumes</div>
                                            </div>
                                            <div className="text-2xl font-bold">{adminStats.totalResumes}</div>
                                            <div className="text-xs text-gray-500 mt-1">{adminStats.totalDownloads} downloads</div>
                                        </div>
                                        <div
                                            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                                            onClick={() => router.push('/admin/users')}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Eye className="w-4 h-4 text-cyan-400" />
                                                <div className="text-xs text-gray-400">Active (24h)</div>
                                            </div>
                                            <div className="text-2xl font-bold">{adminStats.activeUsers24h}</div>
                                            <div className="text-xs text-gray-500 mt-1">Daily active</div>
                                        </div>
                                        <div
                                            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                                            onClick={() => router.push('/admin/coupons')}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                                <div className="text-xs text-gray-400">Coupons</div>
                                            </div>
                                            <div className="text-2xl font-bold">Manage</div>
                                            <div className="text-xs text-gray-500 mt-1">Create & Edit</div>
                                        </div>
                                    </div>

                                    {/* Payment & Login */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <CreditCard className="w-4 h-4 text-blue-400" />
                                                <h3 className="font-semibold">Payments</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Success Rate</span>
                                                    <span className="font-bold text-green-400">{adminStats.paymentStats.successRate.toFixed(1)}%</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Successful</span>
                                                    <span>{adminStats.paymentStats.successful}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Failed</span>
                                                    <span className="text-red-400">{adminStats.paymentStats.failed}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <LogIn className="w-4 h-4 text-purple-400" />
                                                <h3 className="font-semibold">Logins</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Today</span>
                                                    <span className="font-bold">{adminStats.loginStats.today}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">This Week</span>
                                                    <span>{adminStats.loginStats.thisWeek}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">This Month</span>
                                                    <span>{adminStats.loginStats.thisMonth}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-400">Loading admin stats...</div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* REGULAR USER VIEW */
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

                                {/* Import Resume Card */}
                                <Card
                                    hover
                                    className="border-2 border-dashed border-green-300 bg-green-50 cursor-pointer flex items-center justify-center min-h-[200px] relative"
                                    onClick={() => document.getElementById('resume-upload')?.click()}
                                >
                                    <input
                                        type="file"
                                        id="resume-upload"
                                        className="hidden"
                                        accept=".pdf,.docx,.doc"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            try {
                                                setLoading(true);
                                                const formData = new FormData();
                                                formData.append('resume', file);

                                                // 1. Upload and Parse
                                                const uploadRes = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: formData
                                                });

                                                if (!uploadRes.ok) {
                                                    const err = await uploadRes.json();
                                                    throw new Error(err.error || 'Upload failed');
                                                }

                                                const { structuredData, fileName } = await uploadRes.json();

                                                // 2. Create New Resume with Parsed Data
                                                const createRes = await fetch('/api/resumes', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        title: `Imported: ${fileName.replace(/\.[^/.]+$/, "")}`,
                                                        data: structuredData
                                                    })
                                                });

                                                if (createRes.ok) {
                                                    const { resume } = await createRes.json();
                                                    router.push(`/editor/${resume.id}`);
                                                }
                                            } catch (error) {
                                                console.error('Import failed:', error);
                                                alert('Failed to import resume. Please try again.');
                                                setLoading(false);
                                            }
                                        }}
                                    />
                                    <div className="text-center">
                                        <div className="text-5xl mb-4">📤</div>
                                        <h3 className="text-xl font-semibold text-green-600">Import Resume</h3>
                                        <p className="text-sm text-gray-600 mt-2">Auto-fill from PDF/Word</p>
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
                                                    title="AI Analysis"
                                                >
                                                    📊
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.push(`/dashboard/jobs?resumeId=${resume.id}`)}
                                                    title="Job Matches"
                                                    className="text-blue-600 hover:bg-blue-50"
                                                >
                                                    💼
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={async (e) => {
                                                        e.stopPropagation(); // Prevent card click
                                                        e.preventDefault(); // Prevent any default action
                                                        const confirmed = window.confirm('Are you sure you want to delete this resume?');
                                                        if (confirmed) {
                                                            try {
                                                                console.log('Deleting resume:', resume.id);
                                                                const response = await fetch(`/api/resumes/${resume.id}`, {
                                                                    method: 'DELETE',
                                                                });

                                                                console.log('Delete response status:', response.status);
                                                                const data = await response.json();
                                                                console.log('Delete response data:', data);

                                                                if (response.ok) {
                                                                    alert('Resume deleted successfully!');
                                                                    fetchResumes();
                                                                } else {
                                                                    alert(`Failed to delete: ${data.error || 'Unknown error'}`);
                                                                    console.error('Delete failed:', data);
                                                                }
                                                            } catch (error) {
                                                                console.error('Failed to delete resume:', error);
                                                                alert('Error deleting resume. Check console for details.');
                                                            }
                                                        } else {
                                                            console.log('Delete cancelled by user');
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
                )}
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
