import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
    User,
    Mail,
    Calendar,
    Clock,
    Shield,
    CheckCircle,
    XCircle,
    Search
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (currentUser?.role !== 'admin') {
        redirect('/dashboard');
    }

    // Fetch all users with their latest session
    const users = await prisma.user.findMany({
        include: {
            sessions: {
                orderBy: {
                    lastActiveAt: 'desc'
                },
                take: 1
            },
            _count: {
                select: {
                    resumes: true,
                    downloads: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <User className="w-8 h-8 text-blue-600" />
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
                        {/* Placeholder for search - can be implemented later */}
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(users as any[]).map((user) => {
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
                                                    {/* Downloads disabled for now due to API crash */}
                                                    {/* 
                                                    <div className="text-center" title="Downloads">
                                                        <div className="font-bold text-gray-900">{user._count.downloads}</div>
                                                        <div className="text-xs">Downloads</div>
                                                    </div>
                                                    */}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
