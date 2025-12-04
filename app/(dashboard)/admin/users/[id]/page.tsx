'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import Button from '@/components/ui/Button';
import {
    User as UserIcon,
    Mail,
    Calendar,
    Clock,
    Shield,
    Download,
    FileText,
    ArrowLeft,
    Gift,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';

interface UserDetail {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
    subscription: {
        plan: string;
        status: string;
        downloadsLimit: number;
        currentPeriodEnd: string;
    } | null;
    downloads: {
        id: string;
        templateType: string;
        createdAt: string;
        resume: { title: string };
    }[];
    sessions: {
        lastActiveAt: string;
        ipAddress: string | null;
        userAgent: string | null;
    }[];
    _count: {
        resumes: number;
        downloads: number;
    };
    resumes: {
        id: string;
        title: string;
        templateType: string;
        updatedAt: string;
    }[];
}

export default function UserDetailsPage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showGrantModal, setShowGrantModal] = useState(false);
    const [grantAmount, setGrantAmount] = useState('1');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session?.user?.role !== 'admin') {
            // router.push('/dashboard');
        } else {
            fetchUserDetails();
        }
    }, [status, session, router, params.id]);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`/api/admin/users/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGrantAccess = async () => {
        if (!user) return;

        try {
            const response = await fetch('/api/admin/users/grant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    downloads: grantAmount
                }),
            });

            if (response.ok) {
                alert(`Successfully granted ${grantAmount} downloads`);
                setShowGrantModal(false);
                fetchUserDetails(); // Refresh data
            } else {
                alert('Failed to grant access');
            }
        } catch (error) {
            console.error('Error granting access:', error);
            alert('Error granting access');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading user details...</div>;
    if (!user) return <div className="p-8 text-center">User not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <Link href="/admin/users" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name || 'Unknown User'}</h1>
                                <div className="flex items-center gap-2 text-gray-500 mt-1">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    if (!confirm(`Are you sure you want to make ${user.name} an Admin?`)) return;
                                    try {
                                        const response = await fetch(`/api/admin/users/${user.id}`, {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ role: user.role === 'admin' ? 'user' : 'admin' }),
                                        });
                                        if (response.ok) {
                                            alert('User role updated successfully');
                                            fetchUserDetails();
                                        } else {
                                            alert('Failed to update role');
                                        }
                                    } catch (error) {
                                        console.error('Error updating role:', error);
                                        alert('Error updating role');
                                    }
                                }}
                                className={user.role === 'admin' ? 'text-red-600 hover:bg-red-50 border-red-200' : 'text-purple-600 hover:bg-purple-50 border-purple-200'}
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                            </Button>
                            <Button onClick={() => setShowGrantModal(true)}>
                                <Gift className="w-4 h-4 mr-2" /> Grant Downloads
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Subscription Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-500" /> Subscription
                        </h3>
                        {user.subscription ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Plan</span>
                                    <span className="font-medium capitalize">{user.subscription.plan}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${user.subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {user.subscription.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Downloads Left</span>
                                    <span className="font-bold text-blue-600">{user.subscription.downloadsLimit}</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-2">
                                    Expires: {new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">No active subscription</div>
                        )}
                    </div>

                    {/* Usage Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-500" /> Usage
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Resumes Created</span>
                                <span className="font-bold">{user._count.resumes}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Total Downloads</span>
                                <span className="font-bold">{user._count.downloads}</span>
                            </div>
                        </div>
                    </div>

                    {/* Last Activity */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" /> Recent Activity
                        </h3>
                        <div className="space-y-3">
                            {user.sessions.length > 0 ? (
                                user.sessions.map((session, i) => (
                                    <div key={i} className="text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                        <div className="font-medium text-gray-700">
                                            {formatDistanceToNow(new Date(session.lastActiveAt), { addSuffix: true })}
                                        </div>
                                        <div className="text-xs text-gray-400 truncate">
                                            {session.ipAddress || 'Unknown IP'} • {session.userAgent?.split(')')[0] + ')' || 'Unknown Device'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-sm">No recent activity</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resumes List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" /> User Resumes
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Title</th>
                                    <th className="px-6 py-4 font-semibold">Template</th>
                                    <th className="px-6 py-4 font-semibold">Last Updated</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {user.resumes && user.resumes.length > 0 ? (
                                    user.resumes.map((resume) => (
                                        <tr key={resume.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {resume.title || 'Untitled Resume'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium capitalize">
                                                    {resume.templateType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(resume.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/editor/${resume.id}`}
                                                    target="_blank"
                                                    className="inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500"
                                                >
                                                    Open in Editor
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No resumes created yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Download History Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Download className="w-5 h-5 text-green-500" /> Download History
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Resume Title</th>
                                    <th className="px-6 py-4 font-semibold">Template</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {user.downloads.length > 0 ? (
                                    user.downloads.map((dl) => (
                                        <tr key={dl.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {dl.resume.title || 'Untitled Resume'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium capitalize">
                                                    {dl.templateType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(dl.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                            No downloads yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Grant Access Modal */}
            {showGrantModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Grant Free Downloads</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Granting extra downloads to <span className="font-semibold">{user.name}</span>.
                            This will add to their existing limit.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Number of Downloads</label>
                                <select
                                    value={grantAmount}
                                    onChange={(e) => setGrantAmount(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="1">1 Download</option>
                                    <option value="2">2 Downloads</option>
                                    <option value="5">5 Downloads</option>
                                    <option value="10">10 Downloads</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setShowGrantModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleGrantAccess}>
                                    Grant Access
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
