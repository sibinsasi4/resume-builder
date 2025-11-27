'use client';

import { CanvasElement } from '@/lib/types';
import { useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageElementProps {
    element: CanvasElement;
    onUpdate: (properties: Partial<CanvasElement['properties']>) => void;
}

export default function ImageElement({ element, onUpdate }: ImageElementProps) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        // Convert to base64 for now (in production, upload to cloud storage)
        const reader = new FileReader();
        reader.onloadend = () => {
            onUpdate({ imageUrl: reader.result as string });
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const style = {
        width: '100%',
        height: '100%',
        borderColor: element.properties.borderColor,
        borderWidth: element.properties.borderWidth || 0,
        borderStyle: element.properties.borderStyle || 'solid',
        borderRadius: element.properties.borderRadius || 0,
        objectFit: element.properties.objectFit || 'cover',
    };

    if (!element.properties.imageUrl) {
        return (
            <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload Image</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>
        );
    }

    return (
        <div className="relative w-full h-full group">
            <img
                src={element.properties.imageUrl}
                alt="Resume element"
                style={style as any}
                className="w-full h-full"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Upload className="w-6 h-6 text-white" />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>
            {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
            )}
        </div>
    );
}
