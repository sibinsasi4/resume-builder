'use client';

import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { CanvasElement, ElementType, CanvasData } from '@/lib/types';
import { generateElementId, snapToGrid, cloneElement, bringToFront } from '@/lib/canvas/canvasUtils';
import ElementPalette from './ElementPalette';
import PropertiesPanel from './PropertiesPanel';
import DraggableElement from './DraggableElement';
import TextElement from './elements/TextElement';
import HeaderElement from './elements/HeaderElement';
import ImageElement from './elements/ImageElement';
import BarElement from './elements/BarElement';
import IconElement from './elements/IconElement';
import ShapeElement from './elements/ShapeElement';
import { ZoomIn, ZoomOut, Grid3x3, Undo2, Redo2, Download, Layers } from 'lucide-react';

interface CanvasEditorProps {
    initialData?: CanvasData;
    onSave: (data: CanvasData) => void;
}

const DEFAULT_CANVAS_DATA: CanvasData = {
    elements: [],
    canvasSize: { width: 794, height: 1123 },
    backgroundColor: '#ffffff',
    gridEnabled: true,
    gridSize: 10,
    zoom: 0.7,
};

export default function CanvasEditor({ initialData, onSave }: CanvasEditorProps) {
    const [canvasData, setCanvasData] = useState<CanvasData>(initialData || DEFAULT_CANVAS_DATA);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [editingElementId, setEditingElementId] = useState<string | null>(null);
    const [history, setHistory] = useState<CanvasData[]>([canvasData]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const selectedElement = canvasData.elements.find(el => el.id === selectedElementId) || null;

    const handleAddElement = useCallback((type: ElementType) => {
        const defaultSizes: Record<ElementType, { width: number; height: number }> = {
            text: { width: 300, height: 100 },
            header: { width: 400, height: 60 },
            image: { width: 200, height: 200 },
            bar: { width: 400, height: 4 },
            icon: { width: 50, height: 50 },
            shape: { width: 150, height: 150 },
            list: { width: 300, height: 150 },
        };

        const defaultProperties: Record<ElementType, any> = {
            text: { text: 'Double-click to edit', fontSize: 16, color: '#000000', fontFamily: 'sans-serif' },
            header: { text: 'Header Text', fontSize: 32, fontWeight: 'bold', color: '#1f2937', fontFamily: 'sans-serif' },
            image: { imageUrl: '' },
            bar: { color: '#3b82f6', barThickness: 2 },
            icon: { iconName: 'Star', iconSize: 24, color: '#3b82f6' },
            shape: { shapeType: 'rectangle', fillColor: '#e5e7eb', borderWidth: 1, borderColor: '#9ca3af' },
            list: { listType: 'bullet', listItems: ['Item 1', 'Item 2', 'Item 3'] },
        };

        const newElement: CanvasElement = {
            id: generateElementId(),
            type,
            position: { x: 150 + (canvasData.elements.length * 20), y: 100 + (canvasData.elements.length * 20) },
            size: defaultSizes[type],
            properties: defaultProperties[type],
            zIndex: canvasData.elements.length,
        };

        const newData = {
            ...canvasData,
            elements: [...canvasData.elements, newElement],
        };

        setCanvasData(newData);
        setSelectedElementId(newElement.id);
        addToHistory(newData);
    }, [canvasData]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, delta } = event;

        if (!delta) return;

        const elementId = active.id as string;
        const element = canvasData.elements.find(el => el.id === elementId);

        if (!element) return;

        let newX = element.position.x + delta.x / canvasData.zoom;
        let newY = element.position.y + delta.y / canvasData.zoom;

        if (canvasData.gridEnabled) {
            newX = snapToGrid(newX, canvasData.gridSize);
            newY = snapToGrid(newY, canvasData.gridSize);
        }

        newX = Math.max(0, Math.min(newX, canvasData.canvasSize.width - element.size.width));
        newY = Math.max(0, Math.min(newY, canvasData.canvasSize.height - element.size.height));

        const newData = {
            ...canvasData,
            elements: canvasData.elements.map(el =>
                el.id === elementId
                    ? { ...el, position: { x: newX, y: newY } }
                    : el
            ),
        };

        setCanvasData(newData);
        addToHistory(newData);
    }, [canvasData]);

    const handleUpdateElement = useCallback((elementId: string, properties: Partial<CanvasElement['properties']>) => {
        const newData = {
            ...canvasData,
            elements: canvasData.elements.map(el =>
                el.id === elementId
                    ? { ...el, properties: { ...el.properties, ...properties } }
                    : el
            ),
        };

        setCanvasData(newData);
        addToHistory(newData);
    }, [canvasData]);

    const handleDeleteElement = useCallback((elementId: string) => {
        const newData = {
            ...canvasData,
            elements: canvasData.elements.filter(el => el.id !== elementId),
        };

        setCanvasData(newData);
        setSelectedElementId(null);
        addToHistory(newData);
    }, [canvasData]);

    const handleDuplicateElement = useCallback((elementId: string) => {
        const element = canvasData.elements.find(el => el.id === elementId);
        if (!element) return;

        const duplicated = cloneElement(element);
        const newData = {
            ...canvasData,
            elements: [...canvasData.elements, duplicated],
        };

        setCanvasData(newData);
        setSelectedElementId(duplicated.id);
        addToHistory(newData);
    }, [canvasData]);

    const handleToggleLock = useCallback((elementId: string) => {
        const newData = {
            ...canvasData,
            elements: canvasData.elements.map(el =>
                el.id === elementId
                    ? { ...el, locked: !el.locked }
                    : el
            ),
        };

        setCanvasData(newData);
        addToHistory(newData);
    }, [canvasData]);

    const handleBringToFront = useCallback((elementId: string) => {
        const newData = {
            ...canvasData,
            elements: bringToFront(canvasData.elements, elementId),
        };

        setCanvasData(newData);
        addToHistory(newData);
    }, [canvasData]);

    const addToHistory = (data: CanvasData) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(data);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setCanvasData(history[newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setCanvasData(history[newIndex]);
        }
    };

    const handleZoomIn = () => {
        setCanvasData({ ...canvasData, zoom: Math.min(canvasData.zoom + 0.1, 2) });
    };

    const handleZoomOut = () => {
        setCanvasData({ ...canvasData, zoom: Math.max(canvasData.zoom - 0.1, 0.3) });
    };

    const handleToggleGrid = () => {
        setCanvasData({ ...canvasData, gridEnabled: !canvasData.gridEnabled });
    };

    const handleSave = () => {
        onSave(canvasData);
    };

    const renderElementContent = (element: CanvasElement) => {
        const isEditing = editingElementId === element.id;

        switch (element.type) {
            case 'text':
                return (
                    <TextElement
                        element={element}
                        isEditing={isEditing}
                        onUpdate={(props) => handleUpdateElement(element.id, props)}
                        onFinishEdit={() => setEditingElementId(null)}
                    />
                );
            case 'header':
                return (
                    <HeaderElement
                        element={element}
                        isEditing={isEditing}
                        onUpdate={(props) => handleUpdateElement(element.id, props)}
                        onFinishEdit={() => setEditingElementId(null)}
                    />
                );
            case 'image':
                return (
                    <ImageElement
                        element={element}
                        onUpdate={(props) => handleUpdateElement(element.id, props)}
                    />
                );
            case 'bar':
                return <BarElement element={element} />;
            case 'icon':
                return <IconElement element={element} />;
            case 'shape':
                return <ShapeElement element={element} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-full bg-gradient-to-br from-gray-50 to-gray-100">
            <ElementPalette onAddElement={handleAddElement} />

            <div className="flex-1 flex flex-col">
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={undo}
                                disabled={historyIndex === 0}
                                className="p-2 hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                title="Undo"
                            >
                                <Undo2 className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                                onClick={redo}
                                disabled={historyIndex === history.length - 1}
                                className="p-2 hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                title="Redo"
                            >
                                <Redo2 className="w-5 h-5 text-gray-700" />
                            </button>

                            <div className="w-px h-6 bg-gray-300 mx-1" />

                            <button
                                onClick={handleToggleGrid}
                                className={`p-2 rounded-lg transition-all ${canvasData.gridEnabled
                                        ? 'bg-blue-100 text-blue-600 shadow-sm'
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                title="Toggle Grid"
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>

                            <div className="w-px h-6 bg-gray-300 mx-1" />

                            <button
                                onClick={handleZoomOut}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-5 h-5 text-gray-700" />
                            </button>
                            <span className="text-sm font-semibold px-3 py-1 bg-gray-100 rounded-lg min-w-[60px] text-center">
                                {Math.round(canvasData.zoom * 100)}%
                            </span>
                            <button
                                onClick={handleZoomIn}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                <Layers className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {canvasData.elements.length} elements
                                </span>
                            </div>

                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-sm transition-all font-medium"
                            >
                                <Download className="w-4 h-4" />
                                Save Resume
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-100 to-gray-200 p-8 relative">
                    {canvasData.elements.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
                                <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Building Your Resume</h3>
                                <p className="text-gray-500 max-w-md">
                                    Click elements from the left panel to add them to your canvas.
                                    <br />
                                    Drag to position, double-click to edit!
                                </p>
                            </div>
                        </div>
                    )}

                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                        <div
                            className="mx-auto bg-white shadow-2xl relative border border-gray-200"
                            style={{
                                width: canvasData.canvasSize.width,
                                height: canvasData.canvasSize.height,
                                transform: `scale(${canvasData.zoom})`,
                                transformOrigin: 'top center',
                                backgroundColor: canvasData.backgroundColor,
                                backgroundImage: canvasData.gridEnabled
                                    ? `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`
                                    : 'none',
                                backgroundSize: canvasData.gridEnabled
                                    ? `${canvasData.gridSize}px ${canvasData.gridSize}px`
                                    : 'auto',
                            }}
                            onClick={() => {
                                setSelectedElementId(null);
                                setEditingElementId(null);
                            }}
                        >
                            {canvasData.elements.map((element) => (
                                <DraggableElement
                                    key={element.id}
                                    element={element}
                                    isSelected={selectedElementId === element.id}
                                    isEditing={editingElementId === element.id}
                                    onSelect={() => {
                                        setSelectedElementId(element.id);
                                        handleBringToFront(element.id);
                                    }}
                                    onDelete={() => handleDeleteElement(element.id)}
                                    onDuplicate={() => handleDuplicateElement(element.id)}
                                    onToggleLock={() => handleToggleLock(element.id)}
                                    onStartEdit={() => setEditingElementId(element.id)}
                                >
                                    {renderElementContent(element)}
                                </DraggableElement>
                            ))}
                        </div>
                    </DndContext>
                </div>
            </div>

            <PropertiesPanel
                element={selectedElement}
                onUpdate={(props) => selectedElementId && handleUpdateElement(selectedElementId, props)}
            />
        </div>
    );
}
