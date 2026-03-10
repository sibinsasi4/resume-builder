'use client';

import { useState } from 'react';
import { ResumeData } from '@/lib/types';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface EducationStepProps {
    data: ResumeData;
    onChange: (updates: Partial<ResumeData>) => void;
}

export default function EducationStep({ data, onChange }: EducationStepProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const addEducation = () => {
        const newEdu = {
            id: Date.now().toString(),
            institution: '',
            degree: '',
            field: '',
            location: '',
            startDate: '',
            endDate: '',
            gpa: '',
            achievements: [],
        };
        onChange({ education: [...(data.education || []), newEdu] });
        setExpandedIds((prev) => new Set([...prev, newEdu.id]));
    };

    const updateEducation = (index: number, field: string, value: any) => {
        const updated = [...(data.education || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ education: updated });
    };

    const removeEducation = (index: number) => {
        const updated = [...(data.education || [])];
        updated.splice(index, 1);
        onChange({ education: updated });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Education
                </h2>
                <p className="text-slate-400 mt-2">
                    Add your educational background
                </p>
            </div>

            {/* Education cards */}
            <div className="space-y-3">
                {(data.education || []).map((edu, index) => {
                    const isExpanded = expandedIds.has(edu.id);
                    return (
                        <div key={edu.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all">
                            {/* Header */}
                            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggleExpand(edu.id)}>
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-lg flex-shrink-0">
                                    🎓
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium text-sm truncate">
                                        {edu.degree || edu.institution ? `${edu.degree || 'Degree'} – ${edu.institution || 'Institution'}` : `Education #${index + 1}`}
                                    </h4>
                                    {edu.field && <p className="text-xs text-slate-500">{edu.field}</p>}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeEducation(index); }}
                                    className="text-slate-600 hover:text-red-400 p-1 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </div>

                            {/* Expanded form */}
                            {isExpanded && (
                                <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-slate-400 mb-1 block">Institution</label>
                                            <input
                                                type="text"
                                                value={edu.institution || ''}
                                                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                                placeholder="MIT, Stanford University, etc."
                                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400 mb-1 block">Degree</label>
                                            <input
                                                type="text"
                                                value={edu.degree || ''}
                                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                placeholder="Bachelor of Science"
                                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400 mb-1 block">Field of Study</label>
                                            <input
                                                type="text"
                                                value={edu.field || ''}
                                                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                                placeholder="Computer Science"
                                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400 mb-1 block">Location</label>
                                            <input
                                                type="text"
                                                value={edu.location || ''}
                                                onChange={(e) => updateEducation(index, 'location', e.target.value)}
                                                placeholder="Cambridge, MA"
                                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400 mb-1 block">GPA (optional)</label>
                                            <input
                                                type="text"
                                                value={edu.gpa || ''}
                                                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                                placeholder="3.8/4.0"
                                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-slate-400 mb-1 block">Start Date</label>
                                            <input
                                                type="text"
                                                value={edu.startDate || ''}
                                                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                                placeholder="Sep 2018"
                                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400 mb-1 block">End Date</label>
                                            <input
                                                type="text"
                                                value={edu.endDate || ''}
                                                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                                placeholder="Jun 2022"
                                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add button */}
            <button
                onClick={addEducation}
                className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
                <Plus className="w-5 h-5" />
                Add Education
            </button>

            {(!data.education || data.education.length === 0) && (
                <div className="text-center py-6">
                    <p className="text-slate-500 text-sm">No education added yet.</p>
                </div>
            )}
        </div>
    );
}
