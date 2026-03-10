'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EducationEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

interface SortableEducationItemProps {
    edu: any;
    index: number;
    updateEducation: (index: number, field: string, value: any) => void;
    removeEducation: (index: number) => void;
}

function SortableEducationItem({
    edu,
    index,
    updateEducation,
    removeEducation
}: SortableEducationItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: edu.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border rounded-lg p-4 space-y-3 bg-gray-50 relative group"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-move text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200"
                    >
                        <GripVertical className="w-4 h-4" />
                    </button>
                    <h4 className="font-medium text-sm text-gray-700">Education #{index + 1}</h4>
                </div>
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
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="University name"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-600">Degree</label>
                    <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
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
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="Computer Science"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-600">Location</label>
                    <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => updateEducation(index, 'location', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
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
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="2015"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-600">End Date</label>
                    <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="2019"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-600">GPA (optional)</label>
                    <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="3.8/4.0"
                    />
                </div>
            </div>
        </div>
    );
}

export default function EducationEditor({ data, onChange }: EducationEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = (data.education || []).findIndex((item) => item.id === active.id);
            const newIndex = (data.education || []).findIndex((item) => item.id === over.id);

            onChange({
                ...data,
                education: arrayMove(data.education || [], oldIndex, newIndex)
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Education</h3>
                <Button size="sm" onClick={addEducation}>
                    <Plus className="w-4 h-4 mr-1" /> Add Education
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={(data.education || []).map(edu => edu.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {(data.education || []).map((edu, index) => (
                            <SortableEducationItem
                                key={edu.id}
                                edu={edu}
                                index={index}
                                updateEducation={updateEducation}
                                removeEducation={removeEducation}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {(!data.education || data.education.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    <p>No education added yet.</p>
                    <p className="text-sm">Click "Add Education" to get started.</p>
                </div>
            )}
        </div>
    );
}
