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
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Coupon Management</h1>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Coupon
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold">Code</th>
                            <th className="p-4 font-semibold">Discount</th>
                            <th className="p-4 font-semibold">Bonus</th>
                            <th className="p-4 font-semibold">Usage</th>
                            <th className="p-4 font-semibold">Expires</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono font-medium flex items-center gap-2">
                                    {coupon.code}
                                    <button
                                        onClick={() => copyToClipboard(coupon.code, coupon.id)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        {copiedId === coupon.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                </td>
                                <td className="p-4">
                                    {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                                </td>
                                <td className="p-4">
                                    {coupon.bonusType === 'none' ? '-' :
                                        coupon.bonusType === 'downloads' ? `+${coupon.bonusValue} Downloads` :
                                            `+${coupon.bonusValue} Days`}
                                </td>
                                <td className="p-4">
                                    {coupon.usedCount} / {coupon.maxUses || '∞'}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Never'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-red-500 hover:text-red-700">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create New Coupon</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded-lg p-2 uppercase"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="SUMMER2024"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Discount Type</label>
                                    <select
                                        className="w-full border rounded-lg p-2"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Value</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full border rounded-lg p-2"
                                        value={formData.discount}
                                        onChange={e => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bonus Type</label>
                                    <select
                                        className="w-full border rounded-lg p-2"
                                        value={formData.bonusType}
                                        onChange={e => setFormData({ ...formData, bonusType: e.target.value as any })}
                                    >
                                        <option value="none">None</option>
                                        <option value="downloads">Extra Downloads</option>
                                        <option value="duration">Extra Days</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bonus Value</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full border rounded-lg p-2"
                                        value={formData.bonusValue}
                                        onChange={e => setFormData({ ...formData, bonusValue: parseInt(e.target.value) })}
                                        disabled={formData.bonusType === 'none'}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Max Uses</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg p-2"
                                        value={formData.maxUses}
                                        onChange={e => setFormData({ ...formData, maxUses: e.target.value })}
                                        placeholder="Unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Expires At</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg p-2"
                                        value={formData.expiresAt}
                                        onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
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
