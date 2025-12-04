'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Check, Sparkles, Zap, Crown, Download, Infinity } from 'lucide-react';

const plans = [
    {
        name: 'Pay Per Download',
        price: 19,
        currency: '₹',
        period: 'per download',
        description: 'Perfect for one-time use',
        features: [
            '1 resume download',
            'All premium templates',
            'AI analysis included',
            'High-quality PDF',
            'No watermark',
            'High-quality PDF',
            'No watermark',
            'Instant access',
            'AI Cover Letter (1-day access)',
            'LinkedIn Optimizer (1-day access)',
            'Mock Interview (1-day access)',
        ],
        cta: 'Download Now',
        href: '/signup?plan=payperuse',
        popular: false,
        icon: <Download className="w-6 h-6" />,
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        name: 'Monthly Pro',
        price: 299,
        currency: '₹',
        period: 'month',
        downloads: 30,
        description: 'Best value for job seekers',
        features: [
            '30 resume downloads/month',
            'All premium templates',
            'Unlimited AI analyses',
            'Priority support',
            'Version history',
            'Custom branding',
            'DOCX export',
            'No watermark',
            'AI Cover Letter Generator',
            'LinkedIn Profile Optimizer',
            'Mock Interview Prep (Voice Mode)',
            'Interview Feedback & Scoring',
        ],
        cta: 'Start Free Trial',
        href: '/signup?plan=monthly',
        popular: true,
        icon: <Crown className="w-6 h-6" />,
        gradient: 'from-purple-500 to-pink-500',
        badge: 'Most Popular',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For teams and organizations',
        features: [
            'Unlimited downloads',
            'Team collaboration',
            'Custom templates',
            'Dedicated support',
            'API access',
            'White-label option',
            'Advanced analytics',
            'Custom integrations',
        ],
        cta: 'Contact Sales',
        href: '/contact',
        popular: false,
        icon: <Infinity className="w-6 h-6" />,
        gradient: 'from-orange-500 to-red-500',
    },
];

export default function PricingPage() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Header */}
            <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                VISISH
                            </span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Limited time offer - Save 40%</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Simple, Transparent Pricing
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                    Choose the plan that works best for you. No hidden fees, cancel anytime.
                </p>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-300 hover:scale-105 ${plan.popular
                                ? 'border-purple-500 shadow-2xl shadow-purple-500/30 scale-105'
                                : 'border-white/10 hover:border-white/20'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-semibold">
                                    {plan.badge}
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                                {plan.icon}
                            </div>

                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-gray-400 mb-6">{plan.description}</p>

                            {/* Price */}
                            <div className="mb-6">
                                {typeof plan.price === 'number' ? (
                                    <>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-3xl font-bold text-gray-400">{plan.currency}</span>
                                            <span className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                                {plan.price}
                                            </span>
                                        </div>
                                        <div className="text-gray-400 mt-2">
                                            {plan.period}
                                            {plan.downloads && (
                                                <span className="block text-sm text-purple-400 mt-1">
                                                    {plan.downloads} downloads included
                                                </span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                        {plan.price}
                                    </div>
                                )}
                            </div>

                            {/* CTA Button */}
                            <Link href={plan.href}>
                                <Button
                                    className={`w-full mb-6 ${plan.popular
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>

                            {/* Features */}
                            <ul className="space-y-3 text-left">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Value Proposition */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 mb-16">
                    <h2 className="text-4xl font-bold mb-4">Why Choose VISISH?</h2>
                    <div className="grid md:grid-cols-3 gap-8 mt-8">
                        <div>
                            <div className="text-5xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold mb-2">Instant Downloads</h3>
                            <p className="text-blue-100">Get your resume in seconds, not hours</p>
                        </div>
                        <div>
                            <div className="text-5xl mb-4">🎨</div>
                            <h3 className="text-xl font-bold mb-2">Premium Templates</h3>
                            <p className="text-blue-100">Designed by professionals, loved by recruiters</p>
                        </div>
                        <div>
                            <div className="text-5xl mb-4">🤖</div>
                            <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                            <p className="text-blue-100">Smart suggestions to beat ATS systems</p>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto text-left">
                    <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <h3 className="font-semibold text-lg mb-2">How does pay-per-download work?</h3>
                            <p className="text-gray-400">
                                Pay ₹19 each time you download a resume. Perfect if you only need one resume. No subscription required.
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <h3 className="font-semibold text-lg mb-2">What happens after 30 downloads?</h3>
                            <p className="text-gray-400">
                                With the Monthly Pro plan, you get 30 downloads per month. After that, you can either wait for next month or purchase additional downloads at ₹19 each.
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <h3 className="font-semibold text-lg mb-2">Can I cancel my subscription?</h3>
                            <p className="text-gray-400">
                                Yes! Cancel anytime. You'll keep access until the end of your billing period.
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
                            <p className="text-gray-400">
                                Yes! Get 7 days free with the Monthly Pro plan. No credit card required.
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                            <p className="text-gray-400">
                                We accept UPI, Credit/Debit Cards, Net Banking, and all major payment methods via Razorpay.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-16 bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                    <h2 className="text-4xl font-bold mb-4">Ready to Build Your Perfect Resume?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of professionals who landed their dream jobs with VISISH
                    </p>
                    <Link href="/signup">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/50 text-lg px-8 py-4">
                            Start Creating Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <span className="text-xl font-bold">VISISH</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Premium resume builder for professionals
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
                        © 2024 VISISH. All rights reserved. Made with ❤️ in India
                    </div>
                </div>
            </footer>
        </div>
    );
}
