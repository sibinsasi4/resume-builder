'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';


export default function CoverLetterPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);

    return (
        <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">Cover Letters</h1>
                    <p className="text-blue-200/80 mt-2 font-light">Generate AI-powered cover letters tailored to your job applications.</p>
                </div>
                <Button
                    onClick={() => router.push('/cover-letter/new')}
                    className="bg-white text-purple-900 hover:bg-blue-50 transition-colors shadow-lg shadow-purple-900/20"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Cover Letter
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Create New Card */}
                <div
                    onClick={() => router.push('/cover-letter/new')}
                    className="group relative h-64 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/20 transition-all">
                        <Plus className="w-8 h-8 text-purple-300 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Create New</h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Generate a tailored cover letter</p>
                </div>

                {/* Placeholder for future list items - using same style */}
                {/* You can map over cover letters here later */}
            </div>
        </div>
    );
}
