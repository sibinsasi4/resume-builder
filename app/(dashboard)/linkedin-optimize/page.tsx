'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Linkedin, Sparkles, Copy, Loader2, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import PricingModal from '@/components/subscription/PricingModal';
import { usePayment } from '@/hooks/usePayment';

export default function LinkedInOptimizerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [optimization, setOptimization] = useState<any>(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const { handleSelectPlan } = usePayment();

    useEffect(() => {
        checkAccess();
    }, []);

    const checkAccess = async () => {
        try {
            const res = await fetch('/api/subscription/status');
            const data = await res.json();
            if (data.limits?.features?.includes('linkedin_optimization')) {
                setHasAccess(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetch('/api/resumes')
            .then(res => res.json())
            .then(data => {
                if (data.resumes) setResumes(data.resumes);
            });
    }, []);

    const handleGenerate = async () => {
        if (!selectedResumeId) return;

        if (!hasAccess) {
            setShowPricing(true);
            return;
        }

        setLoading(true);
        setOptimization(null);

        try {
            const response = await fetch('/api/ai/linkedin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId: selectedResumeId }),
            });

            const data = await response.json();

            if (response.ok) {
                setOptimization(data.optimization);
            } else {
                alert(data.error || 'Failed to generate optimization');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-[#0077b5] p-3 rounded-lg shadow-lg shadow-blue-500/20">
                    <Linkedin className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">LinkedIn Optimizer</h1>
                    <p className="text-gray-400">Transform your resume into a high-impact LinkedIn profile.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 text-white">
                        <h2 className="font-semibold text-lg mb-4 text-white">1. Select Source Resume</h2>
                        <select
                            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                        >
                            <option value="" className="bg-gray-900">Choose a resume...</option>
                            {resumes.map((r) => (
                                <option key={r.id} value={r.id} className="bg-gray-900">{r.title}</option>
                            ))}
                        </select>
                        <Button
                            onClick={handleGenerate}
                            disabled={!selectedResumeId || loading}
                            className="w-full bg-[#0077b5] hover:bg-[#006097] text-white py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Optimize Profile
                                </>
                            )}
                        </Button>
                    </Card>

                    {optimization && (
                        <Card className="p-6 bg-blue-500/10 border-blue-500/20 backdrop-blur-xl">
                            <h3 className="font-semibold text-blue-300 mb-2">Optimization Tips</h3>
                            <ul className="text-sm text-blue-200/80 space-y-2 list-disc pl-4">
                                <li>Use the generated headline to increase search visibility.</li>
                                <li>The "About" section is your elevator pitch—make it personal.</li>
                                <li>Sprinkle the suggested keywords throughout your profile.</li>
                            </ul>
                        </Card>
                    )}
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-2 space-y-6">
                    {!optimization ? (
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-dashed border-white/10 p-12 text-center text-gray-500">
                            <Linkedin className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <h3 className="text-lg font-medium text-white mb-2">Ready to Optimize</h3>
                            <p>Select a resume and click generate to see AI suggestions.</p>
                        </div>
                    ) : (
                        <>
                            {/* Headline */}
                            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-white">Professional Headline</h3>
                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(optimization.headline)} className="text-gray-400 hover:text-white">
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-gray-200 font-medium">
                                    {optimization.headline}
                                </div>
                            </Card>

                            {/* About */}
                            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-white">About Section</h3>
                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(optimization.about)} className="text-gray-400 hover:text-white">
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {optimization.about}
                                </div>
                            </Card>

                            {/* Keywords */}
                            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                                <h3 className="font-semibold text-white mb-4">SEO Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {optimization.keywords.map((kw: string, i: number) => (
                                        <span key={i} className="bg-white/10 text-gray-200 px-3 py-1 rounded-full text-sm font-medium border border-white/5">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </Card>

                            {/* Experience Tips */}
                            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                                <h3 className="font-semibold text-white mb-4">Experience Enhancements</h3>
                                <div className="space-y-4">
                                    {optimization.experienceEnhancements.map((tip: string, i: number) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <div className="bg-green-500/20 p-1 rounded mt-1">
                                                <ArrowRight className="w-3 h-3 text-green-400" />
                                            </div>
                                            <p className="text-gray-300 text-sm">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </>
                    )}
                </div>
            </div>

            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                onSelectPlan={handleSelectPlan}
            />
        </div>
    );
}
