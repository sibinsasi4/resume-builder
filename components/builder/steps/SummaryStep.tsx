'use client';

import { useState } from 'react';
import { ResumeData } from '@/lib/types';
import { Sparkles, Loader2 } from 'lucide-react';

interface SummaryStepProps {
    data: ResumeData;
    onChange: (updates: Partial<ResumeData>) => void;
}

export default function SummaryStep({ data, onChange }: SummaryStepProps) {
    const [generating, setGenerating] = useState(false);

    const generateSummary = async () => {
        if (!data.personalInfo.fullName) {
            alert('Please fill in your personal info first (Step 2)');
            return;
        }

        setGenerating(true);
        try {
            // Build context from existing resume data
            const context = {
                name: data.personalInfo.fullName,
                experience: data.experience?.map(e => `${e.position} at ${e.company}`).join(', ') || 'Not specified',
                skills: data.skills?.flatMap(s => s.items).join(', ') || 'Not specified',
                education: data.education?.map(e => `${e.degree} in ${e.field}`).join(', ') || 'Not specified',
            };

            const response = await fetch('/api/ai/generate-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(context),
            });

            if (response.ok) {
                const { summary } = await response.json();
                onChange({ summary });
            } else {
                // Fallback: generate a simple summary locally
                const summary = `Results-driven professional with expertise in ${context.skills !== 'Not specified' ? context.skills.split(',').slice(0, 3).join(', ') : 'various technologies'}. ${context.experience !== 'Not specified' ? `Experienced as ${context.experience.split(',')[0]}.` : ''} Passionate about delivering high-quality solutions and driving business impact.`;
                onChange({ summary });
            }
        } catch (error) {
            console.error('Failed to generate summary:', error);
            // Provide a basic fallback
            onChange({
                summary: `Experienced professional seeking to leverage my skills and expertise to drive results. Committed to continuous learning and delivering exceptional work.`
            });
        } finally {
            setGenerating(false);
        }
    };

    const charCount = (data.summary || '').length;
    const isGoodLength = charCount >= 100 && charCount <= 400;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Professional Summary
                </h2>
                <p className="text-slate-400 mt-2">
                    A compelling summary that grabs the recruiter&apos;s attention
                </p>
            </div>

            {/* Editor */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300">
                        Your Summary
                    </label>
                    <button
                        onClick={generateSummary}
                        disabled={generating}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-400 hover:to-blue-400 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> AI Write for Me
                            </>
                        )}
                    </button>
                </div>

                <textarea
                    value={data.summary || ''}
                    onChange={(e) => onChange({ summary: e.target.value })}
                    placeholder="Write a brief, compelling summary of your professional background, key skills, and career goals. Focus on what makes you unique and the value you bring..."
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 placeholder:text-slate-600 resize-none leading-relaxed"
                />

                {/* Character counter */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-xs">
                        <span className={`${charCount < 50 ? 'text-red-400' : charCount < 100 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                            {charCount < 50 ? '⚠️ Too short' : charCount < 100 ? '🔶 Could be longer' : isGoodLength ? '✅ Great length' : '📝 Detailed'}
                        </span>
                    </div>
                    <span className={`text-xs ${isGoodLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {charCount} characters
                    </span>
                </div>
            </div>

            {/* Writing tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-2">
                <p className="text-blue-300 text-sm font-medium">💡 Writing Tips:</p>
                <ul className="text-blue-200/80 text-sm space-y-1 list-disc list-inside">
                    <li>Start with your years of experience and area of expertise</li>
                    <li>Mention 2-3 key skills or technologies</li>
                    <li>Include a notable achievement with numbers if possible</li>
                    <li>Keep it between 100-400 characters for best results</li>
                </ul>
            </div>
        </div>
    );
}
