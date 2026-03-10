'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getScoreColor, getScoreBgColor } from '@/lib/utils';
import { JobAnalysisResult } from '@/lib/types';

export default function AnalysisPage() {
    const params = useParams();
    const router = useRouter();
    const { status } = useSession();
    const [jobDescription, setJobDescription] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<JobAnalysisResult | null>(null);

    // Upload mode state
    const [useUpload, setUseUpload] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedText, setUploadedText] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    const handleFileUpload = async (file: File) => {
        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a PDF or DOCX file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setUploadedFile(file);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const data = await response.json();
            setUploadedText(data.text);
        } catch (error) {
            console.error('Upload error:', error);
            alert(error instanceof Error ? error.message : 'Failed to upload resume');
            setUploadedFile(null);
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const checkAnalysisAccess = async (): Promise<boolean> => {
        try {
            // Check user's subscription status
            const response = await fetch('/api/user/subscription');
            if (!response.ok) return false;

            const { subscription } = await response.json();

            // If no subscription or free plan, deny access
            if (!subscription || subscription.plan === 'free') {
                alert('⚠️ Premium Feature\n\nAI Analysis is available only for paid users.\n\nPlease upgrade to Pro or Premium plan to unlock detailed AI insights.');
                return false;
            }

            // Check if subscription is active
            if (subscription.status !== 'active' && subscription.status !== 'trialing') {
                alert('⚠️ Subscription Inactive\n\nYour subscription is not active. Please renew to use AI Analysis.');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error checking analysis access:', error);
            return false;
        }
    };

    const runAnalysis = async () => {
        if (!jobDescription.trim()) {
            alert('Please enter a job description');
            return;
        }

        if (useUpload && !uploadedText) {
            alert('Please upload a resume first');
            return;
        }

        // Check access before running analysis
        const hasAccess = await checkAnalysisAccess();
        if (!hasAccess) return;

        try {
            setAnalyzing(true);
            const response = await fetch('/api/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeId: useUpload ? undefined : params.id,
                    resumeText: useUpload ? uploadedText : undefined,
                    jobDescription,
                    jobTitle: jobTitle || 'Job Position',
                }),
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            setResult(data.result);
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Failed to analyze resume');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Job Match Analysis
                </h1>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')} className="border-white/20 text-white hover:bg-white/10">
                    ← Back to Dashboard
                </Button>
            </div>

            <div className="container mx-auto px-4 py-8">
                {!result ? (
                    // Input Section
                    <div className="max-w-3xl mx-auto">
                        <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                            <h2 className="text-2xl font-bold mb-4 text-white">Analyze Resume with Job Description</h2>
                            <p className="text-gray-400 mb-6">
                                {useUpload
                                    ? 'Upload your resume and paste the job description to get AI-powered insights.'
                                    : 'Paste the job description below to get AI-powered insights on how well your resume matches the role.'
                                }
                            </p>

                            {/* Mode Toggle */}
                            <div className="flex gap-2 mb-6 p-1 bg-white/10 rounded-lg">
                                <button
                                    onClick={() => {
                                        setUseUpload(false);
                                        setUploadedFile(null);
                                        setUploadedText('');
                                    }}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${!useUpload
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Use Existing Resume
                                </button>
                                <button
                                    onClick={() => setUseUpload(true)}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${useUpload
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Upload Resume
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* File Upload Section */}
                                {useUpload && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Resume File *
                                        </label>
                                        <div
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : uploadedFile
                                                    ? 'border-green-500 bg-green-500/10'
                                                    : 'border-white/20 hover:border-white/40 bg-white/5'
                                                }`}
                                        >
                                            {uploading ? (
                                                <div className="space-y-2">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                                    <p className="text-gray-400">Processing resume...</p>
                                                </div>
                                            ) : uploadedFile ? (
                                                <div className="space-y-2">
                                                    <div className="text-green-400 text-4xl">✓</div>
                                                    <p className="font-medium text-white">{uploadedFile.name}</p>
                                                    <p className="text-sm text-gray-400">
                                                        {(uploadedFile.size / 1024).toFixed(1)} KB
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setUploadedFile(null);
                                                            setUploadedText('');
                                                        }}
                                                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                                                    >
                                                        Remove file
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="text-gray-500 text-4xl">📄</div>
                                                    <p className="text-gray-300 font-medium">
                                                        Drag and drop your resume here
                                                    </p>
                                                    <p className="text-sm text-gray-500">or</p>
                                                    <label className="inline-block">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    handleFileUpload(e.target.files[0]);
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-block transition-colors">
                                                            Browse Files
                                                        </span>
                                                    </label>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Supported formats: PDF, DOCX (Max 5MB)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Job Title (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="e.g., Senior Software Engineer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Job Description *
                                    </label>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
                                        rows={12}
                                        placeholder="Paste the complete job description here..."
                                    />
                                </div>

                                <Button
                                    onClick={runAnalysis}
                                    disabled={analyzing || (useUpload && !uploadedText)}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all"
                                >
                                    {analyzing ? 'Analyzing...' : 'Run Analysis'}
                                </Button>
                            </div>
                        </Card>
                    </div>
                ) : (
                    // Results Section
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-white">Analysis Results</h2>
                            <Button variant="outline" onClick={() => setResult(null)} className="border-white/20 text-white hover:bg-white/10">
                                Analyze Another Job
                            </Button>
                        </div>

                        {/* Score Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="text-center bg-white/5 backdrop-blur-xl border-white/10">
                                <div className="text-sm text-gray-400 mb-2">ATS Score</div>
                                <div className={`text-4xl font-bold ${getScoreColor(result.atsScore)}`}>
                                    {result.atsScore}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">out of 100</div>
                            </Card>

                            <Card className="text-center bg-white/5 backdrop-blur-xl border-white/10">
                                <div className="text-sm text-gray-400 mb-2">Job Match</div>
                                <div className={`text-4xl font-bold ${getScoreColor(result.matchScore)}`}>
                                    {result.matchScore}%
                                </div>
                                <div className="text-xs text-gray-500 mt-2">overall match</div>
                            </Card>

                            <Card className="text-center bg-white/5 backdrop-blur-xl border-white/10">
                                <div className="text-sm text-gray-400 mb-2">Skills Match</div>
                                <div className={`text-4xl font-bold ${getScoreColor(result.skillsMatch)}`}>
                                    {result.skillsMatch}%
                                </div>
                                <div className="text-xs text-gray-500 mt-2">skills alignment</div>
                            </Card>

                            <Card className="text-center bg-white/5 backdrop-blur-xl border-white/10">
                                <div className="text-sm text-gray-400 mb-2">Experience Match</div>
                                <div className={`text-4xl font-bold ${getScoreColor(result.experienceMatch)}`}>
                                    {result.experienceMatch}%
                                </div>
                                <div className="text-xs text-gray-500 mt-2">experience fit</div>
                            </Card>
                        </div>

                        {/* Recommendation */}
                        <Card className={`border-l-4 bg-white/5 backdrop-blur-xl border-white/10 ${result.recommendation.decision === 'strongly-apply' ? 'border-l-green-500' :
                            result.recommendation.decision === 'apply-with-improvements' ? 'border-l-yellow-500' :
                                'border-l-red-500'
                            }`}>
                            <h3 className="text-xl font-bold mb-3 text-white">
                                {result.recommendation.decision === 'strongly-apply' ? '✅ Strongly Recommended to Apply' :
                                    result.recommendation.decision === 'apply-with-improvements' ? '⚠️ Apply with Improvements' :
                                        '📚 Upskill First'}
                            </h3>
                            <p className="text-gray-300">{result.recommendation.reasoning}</p>
                        </Card>

                        {/* SWOT Analysis */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <Card className="border-l-4 border-l-green-500 bg-white/5 backdrop-blur-xl border-white/10">
                                <h3 className="text-lg font-bold mb-3 text-green-400">💪 Strengths</h3>
                                <ul className="space-y-2">
                                    {result.swotAnalysis.strengths.map((strength, idx) => (
                                        <li key={idx} className="text-sm text-gray-300 flex items-start">
                                            <span className="text-green-500 mr-2">•</span>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card className="border-l-4 border-l-red-500 bg-white/5 backdrop-blur-xl border-white/10">
                                <h3 className="text-lg font-bold mb-3 text-red-400">⚠️ Weaknesses</h3>
                                <ul className="space-y-2">
                                    {result.swotAnalysis.weaknesses.map((weakness, idx) => (
                                        <li key={idx} className="text-sm text-gray-300 flex items-start">
                                            <span className="text-red-500 mr-2">•</span>
                                            <span>{weakness}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card className="border-l-4 border-l-blue-500 bg-white/5 backdrop-blur-xl border-white/10">
                                <h3 className="text-lg font-bold mb-3 text-blue-400">🚀 Opportunities</h3>
                                <ul className="space-y-2">
                                    {result.swotAnalysis.opportunities.map((opportunity, idx) => (
                                        <li key={idx} className="text-sm text-gray-300 flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            <span>{opportunity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>

                        {/* Resume Suggestions */}
                        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                            <h3 className="text-2xl font-bold mb-4 text-white">📝 Resume Improvement Suggestions</h3>
                            <div className="space-y-4">
                                {result.suggestions.map((suggestion, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-lg border-l-4 border-white/5 bg-black/20 ${suggestion.priority === 'high' ? 'border-l-red-500' :
                                            suggestion.priority === 'medium' ? 'border-l-yellow-500' :
                                                'border-l-blue-500'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-semibold text-sm uppercase text-gray-400">
                                                {suggestion.section}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded ${suggestion.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                                suggestion.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    'bg-blue-500/20 text-blue-300'
                                                }`}>
                                                {suggestion.priority} priority
                                            </span>
                                        </div>
                                        <p className="text-gray-300">{suggestion.suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

            </div>
        </div>
    );
}
