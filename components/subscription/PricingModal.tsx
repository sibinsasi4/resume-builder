'use client';

import { useState } from 'react';
import { X, Check, Crown, Download, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPlan: (plan: string, gateway: 'razorpay', couponCode?: string) => void;
}

const plans = [
    {
        id: 'payperuse',
        name: 'Pay Per Download',
        price: 19,
        currency: '₹',
        period: 'per download',
        features: [
            '1 resume download',
            '3 AI analyses included',
            'All premium templates',
            'No watermark',
        ],
        icon: Download,
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'monthly',
        name: 'Monthly Pro',
        price: 299,
        currency: '₹',
        period: 'month',
        features: [
            '30 downloads/month',
            'Unlimited AI analyses',
            'All premium templates',
            'Priority support',
            'Version history',
            'DOCX export',
        ],
        icon: Crown,
        gradient: 'from-purple-500 to-pink-500',
        popular: true,
    },
];

export default function PricingModal({ isOpen, onClose, onSelectPlan }: PricingModalProps) {
    const [selectedGateway] = useState<'razorpay'>('razorpay');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [couponError, setCouponError] = useState('');

    const handleApplyCoupon = async () => {
        setValidatingCoupon(true);
        setCouponError('');
        try {
            const response = await fetch('/api/payments/coupon/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode }),
            });
            const data = await response.json();
            if (response.ok) {
                setAppliedCoupon(data);
            } else {
                setCouponError(data.error || 'Invalid coupon');
            }
        } catch (error) {
            setCouponError('Failed to validate coupon');
        } finally {
            setValidatingCoupon(false);
        }
    };

    const getDiscountedPrice = (originalPrice: number) => {
        if (!appliedCoupon) return originalPrice;
        if (appliedCoupon.type === 'percentage') {
            return Math.round(originalPrice - (originalPrice * appliedCoupon.discount / 100));
        }
        return Math.max(0, originalPrice - appliedCoupon.discount);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-5xl bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Header */}
                <div className="p-8 text-center border-b border-white/10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-4">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-white">Upgrade to unlock all features</span>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Choose Your Plan
                    </h2>
                    <p className="text-gray-300">Select the perfect plan for your needs</p>
                </div>

                {/* Plans */}
                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {plans.map((plan) => {
                            const Icon = plan.icon;
                            return (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${plan.popular
                                        ? 'border-purple-500 shadow-lg shadow-purple-500/30'
                                        : 'border-white/10'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-semibold text-white">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    <div className="text-3xl font-bold text-white mb-1">
                                        ₹{getDiscountedPrice(plan.price)}
                                        {appliedCoupon && (
                                            <span className="text-lg text-gray-400 line-through ml-2">₹{plan.price}</span>
                                        )}
                                    </div>

                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-2xl font-bold text-gray-400">{plan.currency}</span>
                                        <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                            {plan.price}
                                        </span>
                                        <span className="text-gray-400">/{plan.period}</span>
                                    </div>

                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-300 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        onClick={() => onSelectPlan(plan.id, selectedGateway, appliedCoupon?.code)}
                                        className={`w-full ${plan.popular
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                            : 'bg-white/10 hover:bg-white/20 border border-white/20'
                                            }`}
                                    >
                                        Select Plan
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Coupon Code Section */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Have a Coupon?</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Enter code"
                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                disabled={!!appliedCoupon}
                            />
                            {appliedCoupon ? (
                                <button
                                    onClick={() => {
                                        setAppliedCoupon(null);
                                        setCouponCode('');
                                    }}
                                    className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                    Remove
                                </button>
                            ) : (
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={!couponCode || validatingCoupon}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {validatingCoupon ? 'Checking...' : 'Apply'}
                                </button>
                            )}
                        </div>
                        {couponError && (
                            <p className="text-red-400 text-sm mt-2">{couponError}</p>
                        )}
                        {appliedCoupon && (
                            <div className="mt-2 text-green-400 text-sm flex justify-between items-center">
                                <span>Coupon applied: {appliedCoupon.code}</span>
                                <span className="font-bold">
                                    -{appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : `₹${appliedCoupon.discount}`}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Payment Gateway Selection - Hidden as only Razorpay is supported */}
                    {/* <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setSelectedGateway('razorpay')}
                                className={`p-4 rounded-xl border-2 transition-all ${selectedGateway === 'razorpay'
                                        ? 'border-purple-500 bg-purple-500/20'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <div className="text-left">
                                    <div className="font-semibold text-white mb-1">Razorpay (India)</div>
                                    <div className="text-sm text-gray-400">UPI, Cards, Net Banking, Wallets</div>
                                </div>
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
