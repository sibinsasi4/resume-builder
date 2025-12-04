'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
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

interface AchievementsEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

interface SortableAchievementItemProps {
    id: string;
    text: string;
    index: number;
    updateAchievement: (id: string, value: string) => void;
    removeAchievement: (id: string) => void;
}

function SortableAchievementItem({
    id,
    text,
    index,
    updateAchievement,
    removeAchievement
}: SortableAchievementItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex gap-2 items-center bg-white p-2 border rounded-lg group"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-move text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
            >
                <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex-1">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => updateAchievement(id, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Describe your achievement..."
                />
            </div>
            <button
                onClick={() => removeAchievement(id)}
                className="text-red-600 hover:text-red-800 px-2"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

export default function AchievementsEditor({ data, onChange }: AchievementsEditorProps) {
    // Local state to manage IDs for drag and drop
    const [items, setItems] = useState<{ id: string; text: string }[]>([]);

    // Sync items with data.achievements on mount and when data changes externally
    // We need to be careful not to overwrite local IDs if the data hasn't actually changed content-wise
    useEffect(() => {
        const currentTexts = items.map(i => i.text);
        const newTexts = data.achievements || [];

        // Simple check: if lengths differ or content differs, we re-initialize
        // This is not perfect but sufficient for this use case
        if (JSON.stringify(currentTexts) !== JSON.stringify(newTexts)) {
            setItems(newTexts.map(text => ({
                id: Math.random().toString(36).substr(2, 9),
                text
            })));
        }
    }, [data.achievements]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addAchievement = () => {
        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            text: ''
        };
        const newItems = [...items, newItem];
        setItems(newItems);
        onChange({ ...data, achievements: newItems.map(i => i.text) });
    };

    const updateAchievement = (id: string, value: string) => {
        const newItems = items.map(item =>
            item.id === id ? { ...item, text: value } : item
        );
        setItems(newItems);
        onChange({ ...data, achievements: newItems.map(i => i.text) });
    };

    const removeAchievement = (id: string) => {
        const newItems = items.filter(item => item.id !== id);
        setItems(newItems);
        onChange({ ...data, achievements: newItems.map(i => i.text) });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            onChange({ ...data, achievements: newItems.map(i => i.text) });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Achievements</h3>
                <Button size="sm" onClick={addAchievement}>
                    <Plus className="w-4 h-4 mr-1" /> Add Achievement
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <SortableAchievementItem
                                key={item.id}
                                id={item.id}
                                text={item.text}
                                index={index}
                                updateAchievement={updateAchievement}
                                removeAchievement={removeAchievement}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>No achievements added yet.</p>
                    <p className="text-sm">Click "Add Achievement" to get started.</p>
                </div>
            )}
        </div>
    );
}
