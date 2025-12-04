'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

export default function CoverLetterPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Cover Letters</h1>
                        <p className="text-gray-500 mt-2">Generate AI-powered cover letters tailored to your job applications.</p>
                    </div>
                    <Button onClick={() => router.push('/cover-letter/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Cover Letter
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Placeholder for list of cover letters - will implement fetching later */}
                    <Card className="p-6 border-dashed border-2 border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center h-64 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer" onClick={() => router.push('/cover-letter/new')}>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Plus className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Create New</h3>
                        <p className="text-sm text-gray-500 mt-1">Generate a tailored cover letter</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
