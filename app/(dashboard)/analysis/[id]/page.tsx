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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Top Bar */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            VISISH - Job Match Analysis
                        </h1>
                        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
                            ← Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {!result ? (
                    // Input Section
                    <div className="max-w-3xl mx-auto">
                        <Card>
                            <h2 className="text-2xl font-bold mb-4">Analyze Resume with Job Description</h2>
                            <p className="text-gray-600 mb-6">
                                {useUpload
                                    ? 'Upload your resume and paste the job description to get AI-powered insights.'
                                    : 'Paste the job description below to get AI-powered insights on how well your resume matches the role.'
                                }
                            </p>

                            {/* Mode Toggle */}
                            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
                                <button
                                    onClick={() => {
                                        setUseUpload(false);
                                        setUploadedFile(null);
                                        setUploadedText('');
                                    }}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${!useUpload
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Use Existing Resume
                                </button>
                                <button
                                    onClick={() => setUseUpload(true)}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${useUpload
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Upload Resume
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* File Upload Section */}
                                {useUpload && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Resume File *
                                        </label>
                                        <div
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                                ? 'border-blue-500 bg-blue-50'
                                                : uploadedFile
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {uploading ? (
                                                <div className="space-y-2">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                                    <p className="text-gray-600">Processing resume...</p>
                                                </div>
                                            ) : uploadedFile ? (
                                                <div className="space-y-2">
                                                    <div className="text-green-600 text-4xl">✓</div>
                                                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {(uploadedFile.size / 1024).toFixed(1)} KB
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setUploadedFile(null);
                                                            setUploadedText('');
                                                        }}
                                                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                                                    >
                                                        Remove file
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="text-gray-400 text-4xl">📄</div>
                                                    <p className="text-gray-700 font-medium">
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
                                                        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Title (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="e.g., Senior Software Engineer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Description *
                                    </label>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        rows={12}
                                        placeholder="Paste the complete job description here..."
                                    />
                                </div>

                                <Button
                                    onClick={runAnalysis}
                                    disabled={analyzing || (useUpload && !uploadedText)}
                                    className="w-full"
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
                            <h2 className="text-3xl font-bold">Analysis Results</h2>
                            <Button variant="outline" onClick={() => setResult(null)}>
                                Analyze Another Job
                            </Button>
                        </div>

                        {/* Score Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="text-center">
                                <div className="text-sm text-gray-600 mb-2">ATS Score</div>
                                <div className={`text-4xl font-bold ${getScoreColor(result.atsScore)}`}>
                                    {result.atsScore}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">out of 100</div>
                            </Card>

                            <Card className="text-center">
                                <div className="text-sm text-gray-600 mb-2">Job Match</div>
                                <div className={`text-4xl font-bold ${getScoreColor(result.matchScore)}`}>
                                    {result.matchScore}%
                                </div>
                                <div className="text-xs text-gray-500 mt-2">overall match</div>
                            </Card>

                            <Card className="text-center">
                                <div className="text-sm text-gray-600 mb-2">Skills Match</div>
                                <div className={`text-4xl font-bold ${getScoreColor(result.skillsMatch)}`}>
                                    {result.skillsMatch}%
                                </div>
                                <div className="text-xs text-gray-500 mt-2">skills alignment</div>
                            </Card>

                            <Card className="text-center">
                                <div className="text-sm text-gray-600 mb-2">Experience Match</div>
                                <div className={`text-4xl font-bold ${getScoreColor(result.experienceMatch)}`}>
                                    {result.experienceMatch}%
                                </div>
                                <div className="text-xs text-gray-500 mt-2">experience fit</div>
                            </Card>
                        </div>

                        {/* Recommendation */}
                        <Card className={`border-l-4 ${result.recommendation.decision === 'strongly-apply' ? 'border-green-500 bg-green-50' :
                            result.recommendation.decision === 'apply-with-improvements' ? 'border-yellow-500 bg-yellow-50' :
                                'border-red-500 bg-red-50'
                            }`}>
                            <h3 className="text-xl font-bold mb-3">
                                {result.recommendation.decision === 'strongly-apply' ? '✅ Strongly Recommended to Apply' :
                                    result.recommendation.decision === 'apply-with-improvements' ? '⚠️ Apply with Improvements' :
                                        '📚 Upskill First'}
                            </h3>
                            <p className="text-gray-700">{result.recommendation.reasoning}</p>
                        </Card>

                        {/* SWOT Analysis */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <Card className="border-l-4 border-green-500">
                                <h3 className="text-lg font-bold mb-3 text-green-700">💪 Strengths</h3>
                                <ul className="space-y-2">
                                    {result.swotAnalysis.strengths.map((strength, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                                            <span className="text-green-500 mr-2">•</span>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card className="border-l-4 border-red-500">
                                <h3 className="text-lg font-bold mb-3 text-red-700">⚠️ Weaknesses</h3>
                                <ul className="space-y-2">
                                    {result.swotAnalysis.weaknesses.map((weakness, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                                            <span className="text-red-500 mr-2">•</span>
                                            <span>{weakness}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card className="border-l-4 border-blue-500">
                                <h3 className="text-lg font-bold mb-3 text-blue-700">🚀 Opportunities</h3>
                                <ul className="space-y-2">
                                    {result.swotAnalysis.opportunities.map((opportunity, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            <span>{opportunity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>

                        {/* Resume Suggestions */}
                        <Card>
                            <h3 className="text-2xl font-bold mb-4">📝 Resume Improvement Suggestions</h3>
                            <div className="space-y-4">
                                {result.suggestions.map((suggestion, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-lg border-l-4 ${suggestion.priority === 'high' ? 'border-red-500 bg-red-50' :
                                            suggestion.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                                                'border-blue-500 bg-blue-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-semibold text-sm uppercase text-gray-600">
                                                {suggestion.section}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded ${suggestion.priority === 'high' ? 'bg-red-200 text-red-800' :
                                                suggestion.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                                    'bg-blue-200 text-blue-800'
                                                }`}>
                                                {suggestion.priority} priority
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{suggestion.suggestion}</p>
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
