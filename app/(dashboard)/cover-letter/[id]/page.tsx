'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, Copy, Save, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';


export default function CoverLetterViewPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [coverLetter, setCoverLetter] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (params.id) {
            fetch(`/api/cover-letters/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.coverLetter) {
                        setCoverLetter(data.coverLetter);
                        setContent(data.coverLetter.content);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [params.id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        alert('Copied to clipboard!');
    };

    const handleSave = async () => {
        // Implement save functionality
        alert('Save functionality coming soon!');
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!coverLetter) return <div className="p-8 text-center">Cover Letter not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{coverLetter.jobTitle}</h1>
                        <p className="text-gray-500">{coverLetter.companyName}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCopy}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                        </Button>
                        <Button onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </Button>
                    </div>
                </div>

                <Card className="p-8 max-w-4xl mx-auto bg-white shadow-lg">
                    <textarea
                        className="w-full h-[600px] p-4 border-none focus:ring-0 text-gray-800 leading-relaxed resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Card>
            </div>
        </div>
    );
}
