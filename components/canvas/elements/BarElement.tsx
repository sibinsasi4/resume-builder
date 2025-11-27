'use client';

import { CanvasElement } from '@/lib/types';

interface BarElementProps {
    element: CanvasElement;
}

export default function BarElement({ element }: BarElementProps) {
    const style = {
        width: '100%',
        height: element.properties.barThickness || 2,
        backgroundColor: element.properties.color || '#000000',
        borderStyle: element.properties.barStyle || 'solid',
        borderWidth: element.properties.barStyle === 'solid' ? 0 : element.properties.barThickness || 2,
        borderColor: element.properties.color || '#000000',
    };

    return <div style={style} className="my-auto" />;
}
