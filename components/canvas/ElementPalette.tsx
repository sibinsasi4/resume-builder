'use client';

import { Type, Heading1, Image, Minus, Star, Square, List } from 'lucide-react';
import { ElementType } from '@/lib/types';

interface ElementPaletteProps {
    onAddElement: (type: ElementType) => void;
}

const elements = [
    { type: 'text' as ElementType, icon: Type, label: 'Text Box', description: 'Add text content' },
    { type: 'header' as ElementType, icon: Heading1, label: 'Header', description: 'Large heading text' },
    { type: 'image' as ElementType, icon: Image, label: 'Image', description: 'Upload photo' },
    { type: 'bar' as ElementType, icon: Minus, label: 'Divider', description: 'Horizontal line' },
    { type: 'icon' as ElementType, icon: Star, label: 'Icon', description: 'Add icon' },
    { type: 'shape' as ElementType, icon: Square, label: 'Shape', description: 'Rectangle/Circle' },
    { type: 'list' as ElementType, icon: List, label: 'List', description: 'Bullet list' },
];

export default function ElementPalette({ onAddElement }: ElementPaletteProps) {
    return (
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Elements</h3>
            <div className="space-y-2">
                {elements.map((element) => {
                    const Icon = element.icon;
                    return (
                        <button
                            key={element.type}
                            onClick={() => onAddElement(element.type)}
                            className="w-full flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                        >
                            <div className="p-2 bg-gray-100 rounded group-hover:bg-blue-100 transition-colors">
                                <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-sm text-gray-900">
                                    {element.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {element.description}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                    <strong>Tip:</strong> Click an element to add it to the canvas. Double-click elements to edit them.
                </p>
            </div>
        </div>
    );
}
