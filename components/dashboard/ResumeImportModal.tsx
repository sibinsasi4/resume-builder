'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle, Loader2, X, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ResumeImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateId: string;
    templateName: string;
    onSkip: () => void; // Called when user chooses "Start Blank"
}

type UploadStep = 'idle' | 'uploading' | 'parsing' | 'creating' | 'success' | 'error';

export default function ResumeImportModal({ isOpen, onClose, templateId, templateName, onSkip }: ResumeImportModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<UploadStep>('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setStep('uploading');
        setProgress(10);

        try {
            // 1. Upload & Parse
            const formData = new FormData();
            formData.append('resume', file);

            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 60) return prev;
                    return prev + 5;
                });
            }, 500);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);

            if (!uploadRes.ok) {
                const errData = await uploadRes.json();
                throw new Error(errData.error || 'Upload failed');
            }

            setProgress(70);
            setStep('parsing'); // AI is working

            const { structuredData, fileName } = await uploadRes.json();

            setProgress(90);
            setStep('creating');

            // 2. Create Resume with Template + Data
            const createRes = await fetch('/api/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `${fileName.replace(/\.[^/.]+$/, "")} (${templateName})`,
                    templateType: templateId, // Use selected template
                    data: structuredData
                })
            });

            if (!createRes.ok) throw new Error('Failed to create resume');

            const { resume } = await createRes.json();

            setProgress(100);
            setStep('success');

            // Small delay to show success state before redirect
            setTimeout(() => {
                router.push(`/editor/${resume.id}`);
            }, 800);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong');
            setStep('error');
            setProgress(0);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">How would you like to start?</h2>
                        <p className="text-slate-400 text-sm mt-1">Selected Template: <span className="text-blue-400">{templateName}</span></p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {step === 'idle' || step === 'error' ? (
                        <div className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Option 1: Upload */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative p-6 bg-blue-500/5 hover:bg-blue-500/10 border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 rounded-xl cursor-pointer transition-all text-center"
                            >
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Upload Existing Resume</h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    We'll extract your details and auto-fill the template.
                                    <br /><span className="text-xs opacity-70">(Supports PDF, DOCX)</span>
                                </p>
                                <div className="inline-flex items-center text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full">
                                    Recommended
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.docx,.doc"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                            </div>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-slate-800"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-600 text-xs uppercase font-bold">Or</span>
                                <div className="flex-grow border-t border-slate-800"></div>
                            </div>

                            {/* Option 2: Blank */}
                            <button
                                onClick={onSkip}
                                className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center gap-3 transition-all group"
                            >
                                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600">
                                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-white">Start from Scratch</div>
                                    <div className="text-xs text-slate-500">Use sample data and edit manually</div>
                                </div>
                            </button>
                        </div>
                    ) : (
                        /* Progress State */
                        <div className="text-center py-8">
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                {/* Success Icon */}
                                {step === 'success' ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-full animate-in zoom-in-50 duration-300">
                                        <CheckCircle className="w-12 h-12 text-green-500" />
                                    </div>
                                ) : (
                                    /* Spinner */
                                    <>
                                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                                        <div
                                            className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
                                            style={{ animationDuration: '1.5s' }}
                                        ></div>
                                    </>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 animate-pulse">
                                {step === 'uploading' && 'Uploading Document...'}
                                {step === 'parsing' && 'AI Extracting Info...'}
                                {step === 'creating' && 'Generating Resume...'}
                                {step === 'success' && 'Redirecting to Editor...'}
                            </h3>

                            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
                                {step === 'parsing' ? 'Our AI is reading your resume to pick relevant information.' : 'Please wait while we set up your new resume.'}
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
