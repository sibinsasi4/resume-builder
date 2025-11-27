'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus } from 'lucide-react';

interface EducationEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function EducationEditor({ data, onChange }: EducationEditorProps) {
    const addEducation = () => {
        const newEducation = {
            id: Date.now().toString(),
            institution: '',
            degree: '',
            field: '',
            location: '',
            startDate: '',
            endDate: '',
            gpa: ''
        };

        onChange({
            ...data,
            education: [...(data.education || []), newEducation]
        });
    };

    const updateEducation = (index: number, field: string, value: any) => {
        const updated = [...(data.education || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, education: updated });
    };

    const removeEducation = (index: number) => {
        const updated = [...(data.education || [])];
        updated.splice(index, 1);
        onChange({ ...data, education: updated });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Education</h3>
                <Button size="sm" onClick={addEducation}>
                    <Plus className="w-4 h-4 mr-1" /> Add Education
                </Button>
            </div>

            {(data.education || []).map((edu, index) => (
                <div key={edu.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm text-gray-700">Education #{index + 1}</h4>
                        <button
                            onClick={() => removeEducation(index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Institution</label>
                            <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="University name"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Degree</label>
                            <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="Bachelor of Science"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Field of Study</label>
                            <input
                                type="text"
                                value={edu.field}
                                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="Computer Science"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Location</label>
                            <input
                                type="text"
                                value={edu.location}
                                onChange={(e) => updateEducation(index, 'location', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="City, State"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Start Date</label>
                            <input
                                type="text"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="2015"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">End Date</label>
                            <input
                                type="text"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="2019"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">GPA (optional)</label>
                            <input
                                type="text"
                                value={edu.gpa || ''}
                                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="3.8/4.0"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {(!data.education || data.education.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    <p>No education added yet.</p>
                    <p className="text-sm">Click "Add Education" to get started.</p>
                </div>
            )}
        </div>
    );
}
