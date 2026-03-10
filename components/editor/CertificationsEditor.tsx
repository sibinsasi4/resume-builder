'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CertificationsEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

interface SortableCertificationItemProps {
    cert: any;
    index: number;
    updateCertification: (index: number, field: string, value: any) => void;
    removeCertification: (index: number) => void;
}

function SortableCertificationItem({
    cert,
    index,
    updateCertification,
    removeCertification
}: SortableCertificationItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: cert.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border rounded-lg p-4 space-y-3 bg-gray-50 relative group"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-move text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200"
                    >
                        <GripVertical className="w-4 h-4" />
                    </button>
                    <h4 className="font-medium text-sm text-gray-700">Certification #{index + 1}</h4>
                </div>
                <button
                    onClick={() => removeCertification(index)}
                    className="text-red-600 hover:text-red-800"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium text-gray-600">Certification Name</label>
                    <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertification(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="AWS Certified Solutions Architect"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-600">Issuer</label>
                    <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="Amazon Web Services"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium text-gray-600">Date Obtained</label>
                    <input
                        type="text"
                        value={cert.date}
                        onChange={(e) => updateCertification(index, 'date', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="2023-05"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-600">Expiry Date (optional)</label>
                    <input
                        type="text"
                        value={cert.expiryDate || ''}
                        onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="2026-05"
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-600">Credential ID (optional)</label>
                <input
                    type="text"
                    value={cert.credentialId || ''}
                    onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                    placeholder="ABC123XYZ456"
                />
            </div>
        </div>
    );
}

export default function CertificationsEditor({ data, onChange }: CertificationsEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addCertification = () => {
        const newCertification = {
            id: Date.now().toString(),
            name: '',
            issuer: '',
            date: '',
            expiryDate: '',
            credentialId: ''
        };

        onChange({
            ...data,
            certifications: [...(data.certifications || []), newCertification]
        });
    };

    const updateCertification = (index: number, field: string, value: any) => {
        const updated = [...(data.certifications || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, certifications: updated });
    };

    const removeCertification = (index: number) => {
        const updated = [...(data.certifications || [])];
        updated.splice(index, 1);
        onChange({ ...data, certifications: updated });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = (data.certifications || []).findIndex((item) => item.id === active.id);
            const newIndex = (data.certifications || []).findIndex((item) => item.id === over.id);

            onChange({
                ...data,
                certifications: arrayMove(data.certifications || [], oldIndex, newIndex)
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Certifications</h3>
                <Button size="sm" onClick={addCertification}>
                    <Plus className="w-4 h-4 mr-1" /> Add Certification
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={(data.certifications || []).map(cert => cert.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {(data.certifications || []).map((cert, index) => (
                            <SortableCertificationItem
                                key={cert.id}
                                cert={cert}
                                index={index}
                                updateCertification={updateCertification}
                                removeCertification={removeCertification}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {(!data.certifications || data.certifications.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    <p>No certifications added yet.</p>
                    <p className="text-sm">Click "Add Certification" to get started.</p>
                </div>
            )}
        </div>
    );
}
