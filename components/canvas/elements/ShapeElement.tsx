'use client';

import { CanvasElement } from '@/lib/types';

interface ShapeElementProps {
    element: CanvasElement;
}

export default function ShapeElement({ element }: ShapeElementProps) {
    const shapeType = element.properties.shapeType || 'rectangle';
    const fillColor = element.properties.fillColor || element.properties.backgroundColor || '#e5e7eb';
    const borderColor = element.properties.borderColor || '#000000';
    const borderWidth = element.properties.borderWidth || 1;
    const borderRadius = element.properties.borderRadius || 0;

    const style = {
        width: '100%',
        height: '100%',
        backgroundColor: fillColor,
        borderColor,
        borderWidth,
        borderStyle: element.properties.borderStyle || 'solid',
        borderRadius: shapeType === 'circle' ? '50%' : borderRadius,
    };

    if (shapeType === 'line') {
        return (
            <div
                style={{
                    width: '100%',
                    height: borderWidth,
                    backgroundColor: borderColor,
                    margin: 'auto 0',
                }}
            />
        );
    }

    return <div style={style} />;
}
