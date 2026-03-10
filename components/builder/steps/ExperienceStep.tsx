'use client';

import { useState } from 'react';
import { ResumeData } from '@/lib/types';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ExperienceStepProps {
    data: ResumeData;
    onChange: (updates: Partial<ResumeData>) => void;
}

function SortableExpCard({
    exp,
    index,
    isExpanded,
    onToggle,
    onUpdate,
    onRemove,
    onUpdateDesc,
    onAddDesc,
    onRemoveDesc,
}: {
    exp: any;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
    onUpdate: (field: string, value: any) => void;
    onRemove: () => void;
    onUpdateDesc: (descIndex: number, value: string) => void;
    onAddDesc: () => void;
    onRemoveDesc: (descIndex: number) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: exp.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all">
            {/* Header (always visible) */}
            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={onToggle}>
                <button {...attributes} {...listeners} className="text-slate-600 hover:text-slate-400 cursor-move p-1" onClick={(e) => e.stopPropagation()}>
                    <GripVertical className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm truncate">
                        {exp.position || exp.company ? `${exp.position || 'Untitled'} at ${exp.company || 'Company'}` : `Experience #${index + 1}`}
                    </h4>
                    {exp.startDate && (
                        <p className="text-xs text-slate-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}</p>
                    )}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="text-slate-600 hover:text-red-400 p-1 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </div>

            {/* Expandable content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">Company</label>
                            <input
                                type="text"
                                value={exp.company || ''}
                                onChange={(e) => onUpdate('company', e.target.value)}
                                placeholder="Google, Microsoft, etc."
                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">Position</label>
                            <input
                                type="text"
                                value={exp.position || ''}
                                onChange={(e) => onUpdate('position', e.target.value)}
                                placeholder="Software Engineer"
                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">Location</label>
                            <input
                                type="text"
                                value={exp.location || ''}
                                onChange={(e) => onUpdate('location', e.target.value)}
                                placeholder="San Francisco, CA"
                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={exp.current || false}
                                    onChange={(e) => onUpdate('current', e.target.checked)}
                                    className="rounded border-white/20 bg-slate-950 text-amber-500 focus:ring-amber-500"
                                />
                                I currently work here
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">Start Date</label>
                            <input
                                type="text"
                                value={exp.startDate || ''}
                                onChange={(e) => onUpdate('startDate', e.target.value)}
                                placeholder="Jan 2022"
                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">End Date</label>
                            <input
                                type="text"
                                value={exp.current ? 'Present' : exp.endDate || ''}
                                onChange={(e) => onUpdate('endDate', e.target.value)}
                                placeholder="Present"
                                disabled={exp.current}
                                className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Bullet points */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-medium text-slate-400">Key Responsibilities & Achievements</label>
                            <button
                                onClick={onAddDesc}
                                className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                            >
                                + Add bullet
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(exp.description || []).map((desc: string, i: number) => (
                                <div key={i} className="flex gap-2 items-start">
                                    <span className="text-slate-600 mt-2.5 text-xs">•</span>
                                    <input
                                        type="text"
                                        value={desc}
                                        onChange={(e) => onUpdateDesc(i, e.target.value)}
                                        placeholder="Led a team of 5 engineers to deliver..."
                                        className="flex-1 px-3 py-2 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                    />
                                    <button
                                        onClick={() => onRemoveDesc(i)}
                                        className="text-slate-600 hover:text-red-400 p-1 mt-1 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            {(!exp.description || exp.description.length === 0) && (
                                <p className="text-xs text-slate-600 italic">Add bullet points describing your responsibilities and achievements</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ExperienceStep({ data, onChange }: ExperienceStepProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const addExperience = () => {
        const newExp = {
            id: Date.now().toString(),
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: [''],
        };
        onChange({ experience: [...(data.experience || []), newExp] });
        setExpandedIds((prev) => new Set([...prev, newExp.id]));
    };

    const updateExperience = (index: number, field: string, value: any) => {
        const updated = [...(data.experience || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ experience: updated });
    };

    const removeExperience = (index: number) => {
        const updated = [...(data.experience || [])];
        updated.splice(index, 1);
        onChange({ experience: updated });
    };

    const updateDescription = (expIndex: number, descIndex: number, value: string) => {
        const updated = [...(data.experience || [])];
        const descriptions = [...(updated[expIndex].description || [])];
        descriptions[descIndex] = value;
        updated[expIndex] = { ...updated[expIndex], description: descriptions };
        onChange({ experience: updated });
    };

    const addDescription = (expIndex: number) => {
        const updated = [...(data.experience || [])];
        updated[expIndex] = { ...updated[expIndex], description: [...(updated[expIndex].description || []), ''] };
        onChange({ experience: updated });
    };

    const removeDescription = (expIndex: number, descIndex: number) => {
        const updated = [...(data.experience || [])];
        const descriptions = [...(updated[expIndex].description || [])];
        descriptions.splice(descIndex, 1);
        updated[expIndex] = { ...updated[expIndex], description: descriptions };
        onChange({ experience: updated });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = (data.experience || []).findIndex((item) => item.id === active.id);
            const newIndex = (data.experience || []).findIndex((item) => item.id === over.id);
            onChange({ experience: arrayMove(data.experience || [], oldIndex, newIndex) });
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Work Experience
                </h2>
                <p className="text-slate-400 mt-2">
                    Add your work history, most recent first
                </p>
            </div>

            {/* Experience cards */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={(data.experience || []).map((e) => e.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {(data.experience || []).map((exp, index) => (
                            <SortableExpCard
                                key={exp.id}
                                exp={exp}
                                index={index}
                                isExpanded={expandedIds.has(exp.id)}
                                onToggle={() => toggleExpand(exp.id)}
                                onUpdate={(field, value) => updateExperience(index, field, value)}
                                onRemove={() => removeExperience(index)}
                                onUpdateDesc={(descIndex, value) => updateDescription(index, descIndex, value)}
                                onAddDesc={() => addDescription(index)}
                                onRemoveDesc={(descIndex) => removeDescription(index, descIndex)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Add button */}
            <button
                onClick={addExperience}
                className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
                <Plus className="w-5 h-5" />
                Add Work Experience
            </button>

            {(!data.experience || data.experience.length === 0) && (
                <div className="text-center py-8">
                    <p className="text-slate-500 text-sm">No experience added yet. Click above to add your first role.</p>
                    <p className="text-slate-600 text-xs mt-1">You can skip this step if you&apos;re a fresh graduate.</p>
                </div>
            )}
        </div>
    );
}
