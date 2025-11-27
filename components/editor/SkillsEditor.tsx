'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus } from 'lucide-react';

interface SkillsEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function SkillsEditor({ data, onChange }: SkillsEditorProps) {
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

    const updateSkills = (index: number, value: string) => {
        const updated = [...(data.skills || [])];
        updated[index] = { ...updated[index], items: value.split(',').map(s => s.trim()).filter(Boolean) };
        onChange({ ...data, skills: updated });
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
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="e.g., Programming Languages, Tools, etc."
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">Skills (comma-separated)</label>
                        <input
                            type="text"
                            value={(skillCat.items || []).join(', ')}
                            onChange={(e) => updateSkills(index, e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="JavaScript, Python, React, Node.js"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Separate skills with commas
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
