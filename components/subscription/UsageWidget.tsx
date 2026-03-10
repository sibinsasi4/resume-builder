'use client';

import { useEffect, useState } from 'react';
import { Crown, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface UsageData {
    plan: string;
    status: string;
    usage: {
        downloads: { used: number; limit: number; remaining: number };
        analyses: { used: number; limit: number; remaining: number };
        periodEnd?: string;
    };
}

interface UsageWidgetProps {
    onUpgrade: () => void;
}

export default function UsageWidget({ onUpgrade }: UsageWidgetProps) {
    const [data, setData] = useState<UsageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsageData();
    }, []);

    const fetchUsageData = async () => {
        try {
            const response = await fetch('/api/subscription/status');
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error('Failed to fetch usage data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </Card>
        );
    }

    if (!data) return null;

    const isPro = data.plan === 'pro' || data.plan === 'premium';
    const downloadPercentage = data.usage.downloads.limit === 0
        ? 100
        : (data.usage.downloads.used / data.usage.downloads.limit) * 100;
    const analysisPercentage = data.usage.analyses.limit === 0
        ? 100
        : (data.usage.analyses.used / data.usage.analyses.limit) * 100;

    return (
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-colors">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isPro
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : 'bg-white/10 ring-1 ring-white/20'
                        }`}>
                        <Crown className={`w-6 h-6 ${isPro ? 'text-white' : 'text-purple-300'}`} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white capitalize">{data.plan} Plan</h3>
                        <p className="text-sm text-gray-400">
                            {data.status === 'active' ? 'Active' : 'Inactive'}
                        </p>
                    </div>
                </div>
                {!isPro && (
                    <Button
                        size="sm"
                        onClick={onUpgrade}
                        className="bg-white text-purple-900 hover:bg-purple-50 border-0"
                    >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Upgrade
                    </Button>
                )}
            </div>

            {/* Usage Stats */}
            <div className="space-y-6 relative z-10">
                {/* Downloads */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Downloads</span>
                        <span className="text-sm font-semibold text-white">
                            {data.usage.downloads.limit === 0
                                ? `${data.usage.downloads.used} used`
                                : `${data.usage.downloads.remaining} remaining`}
                        </span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                            style={{ width: `${Math.min(downloadPercentage, 100)}%` }}
                        />
                    </div>
                    {data.usage.downloads.limit > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {data.usage.downloads.used} of {data.usage.downloads.limit} used
                        </p>
                    )}
                </div>

                {/* AI Analyses */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">AI Analyses</span>
                        <span className="text-sm font-semibold text-white">
                            {data.usage.analyses.limit === 0
                                ? 'Unlimited'
                                : `${data.usage.analyses.remaining} remaining`}
                        </span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                            style={{ width: `${Math.min(analysisPercentage, 100)}%` }}
                        />
                    </div>
                    {data.usage.analyses.limit > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {data.usage.analyses.used} of {data.usage.analyses.limit} used
                        </p>
                    )}
                </div>
            </div>

            {/* Upgrade CTA for Free Users */}
            {!isPro && (
                <div className="mt-6 p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">Unlock Premium</h4>
                            <p className="text-sm text-purple-200/80 mb-3 leading-relaxed">
                                Get unlimited access to all features
                            </p>
                            <Button
                                size="sm"
                                onClick={onUpgrade}
                                className="bg-white/10 hover:bg-white/20 text-white w-full border border-white/20"
                            >
                                Upgrade Now
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Period Info */}
            {data.usage.periodEnd && (
                <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500 text-center font-medium">
                        Resets on {new Date(data.usage.periodEnd).toLocaleDateString()}
                    </p>
                </div>
            )}
        </Card>
    );
}
