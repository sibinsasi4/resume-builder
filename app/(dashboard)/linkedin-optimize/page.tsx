'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Linkedin, Sparkles, Copy, Loader2, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

export default function LinkedInOptimizerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [optimization, setOptimization] = useState<any>(null);

    useEffect(() => {
        fetch('/api/resumes')
            .then(res => res.json())
            .then(data => {
                if (data.resumes) setResumes(data.resumes);
            });
    }, []);

    const handleGenerate = async () => {
        if (!selectedResumeId) return;
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
        <div className="min-h-screen bg-[#f3f2ef]"> {/* LinkedIn background color */}
            <DashboardNavbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-[#0077b5] p-3 rounded-lg">
                        <Linkedin className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">LinkedIn Optimizer</h1>
                        <p className="text-gray-600">Transform your resume into a high-impact LinkedIn profile.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-6">
                            <h2 className="font-semibold text-lg mb-4">1. Select Source Resume</h2>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                                value={selectedResumeId}
                                onChange={(e) => setSelectedResumeId(e.target.value)}
                            >
                                <option value="">Choose a resume...</option>
                                {resumes.map((r) => (
                                    <option key={r.id} value={r.id}>{r.title}</option>
                                ))}
                            </select>
                            <Button
                                onClick={handleGenerate}
                                disabled={!selectedResumeId || loading}
                                className="w-full bg-[#0077b5] hover:bg-[#006097] text-white"
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
                            <Card className="p-6 bg-blue-50 border-blue-100">
                                <h3 className="font-semibold text-blue-900 mb-2">Optimization Tips</h3>
                                <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4">
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
                            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
                                <Linkedin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium">Ready to Optimize</h3>
                                <p>Select a resume and click generate to see AI suggestions.</p>
                            </div>
                        ) : (
                            <>
                                {/* Headline */}
                                <Card className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-semibold text-gray-900">Professional Headline</h3>
                                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(optimization.headline)}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-gray-800 font-medium">
                                        {optimization.headline}
                                    </div>
                                </Card>

                                {/* About */}
                                <Card className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-semibold text-gray-900">About Section</h3>
                                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(optimization.about)}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {optimization.about}
                                    </div>
                                </Card>

                                {/* Keywords */}
                                <Card className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">SEO Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {optimization.keywords.map((kw: string, i: number) => (
                                            <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </Card>

                                {/* Experience Tips */}
                                <Card className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Experience Enhancements</h3>
                                    <div className="space-y-4">
                                        {optimization.experienceEnhancements.map((tip: string, i: number) => (
                                            <div key={i} className="flex gap-3 items-start">
                                                <div className="bg-green-100 p-1 rounded mt-1">
                                                    <ArrowRight className="w-3 h-3 text-green-600" />
                                                </div>
                                                <p className="text-gray-700 text-sm">{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
