'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus } from 'lucide-react';

interface CertificationsEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function CertificationsEditor({ data, onChange }: CertificationsEditorProps) {
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

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Certifications</h3>
                <Button size="sm" onClick={addCertification}>
                    <Plus className="w-4 h-4 mr-1" /> Add Certification
                </Button>
            </div>

            {(data.certifications || []).map((cert, index) => (
                <div key={cert.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm text-gray-700">Certification #{index + 1}</h4>
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
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="AWS Certified Solutions Architect"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Issuer</label>
                            <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
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
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="2023-05"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Expiry Date (optional)</label>
                            <input
                                type="text"
                                value={cert.expiryDate || ''}
                                onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
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
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="ABC123XYZ456"
                        />
                    </div>
                </div>
            ))}

            {(!data.certifications || data.certifications.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    <p>No certifications added yet.</p>
                    <p className="text-sm">Click "Add Certification" to get started.</p>
                </div>
            )}
        </div>
    );
}
