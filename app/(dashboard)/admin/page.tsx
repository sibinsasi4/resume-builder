'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Users, FileText, DollarSign, TrendingUp, TrendingDown, Download, Eye, Sparkles,
    CreditCard, LogIn, RefreshCw, AlertCircle, CheckCircle, XCircle, Clock
} from 'lucide-react';

interface Stats {
    totalUsers: number;
    totalResumes: number;
    totalDownloads: number;
    totalRevenue: number;
    activeSubscriptions: number;
    paidUsers: number;
    freeUsers: number;
    activeUsers24h: number;
    activeUsers7d: number;
    paymentStats: {
        total: number;
        successful: number;
        failed: number;
        pending: number;
        refunded: number;
        successRate: number;
    };
    loginStats: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    subscriptionStats: {
        newThisMonth: number;
        cancelledThisMonth: number;
        upcomingRenewals: number;
        churnRate: number;
    };
    financialMetrics: {
        mrr: number;
        arr: number;
        arpu: number;
        revenueGrowthRate: number;
    };
    growthMetrics: {
        newUsersThisMonth: number;
        userGrowthRate: number;
    };
    revenueByMonth: Array<{ month: string; revenue: number; label: string }>;
    userGrowthByMonth: Array<{ month: string; users: number; label: string }>;
    subscriptionBreakdown: Array<{ plan: string; count: number }>;
    downloadsByTemplate: Array<{ template: string; count: number }>;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    _count: {
        resumes: number;
    };
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [newAnnouncement, setNewAnnouncement] = useState({
        message: '',
        type: 'info',
        duration: '24'
    });
    const [announcements, setAnnouncements] = useState<any[]>([]);

    const createAnnouncement = async () => {
        if (!newAnnouncement.message) return;

        try {
            // Optimistic update
            const ann = {
                id: Date.now().toString(),
                ...newAnnouncement,
                createdAt: new Date().toISOString(),
                active: true
            };
            setAnnouncements([ann, ...announcements]);
            setNewAnnouncement({ message: '', type: 'info', duration: '24' });

            // In a real app, you'd POST to /api/admin/announcements here
        } catch (error) {
            console.error('Failed to create announcement:', error);
        }
    };

