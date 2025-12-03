'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Trash2, Plus, Tag } from 'lucide-react';

interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    maxUses: number | null;
    usedCount: number;
    expiresAt: string | null;
    isActive: boolean;
}

export default function AdminCouponsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount: '',
        type: 'percentage',
        maxUses: '',
        expiresAt: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session?.user?.role !== 'admin') {
            router.push('/dashboard');
        } else {
            fetchCoupons();
        }
    }, [status, session, router]);

    const fetchCoupons = async () => {
        try {
            const response = await fetch('/api/admin/coupons');
            if (response.ok) {
                const data = await response.json();
                setCoupons(data.coupons);
            }
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCoupon),
            });

            if (response.ok) {
                setShowCreateModal(false);
                setNewCoupon({
                    code: '',
                    discount: '',
                    type: 'percentage',
                    maxUses: '',
                    expiresAt: '',
                });
                fetchCoupons();
                alert('Coupon created successfully!');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to create coupon');
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            alert('Error creating coupon');
        }
    };

    const handleDeleteCoupon = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const response = await fetch(`/api/admin/coupons/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchCoupons();
            } else {
                alert('Failed to delete coupon');
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Tag className="w-6 h-6" />
                    Coupon Management
                </h1>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Coupon
                </Button>
            </div>

            <div className="grid gap-4">
                {coupons.map((coupon) => (
                    <Card key={coupon.id} className="p-4 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-lg bg-gray-100 px-2 py-1 rounded">
                                    {coupon.code}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                {coupon.type === 'percentage' ? `${coupon.discount}% Off` : `₹${coupon.discount} Off`}
                                {' • '}
                                {coupon.usedCount} / {coupon.maxUses || '∞'} uses
                                {coupon.expiresAt && ` • Expires: ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </Card>
                ))}
                {coupons.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                        No coupons found. Create one to get started.
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>
                        <form onSubmit={handleCreateCoupon} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Coupon Code</label>
                                <input
                                    type="text"
                                    required
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g., WELCOME50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        value={newCoupon.type}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Discount Value</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={newCoupon.discount}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Max Uses (Optional)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newCoupon.maxUses}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Expiry (Optional)</label>
                                    <input
                                        type="date"
                                        value={newCoupon.expiresAt}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create Coupon</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
