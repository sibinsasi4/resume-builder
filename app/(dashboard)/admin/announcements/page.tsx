'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Megaphone, Trash, Plus, XCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Announcement {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isActive: boolean;
    expiresAt: string;
    createdAt: string;
}

export default function AdminAnnouncementsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Form state
    const [newAnnouncement, setNewAnnouncement] = useState({
        message: '',
        type: 'info' as 'info' | 'warning' | 'success' | 'error',
        duration: '24'
    });

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (session?.user?.role !== 'admin') router.push('/dashboard');
        fetchAnnouncements();
    }, [status, session, router]);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch('/api/admin/announcements');
            if (res.ok) {
                const data = await res.json();
                setAnnouncements(data.announcements);
            }
        } catch (error) {
            console.error('Failed to fetch announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const createAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + parseInt(newAnnouncement.duration));

            const res = await fetch('/api/admin/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: newAnnouncement.message,
                    type: newAnnouncement.type,
                    expiresAt
                })
            });

            if (res.ok) {
                setShowCreateModal(false);
                setNewAnnouncement({ message: '', type: 'info', duration: '24' });
                fetchAnnouncements();
            }
        } catch (error) {
            console.error('Failed to create announcement:', error);
        }
    };

    const deleteAnnouncement = async (id: string) => {
        if (!confirm('Delete this announcement?')) return;
        try {
            await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' });
            fetchAnnouncements();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'success': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'error': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0f1118] flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading announcements...</div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        Global Announcements
                    </h1>
                    <p className="text-gray-400 mt-1">Broadcast messages to all users</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.push('/admin')} className="border-white/20 text-white hover:bg-white/10">
                        ← Back to Admin
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)} className="bg-orange-600 hover:bg-orange-500 text-white border-0">
                        <Plus className="w-4 h-4 mr-2" />
                        New Announcement
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {announcements.map((ann) => (
                    <div key={ann.id} className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeStyles(ann.type)} bg-opacity-20`}>
                                {getTypeIcon(ann.type)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{ann.message}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="capitalize px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                                        {ann.type}
                                    </span>
                                    <span>Created: {new Date(ann.createdAt).toLocaleDateString()}</span>
                                    <span>Expires: {new Date(ann.expiresAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => deleteAnnouncement(ann.id)}
                            className="p-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
                            title="Delete Announcement"
                        >
                            <Trash className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                {announcements.length === 0 && (
                    <div className="text-center py-20 bg-white/5 border border-white/10 rounded-xl border-dashed">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Megaphone className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No active announcements</h3>
                        <p className="text-gray-500">Create an announcement to alert your users</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-white">New Announcement</h2>
                        <form onSubmit={createAnnouncement} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Message</label>
                                <textarea
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors h-24 resize-none"
                                    value={newAnnouncement.message}
                                    onChange={e => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                                    placeholder="Enter your message here..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-300">Type</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white appearance-none focus:outline-none focus:border-orange-500 transition-colors"
                                            value={newAnnouncement.type}
                                            onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any })}
                                        >
                                            <option value="info">Info ℹ️</option>
                                            <option value="warning">Warning ⚠️</option>
                                            <option value="success">Success ✅</option>
                                            <option value="error">Error 🚨</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-300">Duration</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white appearance-none focus:outline-none focus:border-orange-500 transition-colors"
                                            value={newAnnouncement.duration}
                                            onChange={e => setNewAnnouncement({ ...newAnnouncement, duration: e.target.value })}
                                        >
                                            <option value="24">24 Hours</option>
                                            <option value="48">48 Hours</option>
                                            <option value="168">1 Week</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 border-white/20 text-gray-300 hover:bg-white/5 hover:text-white">
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-500 text-white border-0">
                                    Post Message
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
