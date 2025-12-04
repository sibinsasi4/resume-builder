'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus, X } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

interface SkillsEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function SkillsEditor({ data, onChange }: SkillsEditorProps) {
    // Local state to track the current input for each category
    // Map category ID to input string
    const [inputs, setInputs] = useState<Record<string, string>>({});

    const addSkillCategory = () => {
        const newCategory = {
            id: Date.now().toString(),
            category: '',
            items: []
        };

        onChange({
            ...data,
            skills: [...(data.skills || []), newCategory]
        });
    };

    const updateCategory = (index: number, field: string, value: any) => {
        const updated = [...(data.skills || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, skills: updated });
    };

    const removeCategory = (index: number) => {
        const updated = [...(data.skills || [])];
        updated.splice(index, 1);
        onChange({ ...data, skills: updated });
    };

    const addSkill = (index: number, categoryId: string) => {
        const inputValue = inputs[categoryId]?.trim();
        if (!inputValue) return;

        const updated = [...(data.skills || [])];
        const currentItems = updated[index].items || [];

        // Don't add duplicates
        if (!currentItems.includes(inputValue)) {
            updated[index] = {
                ...updated[index],
                items: [...currentItems, inputValue]
            };
            onChange({ ...data, skills: updated });
        }

        // Clear input
        setInputs(prev => ({ ...prev, [categoryId]: '' }));
    };

    const removeSkill = (catIndex: number, skillIndex: number) => {
        const updated = [...(data.skills || [])];
        const currentItems = [...(updated[catIndex].items || [])];
        currentItems.splice(skillIndex, 1);
        updated[catIndex] = { ...updated[catIndex], items: currentItems };
        onChange({ ...data, skills: updated });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number, categoryId: string) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill(index, categoryId);
        } else if (e.key === 'Backspace' && !inputs[categoryId] && (data.skills?.[index].items?.length || 0) > 0) {
            // Remove last item on backspace if input is empty
            removeSkill(index, (data.skills?.[index].items?.length || 0) - 1);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Skills</h3>
                <Button size="sm" onClick={addSkillCategory}>
                    <Plus className="w-4 h-4 mr-1" /> Add Category
                </Button>
            </div>

            {(data.skills || []).map((skillCat, index) => (
                <div key={skillCat.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm text-gray-700">Category #{index + 1}</h4>
                        <button
                            onClick={() => removeCategory(index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">Category Name</label>
                        <input
                            type="text"
                            value={skillCat.category}
                            onChange={(e) => updateCategory(index, 'category', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                            placeholder="e.g., Programming Languages, Tools"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">Skills</label>
                        <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white mt-1 min-h-[42px]">
                            {(skillCat.items || []).map((skill, sIndex) => (
                                <span
                                    key={sIndex}
                                    className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-sm border border-blue-100"
                                >
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(index, sIndex)}
                                        className="ml-1 hover:text-blue-900 focus:outline-none"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={inputs[skillCat.id] || ''}
                                onChange={(e) => setInputs(prev => ({ ...prev, [skillCat.id]: e.target.value }))}
                                onKeyDown={(e) => handleKeyDown(e, index, skillCat.id)}
                                onBlur={() => addSkill(index, skillCat.id)}
                                className="flex-grow min-w-[120px] outline-none text-sm py-1"
                                placeholder="Type skill & hit Enter..."
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Type a skill and press <strong>Enter</strong> or <strong>Comma</strong> to add it.
                        </p>
                    </div>
                </div>
            ))}

            {(!data.skills || data.skills.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    <p>No skills added yet.</p>
                    <p className="text-sm">Click "Add Category" to get started.</p>
                </div>
            )}
        </div>
    );
}
