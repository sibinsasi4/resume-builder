'use client';

import { ResumeData } from '@/lib/types';
import { Plus, Trash2, Award, Trophy, Globe2 } from 'lucide-react';

interface ExtrasStepProps {
    data: ResumeData;
    onChange: (updates: Partial<ResumeData>) => void;
}

export default function ExtrasStep({ data, onChange }: ExtrasStepProps) {
    // --- Certifications ---
    const addCertification = () => {
        const newCert = {
            id: Date.now().toString(),
            name: '',
            issuer: '',
            date: '',
        };
        onChange({ certifications: [...(data.certifications || []), newCert] });
    };

    const updateCertification = (index: number, field: string, value: string) => {
        const updated = [...(data.certifications || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ certifications: updated });
    };

    const removeCertification = (index: number) => {
        const updated = [...(data.certifications || [])];
        updated.splice(index, 1);
        onChange({ certifications: updated });
    };

    // --- Achievements ---
    const addAchievement = () => {
        onChange({ achievements: [...(data.achievements || []), ''] });
    };

    const updateAchievement = (index: number, value: string) => {
        const updated = [...(data.achievements || [])];
        updated[index] = value;
        onChange({ achievements: updated });
    };

    const removeAchievement = (index: number) => {
        const updated = [...(data.achievements || [])];
        updated.splice(index, 1);
        onChange({ achievements: updated });
    };

    // --- Languages ---
    const addLanguage = () => {
        const newLang = {
            id: Date.now().toString(),
            name: '',
            proficiency: 'Intermediate',
        };
        onChange({ languages: [...(data.languages || []), newLang] });
    };

    const updateLanguage = (index: number, field: string, value: string) => {
        const updated = [...(data.languages || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ languages: updated });
    };

    const removeLanguage = (index: number) => {
        const updated = [...(data.languages || [])];
        updated.splice(index, 1);
        onChange({ languages: updated });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Extra Sections
                </h2>
                <p className="text-slate-400 mt-2">
                    Add certifications, achievements, and languages to stand out
                </p>
            </div>

            {/* Certifications */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-semibold text-white">Certifications</h3>
                </div>
                <div className="space-y-3">
                    {(data.certifications || []).map((cert, index) => (
                        <div key={cert.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start bg-slate-950/50 rounded-lg p-3 border border-white/5">
                            <input
                                type="text"
                                value={cert.name || ''}
                                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                placeholder="AWS Solutions Architect"
                                className="px-3 py-2 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                            />
                            <input
                                type="text"
                                value={cert.issuer || ''}
                                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                placeholder="Amazon Web Services"
                                className="px-3 py-2 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={cert.date || ''}
                                    onChange={(e) => updateCertification(index, 'date', e.target.value)}
                                    placeholder="2023-06"
                                    className="flex-1 px-3 py-2 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                />
                                <button onClick={() => removeCertification(index)} className="text-slate-600 hover:text-red-400 p-2 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={addCertification}
                    className="w-full py-2.5 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-amber-400 hover:border-amber-500/30 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Certification
                </button>
            </div>

            {/* Achievements */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Achievements</h3>
                </div>
                <div className="space-y-2">
                    {(data.achievements || []).map((ach, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <span className="text-yellow-400/50 text-xs">🏆</span>
                            <input
                                type="text"
                                value={ach}
                                onChange={(e) => updateAchievement(index, e.target.value)}
                                placeholder="Increased revenue by 40% through strategic initiatives"
                                className="flex-1 px-3 py-2 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                            />
                            <button onClick={() => removeAchievement(index)} className="text-slate-600 hover:text-red-400 p-1 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={addAchievement}
                    className="w-full py-2.5 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-amber-400 hover:border-amber-500/30 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Achievement
                </button>
            </div>

            {/* Languages */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Languages</h3>
                </div>
                <div className="space-y-2">
                    {(data.languages || []).map((lang, index) => (
                        <div key={lang.id} className="flex gap-3 items-center">
                            <input
                                type="text"
                                value={lang.name || ''}
                                onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                placeholder="English"
                                className="flex-1 px-3 py-2 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                            />
                            <select
                                value={lang.proficiency || 'Intermediate'}
                                onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                                className="px-3 py-2 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none"
                            >
                                <option value="Native">Native</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Basic">Basic</option>
                            </select>
                            <button onClick={() => removeLanguage(index)} className="text-slate-600 hover:text-red-400 p-1 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={addLanguage}
                    className="w-full py-2.5 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-amber-400 hover:border-amber-500/30 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Language
                </button>
            </div>

            {/* Skip hint */}
            <p className="text-center text-xs text-slate-600">
                All sections above are optional. Skip anything that doesn&apos;t apply.
            </p>
        </div>
    );
}
