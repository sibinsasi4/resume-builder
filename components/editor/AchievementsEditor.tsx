'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus } from 'lucide-react';

interface AchievementsEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function AchievementsEditor({ data, onChange }: AchievementsEditorProps) {
    const addAchievement = () => {
        const updated = [...(data.achievements || []), ''];
        onChange({ ...data, achievements: updated });
    };

    const updateAchievement = (index: number, value: string) => {
        const updated = [...(data.achievements || [])];
        updated[index] = value;
        onChange({ ...data, achievements: updated });
    };

    const removeAchievement = (index: number) => {
        const updated = [...(data.achievements || [])];
        updated.splice(index, 1);
        onChange({ ...data, achievements: updated });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Achievements</h3>
                <Button size="sm" onClick={addAchievement}>
                    <Plus className="w-4 h-4 mr-1" /> Add Achievement
                </Button>
            </div>

            <div className="space-y-3">
                {(data.achievements || []).map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={achievement}
                                onChange={(e) => updateAchievement(index, e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="Describe your achievement..."
                            />
                        </div>
                        <button
                            onClick={() => removeAchievement(index)}
                            className="text-red-600 hover:text-red-800 px-2"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {(!data.achievements || data.achievements.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    <p>No achievements added yet.</p>
                    <p className="text-sm">Click "Add Achievement" to get started.</p>
                </div>
            )}
        </div>
    );
}
