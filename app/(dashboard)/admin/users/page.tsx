'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Button from '@/components/ui/Button';
import {
    User as UserIcon,
    Mail,
    Calendar,
    Clock,
    Shield,
    CheckCircle,
    Search,
    Gift
} from 'lucide-react';

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
    sessions: { lastActiveAt: string }[];
    _count: {
        resumes: number;
        downloads: number;
    };
}

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGrantModal, setShowGrantModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [grantAmount, setGrantAmount] = useState('1');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session?.user?.role !== 'admin') {
            // router.push('/dashboard'); // Allow loading to check role
        } else {
            fetchUsers();
        }
    }, [status, session, router]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGrantAccess = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch('/api/admin/users/grant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    downloads: grantAmount
                }),
            });

            if (response.ok) {
                alert(`Successfully granted ${grantAmount} downloads to ${selectedUser.name || selectedUser.email}`);
                setShowGrantModal(false);
                setSelectedUser(null);
            } else {
                alert('Failed to grant access');
            }
        } catch (error) {
            console.error('Error granting access:', error);
            alert('Error granting access');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <UserIcon className="w-8 h-8 text-blue-600" />
                        User Management
                    </h1>
                    <p className="text-gray-500 mt-2">View and manage registered users</p>
                </div>

                {/* Users Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                Total Users: {users.length}
                            </span>
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">User</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Joined</th>
                                    <th className="px-6 py-4 font-semibold">Last Login</th>
                                    <th className="px-6 py-4 font-semibold text-center">Activity</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => {
                                    const lastSession = user.sessions?.[0];
                                    const isOnline = lastSession &&
                                        (new Date().getTime() - new Date(lastSession.lastActiveAt).getTime() < 24 * 60 * 60 * 1000);

                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{user.name || 'Unknown'}</div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${isOnline
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {isOnline ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3" /> Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-3 h-3" /> Inactive
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    {lastSession ? (
                                                        formatDistanceToNow(new Date(lastSession.lastActiveAt), { addSuffix: true })
                                                    ) : (
                                                        <span className="text-gray-400">Never</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-4 text-sm text-gray-500">
                                                    <div className="text-center" title="Resumes Created">
                                                        <div className="font-bold text-gray-900">{user._count?.resumes || 0}</div>
                                                        <div className="text-xs">Resumes</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 text-sm border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
                                                >
                                                    View
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedUser(user);
                                                        setShowGrantModal(true);
                                                    }}
                                                    className="text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Gift className="w-4 h-4 mr-1" />
                                                    Grant
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Grant Access Modal */}
            {showGrantModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Grant Free Downloads</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Granting access to <span className="font-semibold">{selectedUser.name || selectedUser.email}</span>
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
