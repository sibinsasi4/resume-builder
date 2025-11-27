'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus } from 'lucide-react';

interface ExperienceEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function ExperienceEditor({ data, onChange }: ExperienceEditorProps) {
    const addExperience = () => {
        const newExperience = {
            id: Date.now().toString(),
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: []
        };

        onChange({
            ...data,
            experience: [...(data.experience || []), newExperience]
        });
    };

    const updateExperience = (index: number, field: string, value: any) => {
        const updated = [...(data.experience || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, experience: updated });
    };

    const removeExperience = (index: number) => {
        const updated = [...(data.experience || [])];
        updated.splice(index, 1);
        onChange({ ...data, experience: updated });
    };

    const updateDescription = (expIndex: number, descIndex: number, value: string) => {
        const updated = [...(data.experience || [])];
        const descriptions = [...(updated[expIndex].description || [])];
        descriptions[descIndex] = value;
        updated[expIndex] = { ...updated[expIndex], description: descriptions };
        onChange({ ...data, experience: updated });
    };

    const addDescription = (expIndex: number) => {
        const updated = [...(data.experience || [])];
        const descriptions = [...(updated[expIndex].description || []), ''];
        updated[expIndex] = { ...updated[expIndex], description: descriptions };
        onChange({ ...data, experience: updated });
    };

    const removeDescription = (expIndex: number, descIndex: number) => {
        const updated = [...(data.experience || [])];
        const descriptions = [...(updated[expIndex].description || [])];
        descriptions.splice(descIndex, 1);
        updated[expIndex] = { ...updated[expIndex], description: descriptions };
        onChange({ ...data, experience: updated });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Work Experience</h3>
                <Button size="sm" onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-1" /> Add Experience
                </Button>
            </div>

            {(data.experience || []).map((exp, index) => (
                <div key={exp.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm text-gray-700">Experience #{index + 1}</h4>
                        <button
                            onClick={() => removeExperience(index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Company</label>
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="Company name"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Position</label>
                            <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="Job title"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Location</label>
                            <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="City, State"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-xs font-medium text-gray-600">Current Job</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Start Date</label>
                            <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="2020-01"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">End Date</label>
                            <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="Present"
                                disabled={exp.current}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-medium text-gray-600">Responsibilities</label>
                            <button
                                onClick={() => addDescription(index)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                + Add bullet
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(exp.description || []).map((desc, descIndex) => (
                                <div key={descIndex} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={desc}
                                        onChange={(e) => updateDescription(index, descIndex, e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                        placeholder="Describe your achievement..."
                                    />
                                    <button
                                        onClick={() => removeDescription(index, descIndex)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {(!data.experience || data.experience.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    <p>No work experience added yet.</p>
                    <p className="text-sm">Click "Add Experience" to get started.</p>
                </div>
            )}
        </div>
    );
}
