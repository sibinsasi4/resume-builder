'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CanvasElement } from '@/lib/types';
import { Trash2, Lock, Unlock, Copy } from 'lucide-react';

interface DraggableElementProps {
    element: CanvasElement;
    isSelected: boolean;
    isEditing: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onToggleLock: () => void;
    onStartEdit: () => void;
    children: React.ReactNode;
}

export default function DraggableElement({
    element,
    isSelected,
    isEditing,
    onSelect,
    onDelete,
    onDuplicate,
    onToggleLock,
    onStartEdit,
    children,
}: DraggableElementProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: element.id,
        disabled: element.locked || isEditing,
    });

    const style = {
        position: 'absolute' as const,
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        transform: CSS.Translate.toString(transform),
        zIndex: element.zIndex,
        opacity: isDragging ? 0.5 : element.properties.opacity || 1,
        cursor: element.locked ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'all 0.2s ease',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                if (!element.locked) {
                    onStartEdit();
                }
            }}
            className={`group ${isSelected ? 'ring-2 ring-blue-500' : ''} ${element.locked ? 'opacity-60' : ''
                }`}
        >
            {/* Element Content */}
            {children}

            {/* Selection Controls */}
            {isSelected && !isEditing && (
                <div className="absolute -top-10 left-0 flex gap-1 bg-white border border-gray-300 rounded shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate();
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Duplicate"
                    >
                        <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleLock();
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title={element.locked ? 'Unlock' : 'Lock'}
                    >
                        {element.locked ? (
                            <Lock className="w-4 h-4 text-gray-600" />
                        ) : (
                            <Unlock className="w-4 h-4 text-gray-600" />
                        )}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="p-1.5 hover:bg-red-100 rounded"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
            )}

            {/* Resize Handles (when selected) */}
            {isSelected && !isEditing && !element.locked && (
                <>
                    <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize" />
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize" />
                </>
            )}

            {/* Lock Indicator */}
            {element.locked && (
                <div className="absolute top-1 right-1 bg-gray-800 text-white p-1 rounded">
                    <Lock className="w-3 h-3" />
                </div>
            )}
        </div>
    );
}
