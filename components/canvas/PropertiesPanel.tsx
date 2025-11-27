'use client';

import { CanvasElement } from '@/lib/types';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface PropertiesPanelProps {
    element: CanvasElement | null;
    onUpdate: (properties: Partial<CanvasElement['properties']>) => void;
}

export default function PropertiesPanel({ element, onUpdate }: PropertiesPanelProps) {
    if (!element) {
        return (
            <div className="w-64 bg-white border-l border-gray-200 p-4">
                <h3 className="font-semibold text-lg mb-4">Properties</h3>
                <p className="text-sm text-gray-500">
                    Select an element to edit its properties
                </p>
            </div>
        );
    }

    const showTextProperties = element.type === 'text' || element.type === 'header';
    const showImageProperties = element.type === 'image';
    const showBarProperties = element.type === 'bar';
    const showIconProperties = element.type === 'icon';
    const showShapeProperties = element.type === 'shape';

    return (
        <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Properties</h3>

            {/* Position & Size */}
            <div className="mb-6">
                <h4 className="font-medium text-sm mb-2">Position & Size</h4>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-gray-600">X</label>
                        <input
                            type="number"
                            value={Math.round(element.position.x)}
                            readOnly
                            className="w-full px-2 py-1 border rounded text-sm bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600">Y</label>
                        <input
                            type="number"
                            value={Math.round(element.position.y)}
                            readOnly
                            className="w-full px-2 py-1 border rounded text-sm bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600">Width</label>
                        <input
                            type="number"
                            value={Math.round(element.size.width)}
                            readOnly
                            className="w-full px-2 py-1 border rounded text-sm bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600">Height</label>
                        <input
                            type="number"
                            value={Math.round(element.size.height)}
                            readOnly
                            className="w-full px-2 py-1 border rounded text-sm bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            {/* Text Properties */}
            {showTextProperties && (
                <>
                    <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1">Font Size</label>
                        <input
                            type="number"
                            value={element.properties.fontSize || 16}
                            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
                            className="w-full px-2 py-1 border rounded text-sm"
                            min="8"
                            max="72"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1">Font Family</label>
                        <select
                            value={element.properties.fontFamily || 'sans-serif'}
                            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                            className="w-full px-2 py-1 border rounded text-sm"
                        >
                            <option value="sans-serif">Sans Serif</option>
                            <option value="serif">Serif</option>
                            <option value="monospace">Monospace</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1">Font Weight</label>
                        <select
                            value={element.properties.fontWeight || 'normal'}
                            onChange={(e) => onUpdate({ fontWeight: e.target.value as any })}
                            className="w-full px-2 py-1 border rounded text-sm"
                        >
                            <option value="normal">Normal</option>
                            <option value="semibold">Semi Bold</option>
                            <option value="bold">Bold</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1">Alignment</label>
                        <div className="flex gap-1">
                            {[
                                { value: 'left', icon: AlignLeft },
                                { value: 'center', icon: AlignCenter },
                                { value: 'right', icon: AlignRight },
                                { value: 'justify', icon: AlignJustify },
                            ].map(({ value, icon: Icon }) => (
                                <button
                                    key={value}
                                    onClick={() => onUpdate({ alignment: value as any })}
                                    className={`flex-1 p-2 border rounded ${element.properties.alignment === value
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mx-auto" />
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Color */}
            <div className="mb-4">
                <label className="text-xs text-gray-600 block mb-1">Color</label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={element.properties.color || '#000000'}
                        onChange={(e) => onUpdate({ color: e.target.value })}
                        className="w-12 h-8 border rounded cursor-pointer"
                    />
                    <input
                        type="text"
                        value={element.properties.color || '#000000'}
                        onChange={(e) => onUpdate({ color: e.target.value })}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                </div>
            </div>

            {/* Background Color */}
            {showTextProperties && (
                <div className="mb-4">
                    <label className="text-xs text-gray-600 block mb-1">Background</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={element.properties.backgroundColor || '#ffffff'}
                            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                            className="w-12 h-8 border rounded cursor-pointer"
                        />
                        <input
                            type="text"
                            value={element.properties.backgroundColor || '#ffffff'}
                            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                            className="flex-1 px-2 py-1 border rounded text-sm"
                        />
                    </div>
                </div>
            )}

            {/* Border */}
            <div className="mb-4">
                <label className="text-xs text-gray-600 block mb-1">Border Width</label>
                <input
                    type="number"
                    value={element.properties.borderWidth || 0}
                    onChange={(e) => onUpdate({ borderWidth: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 border rounded text-sm"
                    min="0"
                    max="10"
                />
            </div>

            {element.properties.borderWidth! > 0 && (
                <>
                    <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1">Border Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={element.properties.borderColor || '#000000'}
                                onChange={(e) => onUpdate({ borderColor: e.target.value })}
                                className="w-12 h-8 border rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={element.properties.borderColor || '#000000'}
                                onChange={(e) => onUpdate({ borderColor: e.target.value })}
                                className="flex-1 px-2 py-1 border rounded text-sm"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1">Border Style</label>
                        <select
                            value={element.properties.borderStyle || 'solid'}
                            onChange={(e) => onUpdate({ borderStyle: e.target.value as any })}
                            className="w-full px-2 py-1 border rounded text-sm"
                        >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                        </select>
                    </div>
                </>
            )}

            {/* Border Radius */}
            {!showBarProperties && (
                <div className="mb-4">
                    <label className="text-xs text-gray-600 block mb-1">Border Radius</label>
                    <input
                        type="number"
                        value={element.properties.borderRadius || 0}
                        onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border rounded text-sm"
                        min="0"
                        max="50"
                    />
                </div>
            )}

            {/* Opacity */}
            <div className="mb-4">
                <label className="text-xs text-gray-600 block mb-1">
                    Opacity ({Math.round((element.properties.opacity || 1) * 100)}%)
                </label>
                <input
                    type="range"
                    value={element.properties.opacity || 1}
                    onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
                    className="w-full"
                    min="0"
                    max="1"
                    step="0.1"
                />
            </div>

            {/* Bar Specific */}
            {showBarProperties && (
                <div className="mb-4">
                    <label className="text-xs text-gray-600 block mb-1">Thickness</label>
                    <input
                        type="number"
                        value={element.properties.barThickness || 2}
                        onChange={(e) => onUpdate({ barThickness: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border rounded text-sm"
                        min="1"
                        max="20"
                    />
                </div>
            )}

            {/* Icon Specific */}
            {showIconProperties && (
                <div className="mb-4">
                    <label className="text-xs text-gray-600 block mb-1">Icon Size</label>
                    <input
                        type="number"
                        value={element.properties.iconSize || 24}
                        onChange={(e) => onUpdate({ iconSize: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border rounded text-sm"
                        min="12"
                        max="128"
                    />
                </div>
            )}

            {/* Shape Specific */}
            {showShapeProperties && (
                <>
                    <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1">Shape Type</label>
                        <select
                            value={element.properties.shapeType || 'rectangle'}
                            onChange={(e) => onUpdate({ shapeType: e.target.value as any })}
                            className="w-full px-2 py-1 border rounded text-sm"
                        >
                            <option value="rectangle">Rectangle</option>
                            <option value="circle">Circle</option>
                            <option value="line">Line</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1">Fill Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={element.properties.fillColor || '#e5e7eb'}
                                onChange={(e) => onUpdate({ fillColor: e.target.value })}
                                className="w-12 h-8 border rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={element.properties.fillColor || '#e5e7eb'}
                                onChange={(e) => onUpdate({ fillColor: e.target.value })}
                                className="flex-1 px-2 py-1 border rounded text-sm"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
