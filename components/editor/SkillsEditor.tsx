'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus, X, GripVertical } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
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

interface SkillsEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

interface SortableSkillCategoryProps {
    skillCat: any;
    index: number;
    updateCategory: (index: number, field: string, value: any) => void;
    removeCategory: (index: number) => void;
    inputs: Record<string, string>;
    setInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    handleKeyDown: (e: KeyboardEvent<HTMLInputElement>, index: number, categoryId: string) => void;
    addSkill: (index: number, categoryId: string) => void;
    removeSkill: (catIndex: number, skillIndex: number) => void;
}

function SortableSkillCategory({
    skillCat,
    index,
    updateCategory,
    removeCategory,
    inputs,
    setInputs,
    handleKeyDown,
    addSkill,
    removeSkill
}: SortableSkillCategoryProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: skillCat.id });

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
                    <h4 className="font-medium text-sm text-gray-700">Category #{index + 1}</h4>
                </div>
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
                    className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white mt-1"
                    placeholder="e.g., Programming Languages, Tools"
                />
            </div>

            <div>
                <label className="text-xs font-medium text-gray-600">Skills</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white mt-1 min-h-[42px]">
                    {(skillCat.items || []).map((skill: string, sIndex: number) => (
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
    );
}

export default function SkillsEditor({ data, onChange }: SkillsEditorProps) {
    // Local state to track the current input for each category
    // Map category ID to input string
    const [inputs, setInputs] = useState<Record<string, string>>({});

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = (data.skills || []).findIndex((item) => item.id === active.id);
            const newIndex = (data.skills || []).findIndex((item) => item.id === over.id);

            onChange({
                ...data,
                skills: arrayMove(data.skills || [], oldIndex, newIndex)
            });
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

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={(data.skills || []).map(cat => cat.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {(data.skills || []).map((skillCat, index) => (
                            <SortableSkillCategory
                                key={skillCat.id}
                                skillCat={skillCat}
                                index={index}
                                updateCategory={updateCategory}
                                removeCategory={removeCategory}
                                inputs={inputs}
                                setInputs={setInputs}
                                handleKeyDown={handleKeyDown}
                                addSkill={addSkill}
                                removeSkill={removeSkill}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {(!data.skills || data.skills.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    <p>No skills added yet.</p>
                    <p className="text-sm">Click "Add Category" to get started.</p>
                </div>
            )}
        </div>
    );
}
