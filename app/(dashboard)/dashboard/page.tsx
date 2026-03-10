'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UsageWidget from '@/components/subscription/UsageWidget';
import PricingModal from '@/components/subscription/PricingModal';
import WelcomeGuide from '@/components/dashboard/WelcomeGuide';
// import DashboardNavbar from '@/components/dashboard/DashboardNavbar'; // Removed as it is in layout

import { formatDate } from '@/lib/utils';
import {
    Users, FileText, DollarSign, TrendingUp, TrendingDown, Download, Eye, Sparkles,
    CreditCard, LogIn, RefreshCw, AlertCircle, CheckCircle, XCircle, Clock,
    LayoutDashboard, Briefcase, Megaphone
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

    const createNewResume = () => {
        router.push('/builder/new');
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-r-2 border-yellow-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-4 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 text-slate-400 animate-pulse font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                {isAdmin ? (
                    /* ADMIN VIEW */
                    <div className="space-y-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">Resume Management</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div
                                    className="group p-6 bg-slate-900/50 hover:bg-slate-800 border border-white/5 hover:border-amber-500/30 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-amber-500/10"
                                    onClick={() => router.push('/admin')}
                                >
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <LayoutDashboard className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Admin Console</h3>
                                    <p className="text-slate-400 text-sm">Full statistics, announcements, and users</p>
                                </div>
                                <div
                                    className="group p-6 bg-slate-900/50 hover:bg-slate-800 border border-white/5 hover:border-amber-500/30 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-amber-500/10"
                                    onClick={() => router.push('/builder/new')}
                                >
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FileText className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Choose Template</h3>
                                    <p className="text-slate-400 text-sm">Start with a professionally designed template</p>
                                </div>
                                <div
                                    className="group p-6 bg-slate-900/50 hover:bg-slate-800 border border-white/5 hover:border-amber-500/30 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-amber-500/10"
                                    onClick={createNewResume}
                                >
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Sparkles className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Create Blank Resume</h3>
                                    <p className="text-slate-400 text-sm">Start from scratch with an empty canvas</p>
                                </div>
                                <div
                                    className="group p-6 bg-slate-900/50 hover:bg-slate-800 border border-white/5 hover:border-amber-500/30 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-amber-500/10"
                                    onClick={() => router.push('/admin/coupons')}
                                >
                                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <DollarSign className="w-6 h-6 text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Manage Coupons</h3>
                                    <p className="text-slate-400 text-sm">Create and track discount codes</p>
                                </div>

                            </div>
                        </div>

                        {/* Old Admin Dashboard Section - Simplified for dark mode consistency */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Admin Stats</h2>
                                <Button variant="outline" size="sm" onClick={fetchAdminStats} className="border-white/20 text-white hover:bg-white/10">
                                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                                </Button>
                            </div>
                            {adminStats ? (
                                <div className="space-y-6">
                                    {/* Primary Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-sm">
                                            <div className="text-slate-400 text-sm mb-1">Total Users</div>
                                            <div className="text-2xl font-bold text-white">{adminStats.totalUsers}</div>
                                            <div className="text-xs text-green-400 mt-1">+{adminStats.loginStats.today} today</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-sm">
                                            <div className="text-slate-400 text-sm mb-1">Total Revenue</div>
                                            <div className="text-2xl font-bold text-green-400">₹{adminStats.totalRevenue}</div>
                                            <div className="text-xs text-slate-500 mt-1">Lifetime</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-sm">
                                            <div className="text-slate-400 text-sm mb-1">MRR</div>
                                            <div className="text-2xl font-bold text-blue-400">₹{adminStats.financialMetrics.mrr}</div>
                                            <div className="text-xs text-slate-500 mt-1">Monthly Recurring</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-sm cursor-pointer hover:bg-white/10 transition-colors" onClick={() => router.push('/admin/users')}>
                                            <div className="text-slate-400 text-sm mb-1">Active Users (24h)</div>
                                            <div className="text-2xl font-bold text-purple-400">{adminStats.activeUsers24h}</div>
                                            <div className="text-xs text-slate-500 mt-1">Click to view</div>
                                        </div>
                                    </div>

                                    {/* Secondary Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-sm">
                                            <div className="text-slate-400 text-sm mb-1">Successful Payments</div>
                                            <div className="text-xl font-bold text-white">{adminStats.paymentStats.successful}</div>
                                            <div className="text-xs text-green-400 mt-1">{(adminStats.paymentStats.successRate * 100).toFixed(1)}% Rate</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-sm">
                                            <div className="text-slate-400 text-sm mb-1">Failed Payments</div>
                                            <div className="text-xl font-bold text-red-400">{adminStats.paymentStats.failed}</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-sm">
                                            <div className="text-slate-400 text-sm mb-1">Total Resumes</div>
                                            <div className="text-xl font-bold text-yellow-400">{adminStats.totalResumes}</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-sm">
                                            <div className="text-slate-400 text-sm mb-1">Paid Users</div>
                                            <div className="text-xl font-bold text-pink-400">{adminStats.paidUsers}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">Loading stats...</div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* REGULAR USER VIEW */
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Header */}
                            <div>
                                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">My Resumes</h1>
                                <p className="text-slate-400 text-lg">Manage your professional career portfolio</p>
                            </div>

                            {/* Action Grid */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div
                                    onClick={() => router.push('/builder/new')}
                                    className="group relative h-40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20 cursor-pointer overflow-hidden transition-all hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] content-visibility-auto"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform backdrop-blur-sm">
                                            <LayoutDashboard className="w-5 h-5 text-purple-300" />
                                        </div>
                                        <span className="font-semibold text-white">Choose Template</span>
                                    </div>
                                </div>

                                <div className="relative group h-40 bg-slate-900/50 rounded-2xl border border-white/5 shadow-sm cursor-pointer overflow-hidden transition-all hover:shadow-md hover:border-white/10 hover:bg-slate-800/50 backdrop-blur-sm">
                                    <input
                                        type="file"
                                        id="resume-upload"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept=".pdf,.docx,.doc"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            try {
                                                setLoading(true);
                                                const formData = new FormData();
                                                formData.append('resume', file);
                                                const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
                                                if (!uploadRes.ok) throw new Error('Upload failed');
                                                const { structuredData, fileName } = await uploadRes.json();
                                                const createRes = await fetch('/api/resumes', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ title: `Imported: ${fileName.replace(/\.[^/.]+$/, "")}`, data: structuredData })
                                                });
                                                if (createRes.ok) {
                                                    const { resume } = await createRes.json();
                                                    router.push(`/builder/${resume.id}`);
                                                }
                                            } catch (error) {
                                                console.error(error);
                                                alert('Failed to import resume.');
                                                setLoading(false);
                                            }
                                        }}
                                    />
                                    <div className="h-full flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Download className="w-5 h-5 text-green-400" />
                                        </div>
                                        <span className="font-semibold text-white">Import Resume</span>
                                    </div>
                                </div>

                                <div className="group h-40 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700 cursor-pointer overflow-hidden transition-all hover:bg-slate-800/50 hover:border-amber-500/50 backdrop-blur-sm" onClick={createNewResume}>
                                    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Sparkles className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <span className="font-semibold text-white">Create Blank</span>
                                    </div>
                                </div>
                            </div>

                            {/* Resume List */}
                            <div className="space-y-4">
                                {resumes.map((resume) => (
                                    <div
                                        key={resume.id}
                                        className="group relative bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 rounded-2xl p-5 transition-all hover:border-white/10 hover:shadow-lg flex items-center gap-6 backdrop-blur-sm"
                                    >
                                        <div
                                            className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center flex-shrink-0 cursor-pointer hover:ring-2 ring-amber-500/50 transition-all font-serif text-2xl text-slate-400 select-none"
                                            onClick={() => router.push(`/builder/${resume.id}`)}
                                        >
                                            Aa
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-amber-400 transition-colors cursor-pointer" onClick={() => router.push(`/builder/${resume.id}`)}>
                                                {resume.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDate(resume.updatedAt)}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                                <span className="capitalize">{resume.templateType || 'Standard'} Template</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => router.push(`/builder/${resume.id}`)}
                                                className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                                                title="Edit Resume"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => router.push(`/analysis/${resume.id}`)}
                                                className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all"
                                                title="AI Analysis"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => router.push(`/dashboard/jobs?resumeId=${resume.id}`)}
                                                className="p-2.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all"
                                                title="Find Jobs"
                                            >
                                                <Briefcase className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Delete this resume?')) {
                                                        try {
                                                            const res = await fetch(`/api/resumes/${resume.id}`, { method: 'DELETE' });
                                                            if (res.ok) { fetchResumes(); }
                                                        } catch (err) { console.error(err); }
                                                    }
                                                }}
                                                className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-2"
                                                title="Delete"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {resumes.length === 0 && !loading && (
                                    <WelcomeGuide onCreateClick={createNewResume} />
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div className="sticky top-24">
                                <UsageWidget onUpgrade={() => setShowPricingModal(true)} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <PricingModal
                isOpen={showPricingModal}
                onClose={() => setShowPricingModal(false)}
                onSelectPlan={handleSelectPlan}
            />
        </>
    );
}
