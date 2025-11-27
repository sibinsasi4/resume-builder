'use client';

import { CanvasElement } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';

interface TextElementProps {
    element: CanvasElement;
    isEditing: boolean;
    onUpdate: (properties: Partial<CanvasElement['properties']>) => void;
    onFinishEdit: () => void;
}

export default function TextElement({
    element,
    isEditing,
    onUpdate,
    onFinishEdit,
}: TextElementProps) {
    const [text, setText] = useState(element.properties.text || 'Double-click to edit');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [isEditing]);

    const handleBlur = () => {
        onUpdate({ text });
        onFinishEdit();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onFinishEdit();
        }
    };

    const style = {
        fontSize: element.properties.fontSize || 16,
        fontFamily: element.properties.fontFamily || 'sans-serif',
        fontWeight: element.properties.fontWeight || 'normal',
        color: element.properties.color || '#000000',
        backgroundColor: element.properties.backgroundColor || 'transparent',
        textAlign: element.properties.alignment || 'left',
        borderColor: element.properties.borderColor,
        borderWidth: element.properties.borderWidth || 0,
        borderStyle: element.properties.borderStyle || 'solid',
        borderRadius: element.properties.borderRadius || 0,
        padding: '8px',
        width: '100%',
        height: '100%',
        outline: 'none',
        resize: 'none' as const,
    };

    if (isEditing) {
        return (
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={style}
                className="border-2 border-blue-500"
            />
        );
    }

    return (
        <div
            style={style}
            className="whitespace-pre-wrap break-words overflow-hidden"
        >
            {text}
        </div>
    );
}
