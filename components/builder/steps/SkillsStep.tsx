'use client';

import { useState } from 'react';
import { ResumeData } from '@/lib/types';
import { Plus, Trash2, X } from 'lucide-react';

interface SkillsStepProps {
    data: ResumeData;
    onChange: (updates: Partial<ResumeData>) => void;
}

export default function SkillsStep({ data, onChange }: SkillsStepProps) {
    const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});

    const addCategory = () => {
        const newCategory = {
            id: Date.now().toString(),
            category: '',
            items: [],
        };
        onChange({ skills: [...(data.skills || []), newCategory] });
    };

    const updateCategoryName = (index: number, name: string) => {
        const updated = [...(data.skills || [])];
        updated[index] = { ...updated[index], category: name };
        onChange({ skills: updated });
    };

    const removeCategory = (index: number) => {
        const updated = [...(data.skills || [])];
        updated.splice(index, 1);
        onChange({ skills: updated });
    };

    const addSkillToCategory = (index: number, skill: string) => {
        if (!skill.trim()) return;
        const updated = [...(data.skills || [])];
        if (updated[index].items.includes(skill.trim())) return;
        updated[index] = { ...updated[index], items: [...updated[index].items, skill.trim()] };
        onChange({ skills: updated });
        setNewSkillInputs((prev) => ({ ...prev, [updated[index].id]: '' }));
    };

    const removeSkillFromCategory = (catIndex: number, skillIndex: number) => {
        const updated = [...(data.skills || [])];
        const newItems = [...updated[catIndex].items];
        newItems.splice(skillIndex, 1);
        updated[catIndex] = { ...updated[catIndex], items: newItems };
        onChange({ skills: updated });
    };

    const handleKeyDown = (e: React.KeyboardEvent, catIndex: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const catId = (data.skills || [])[catIndex]?.id;
            const value = newSkillInputs[catId] || '';
            addSkillToCategory(catIndex, value);
        }
    };

    const suggestedCategories = [
        { name: 'Technical Skills', suggestions: ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL'] },
        { name: 'Soft Skills', suggestions: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'] },
        { name: 'Tools & Platforms', suggestions: ['Git', 'Docker', 'AWS', 'Figma', 'Jira', 'VS Code'] },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Skills
                </h2>
                <p className="text-slate-400 mt-2">
                    Showcase your expertise — type a skill and press Enter to add
                </p>
            </div>

            {/* Skill categories */}
            <div className="space-y-4">
                {(data.skills || []).map((skillCat, catIndex) => (
                    <div key={skillCat.id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={skillCat.category}
                                onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                                placeholder="Category name (e.g., Technical Skills)"
                                className="flex-1 px-3 py-2 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none font-medium placeholder:text-slate-600"
                            />
                            <button
                                onClick={() => removeCategory(catIndex)}
                                className="text-slate-600 hover:text-red-400 p-1 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Skill tags */}
                        <div className="flex flex-wrap gap-2">
                            {skillCat.items.map((skill, skillIndex) => (
                                <span
                                    key={skillIndex}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                >
                                    {skill}
                                    <button
                                        onClick={() => removeSkillFromCategory(catIndex, skillIndex)}
                                        className="hover:text-red-400 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Add skill input */}
                        <input
                            type="text"
                            value={newSkillInputs[skillCat.id] || ''}
                            onChange={(e) => setNewSkillInputs((prev) => ({ ...prev, [skillCat.id]: e.target.value }))}
                            onKeyDown={(e) => handleKeyDown(e, catIndex)}
                            placeholder="Type a skill and press Enter..."
                            className="w-full px-3 py-2 rounded-lg text-white text-sm bg-slate-950/50 border border-dashed border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                        />
                    </div>
                ))}
            </div>

            {/* Add category button */}
            <button
                onClick={addCategory}
                className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
                <Plus className="w-5 h-5" />
                Add Skill Category
            </button>

            {/* Quick add suggestions (shown when no skills) */}
            {(!data.skills || data.skills.length === 0) && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 space-y-4">
                    <p className="text-blue-300 text-sm font-medium">📋 Quick Start — Click to add a pre-made category:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedCategories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => {
                                    const newCat = {
                                        id: Date.now().toString() + cat.name,
                                        category: cat.name,
                                        items: cat.suggestions,
                                    };
                                    onChange({ skills: [...(data.skills || []), newCat] });
                                }}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/20 transition-all"
                            >
                                + {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