    const deleteAnnouncement = (id: string) => {
        setAnnouncements(announcements.filter(a => a.id !== id));
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (session?.user?.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        fetchData();
    }, [session, status, router]);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/admin/users')
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (usersRes.ok) {
                const data = await usersRes.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading admin dashboard...</div>
            </div>
        );
    }

    const GrowthIndicator = ({ value }: { value: number }) => {
        if (value === 0) return null;
        const isPositive = value > 0;
        return (
            <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(value).toFixed(1)}%</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    VISISH Admin
                                </h1>
                                <p className="text-xs text-gray-400">Administrator Dashboard</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <Link href="/admin/announcements" className="text-sm text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 font-medium">
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                Announcements
                            </Link>
                            <Link href="/admin/coupons" className="text-sm text-green-400 hover:text-green-300 transition-colors flex items-center gap-1 font-medium">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Manage Coupons
                            </Link>
                            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Key Financial Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* MRR */}
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
                        <div className="text-sm text-blue-300 mb-2">Monthly Recurring Revenue</div>
                        <div className="text-3xl font-bold mb-1">₹{stats?.financialMetrics?.mrr?.toLocaleString() || 0}</div>
                        <GrowthIndicator value={stats?.financialMetrics?.revenueGrowthRate || 0} />
                    </div>

                    {/* ARR */}
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
                        <div className="text-sm text-purple-300 mb-2">Annual Recurring Revenue</div>
                        <div className="text-3xl font-bold">₹{stats?.financialMetrics?.arr?.toLocaleString() || 0}</div>
                    </div>

                    {/* ARPU */}
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
                        <div className="text-sm text-green-300 mb-2">Avg Revenue Per User</div>
                        <div className="text-3xl font-bold">₹{stats?.financialMetrics?.arpu?.toFixed(0) || 0}</div>
                    </div>

                    {/* Churn Rate */}
                    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30">
                        <div className="text-sm text-orange-300 mb-2">Churn Rate</div>
                        <div className="text-3xl font-bold">{stats?.subscriptionStats?.churnRate?.toFixed(1) || 0}%</div>
                        <div className="text-xs text-gray-400 mt-2">This month</div>
                    </div>
                </div>

                {/* Stats Grid - 8 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Users */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <GrowthIndicator value={stats?.growthMetrics?.userGrowthRate || 0} />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.totalUsers || 0}</div>
                        <div className="text-sm text-gray-400">Total Users</div>
                        <div className="text-xs text-gray-500 mt-2">
                            {stats?.paidUsers || 0} paid • {stats?.freeUsers || 0} free
                        </div>
                    </div>

                    {/* Paid Users */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.paidUsers || 0}</div>
                        <div className="text-sm text-gray-400">Paid Users</div>
                        <div className="text-xs text-gray-500 mt-2">
                            {stats?.activeSubscriptions || 0} active subscriptions
                        </div>
                    </div>

                    {/* Active Users (24h) */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <Eye className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.activeUsers24h || 0}</div>
                        <div className="text-sm text-gray-400">Active Users (24h)</div>
                        <div className="text-xs text-gray-500 mt-2">
                            {stats?.activeUsers7d || 0} in last 7 days
                        </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">₹{stats?.totalRevenue || 0}</div>
                        <div className="text-sm text-gray-400">Total Revenue</div>
                        <div className="text-xs text-gray-500 mt-2">
                            From {stats?.paidUsers || 0} customers
                        </div>
                    </div>

                    {/* Resumes Created */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.totalResumes || 0}</div>
                        <div className="text-sm text-gray-400">Resumes Created</div>
                        <div className="text-xs text-gray-500 mt-2">
                            {stats?.totalUsers ? ((stats?.totalResumes || 0) / stats.totalUsers).toFixed(1) : 0} per user
                        </div>
                    </div>

                    {/* Total Downloads */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                <Download className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.totalDownloads || 0}</div>
                        <div className="text-sm text-gray-400">Total Downloads</div>
                        <div className="text-xs text-gray-500 mt-2">
                            Actual tracked downloads
                        </div>
                    </div>

                    {/* Active Subscriptions */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.activeSubscriptions || 0}</div>
                        <div className="text-sm text-gray-400">Active Subscriptions</div>
                        <div className="text-xs text-gray-500 mt-2">
                            Currently active plans
                        </div>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold mb-1">
                            {stats?.totalUsers ? ((stats?.paidUsers || 0) / stats.totalUsers * 100).toFixed(1) : 0}%
                        </div>
                        <div className="text-sm text-gray-400">Conversion Rate</div>
                        <div className="text-xs text-gray-500 mt-2">
                            Free to paid conversion
                        </div>
                    </div>
                </div>

                {/* Payment Analytics & Login Stats */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Payment Analytics */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-blue-400" />
                            <h3 className="text-xl font-bold">Payment Analytics</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-sm">Successful</span>
                                </div>
                                <span className="font-bold">{stats?.paymentStats?.successful || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-400" />
                                    <span className="text-sm">Failed</span>
                                </div>
                                <span className="font-bold">{stats?.paymentStats?.failed || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm">Pending</span>
                                </div>
                                <span className="font-bold">{stats?.paymentStats?.pending || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-orange-400" />
                                    <span className="text-sm">Refunded</span>
                                </div>
                                <span className="font-bold">{stats?.paymentStats?.refunded || 0}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold">Success Rate</span>
                                    <span className="text-2xl font-bold text-green-400">
                                        {stats?.paymentStats?.successRate?.toFixed(1) || 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Login Statistics */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <LogIn className="w-5 h-5 text-purple-400" />
                            <h3 className="text-xl font-bold">Login Activity</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Today</span>
                                <span className="text-2xl font-bold">{stats?.loginStats?.today || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">This Week</span>
                                <span className="text-2xl font-bold">{stats?.loginStats?.thisWeek || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">This Month</span>
                                <span className="text-2xl font-bold">{stats?.loginStats?.thisMonth || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Health & Growth */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Subscription Health */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <RefreshCw className="w-5 h-5 text-green-400" />
                            <h3 className="text-xl font-bold">Subscription Health</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">New This Month</span>
                                <span className="text-2xl font-bold text-green-400">
                                    +{stats?.subscriptionStats?.newThisMonth || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Cancelled This Month</span>
                                <span className="text-2xl font-bold text-red-400">
                                    -{stats?.subscriptionStats?.cancelledThisMonth || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Upcoming Renewals (30d)</span>
                                <span className="text-2xl font-bold text-blue-400">
                                    {stats?.subscriptionStats?.upcomingRenewals || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Growth */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-xl font-bold">User Growth</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">New Users This Month</span>
                                <span className="text-2xl font-bold text-green-400">
                                    +{stats?.growthMetrics?.newUsersThisMonth || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Growth Rate</span>
                                <div className="flex items-center gap-2">
                                    <GrowthIndicator value={stats?.growthMetrics?.userGrowthRate || 0} />
                                    <span className="text-xl font-bold">
                                        {Math.abs(stats?.growthMetrics?.userGrowthRate || 0).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Breakdown & Popular Templates */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Subscription Breakdown */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-xl font-bold mb-4">Subscription Breakdown</h3>
                        {stats?.subscriptionBreakdown && stats.subscriptionBreakdown.length > 0 ? (
                            <div className="space-y-3">
                                {stats.subscriptionBreakdown.map((sub, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                                            <span className="capitalize">{sub.plan}</span>
                                        </div>
                                        <span className="font-bold">{sub.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No active subscriptions yet</p>
                        )}
                    </div>

                    {/* Popular Templates */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-xl font-bold mb-4">Popular Templates</h3>
                        {stats?.downloadsByTemplate && stats.downloadsByTemplate.length > 0 ? (
                            <div className="space-y-3">
                                {stats.downloadsByTemplate.slice(0, 5).map((template, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                                            <span className="capitalize">{template.template}</span>
                                        </div>
                                        <span className="font-bold">{template.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No downloads tracked yet</p>
                        )}
                    </div>
                </div>

                {/* Announcement Management */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden mb-8">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Global Announcements</h2>
                            <p className="text-sm text-gray-400 mt-1">Broadcast messages to all users</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Enter announcement message..."
                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newAnnouncement.message}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                            />
                            <select
                                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newAnnouncement.type}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                            >
                                <option value="info" className="text-black">Info ℹ️</option>
                                <option value="warning" className="text-black">Warning ⚠️</option>
                                <option value="success" className="text-black">Success ✅</option>
                                <option value="error" className="text-black">Error 🚨</option>
                            </select>
                            <select
                                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newAnnouncement.duration}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, duration: e.target.value })}
                            >
                                <option value="24" className="text-black">24 Hours</option>
                                <option value="48" className="text-black">48 Hours</option>
                                <option value="168" className="text-black">1 Week</option>
                            </select>
                            <button
                                onClick={createAnnouncement}
                                disabled={!newAnnouncement.message}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post
                            </button>
                        </div>

                        <div className="space-y-3">
                            {announcements.map((ann) => (
                                <div key={ann.id} className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ann.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                            ann.type === 'success' ? 'bg-green-500/20 text-green-400' :
                                                ann.type === 'error' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {ann.type}
                                        </span>
                                        <span className="font-medium">{ann.message}</span>
                                        <span className="text-xs text-gray-500">
                                            Expires: {new Date(ann.expiresAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteAnnouncement(ann.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {announcements.length === 0 && (
                                <p className="text-center text-gray-400 py-4">No active announcements</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-2xl font-bold">Recent Users</h2>
                        <p className="text-sm text-gray-400 mt-1">Manage all registered users</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Resumes</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{user.name || 'No name'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                                ? 'bg-purple-500/20 text-purple-400'
                                                : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{user._count.resumes}</td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-purple-400 hover:text-purple-300 transition-colors">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
