'use client';

import { CanvasElement } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';

interface HeaderElementProps {
    element: CanvasElement;
    isEditing: boolean;
    onUpdate: (properties: Partial<CanvasElement['properties']>) => void;
    onFinishEdit: () => void;
}

export default function HeaderElement({
    element,
    isEditing,
    onUpdate,
    onFinishEdit,
}: HeaderElementProps) {
    const [text, setText] = useState(element.properties.text || 'Header Text');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleBlur = () => {
        onUpdate({ text });
        onFinishEdit();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            onFinishEdit();
        }
    };

    const style = {
        fontSize: element.properties.fontSize || 32,
        fontFamily: element.properties.fontFamily || 'sans-serif',
        fontWeight: element.properties.fontWeight || 'bold',
        color: element.properties.color || '#000000',
        backgroundColor: element.properties.backgroundColor || 'transparent',
        textAlign: element.properties.alignment || 'left',
        borderColor: element.properties.borderColor,
        borderWidth: element.properties.borderWidth || 0,
        borderStyle: element.properties.borderStyle || 'solid',
        borderRadius: element.properties.borderRadius || 0,
        padding: '12px',
        width: '100%',
        height: '100%',
        outline: 'none',
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="text"
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
            className="whitespace-nowrap overflow-hidden text-ellipsis"
        >
            {text}
        </div>
    );
}
