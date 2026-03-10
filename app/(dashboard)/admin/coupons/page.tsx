'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Trash, Plus, Copy, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    maxUses: number | null;
    usedCount: number;
    expiresAt: string | null;
    isActive: boolean;
    bonusType: 'none' | 'downloads' | 'duration';
    bonusValue: number;
}

export default function AdminCouponsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        code: '',
        discount: 0,
        type: 'percentage' as 'percentage' | 'fixed',
        maxUses: '',
        expiresAt: '',
        bonusType: 'none' as 'none' | 'downloads' | 'duration',
        bonusValue: 0,
    });

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (session?.user?.role !== 'admin') router.push('/dashboard');
        fetchCoupons();
    }, [status, session, router]);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons');
            if (res.ok) {
                const data = await res.json();
                setCoupons(data.coupons);
            }
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
                    expiresAt: formData.expiresAt || null,
                }),
            });

            if (res.ok) {
                setShowCreateModal(false);
                fetchCoupons();
                setFormData({
                    code: '',
                    discount: 0,
                    type: 'percentage',
                    maxUses: '',
                    expiresAt: '',
                    bonusType: 'none',
                    bonusValue: 0,
                });
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to create coupon');
            }
        } catch (error) {
            console.error('Create failed:', error);
        }
    };

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Coupon Management
                    </h1>
                    <p className="text-gray-400 mt-1">Create and manage discount codes</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.push('/admin')} className="border-white/20 text-white hover:bg-white/10">
                        ← Back to Admin
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)} className="bg-green-600 hover:bg-green-500 text-white border-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Coupon
                    </Button>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 font-semibold text-gray-300">Code</th>
                                <th className="p-4 font-semibold text-gray-300">Discount</th>
                                <th className="p-4 font-semibold text-gray-300">Bonus</th>
                                <th className="p-4 font-semibold text-gray-300">Usage</th>
                                <th className="p-4 font-semibold text-gray-300">Expires</th>
                                <th className="p-4 font-semibold text-gray-300">Status</th>
                                <th className="p-4 font-semibold text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono font-medium flex items-center gap-2 text-white">
                                        {coupon.code}
                                        <button
                                            onClick={() => copyToClipboard(coupon.code, coupon.id)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {copiedId === coupon.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        {coupon.bonusType === 'none' ? '-' :
                                            coupon.bonusType === 'downloads' ? `+${coupon.bonusValue} Downloads` :
                                                `+${coupon.bonusValue} Days`}
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        {coupon.usedCount} <span className="text-gray-500">/</span> {coupon.maxUses || '∞'}
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Never'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${coupon.isActive
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No coupons found. Create your first one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-white">Create New Coupon</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 uppercase text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="SUMMER2024"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-300">Discount Type</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white appearance-none focus:outline-none focus:border-green-500 transition-colors"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-300">Value</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                        value={formData.discount}
                                        onChange={e => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-300">Bonus Type</label>
                                    <select
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white appearance-none focus:outline-none focus:border-green-500 transition-colors"
                                        value={formData.bonusType}
                                        onChange={e => setFormData({ ...formData, bonusType: e.target.value as any })}
                                    >
                                        <option value="none">None</option>
                                        <option value="downloads">Extra Downloads</option>
                                        <option value="duration">Extra Days</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-300">Bonus Value</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={formData.bonusValue}
                                        onChange={e => setFormData({ ...formData, bonusValue: parseInt(e.target.value) })}
                                        disabled={formData.bonusType === 'none'}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-300">Max Uses</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                        value={formData.maxUses}
                                        onChange={e => setFormData({ ...formData, maxUses: e.target.value })}
                                        placeholder="Unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-300">Expires At</label>
                                    <input
                                        type="date"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors [color-scheme:dark]"
                                        value={formData.expiresAt}
                                        onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 border-white/20 text-gray-300 hover:bg-white/5 hover:text-white">
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-500 text-white border-0">
                                    Create Coupon
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
