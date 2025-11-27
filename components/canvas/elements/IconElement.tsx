'use client';

import { CanvasElement } from '@/lib/types';
import * as Icons from 'lucide-react';

interface IconElementProps {
    element: CanvasElement;
}

export default function IconElement({ element }: IconElementProps) {
    const iconName = element.properties.iconName || 'Star';
    const IconComponent = (Icons as any)[iconName] || Icons.Star;

    const size = element.properties.iconSize || 24;
    const color = element.properties.color || '#000000';

    return (
        <div className="flex items-center justify-center w-full h-full">
            <IconComponent size={size} color={color} />
        </div>
    );
}
