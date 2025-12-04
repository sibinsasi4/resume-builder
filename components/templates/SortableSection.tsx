'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableSectionProps {
    id: string;
    children: React.ReactNode;
    enabled?: boolean;
}

export default function SortableSection({ id, children, enabled = true }: SortableSectionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id,
        disabled: !enabled
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative">
            {/* Drag Handle - Visible on Hover only if enabled */}
            {enabled && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute -left-8 top-0 bottom-0 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-move transition-opacity print:hidden"
                    title="Drag to reorder"
                >
                    <div className="p-1 bg-gray-100 rounded hover:bg-gray-200 shadow-sm">
                        <GripVertical className="w-4 h-4 text-gray-500" />
                    </div>
                </div>
            )}

            {children}
        </div>
    );
}
