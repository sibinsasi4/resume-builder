'use client';

import { useState } from 'react';
import { Mic, Play, CheckCircle, Loader2, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

export default function InterviewPrepPage() {
    const [loading, setLoading] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [answers, setAnswers] = useState<string[]>([]);
    const [analysis, setAnalysis] = useState<any>(null);
    const [analyzing, setAnalyzing] = useState(false);

    // Voice State
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');

    const speakQuestion = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any previous speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setUserAnswer(prev => prev + (prev ? ' ' : '') + transcript);
            };

            recognition.onend = () => setIsListening(false);
            recognition.onerror = () => setIsListening(false);

            recognition.start();
        } else {
            alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        }
    };

    const handleStart = async () => {
        if (!jobTitle) return;
        setLoading(true);
        try {
            const response = await fetch('/api/ai/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobTitle, jobDescription }),
            });
            const data = await response.json();
            if (response.ok) {
                setQuestions(data.questions);
                setAnswers(new Array(data.questions.length).fill(''));
                sessionStorage.setItem('currentInterviewId', data.interviewId);
                setIsSessionActive(true);
                // Auto-speak first question after a short delay
                setTimeout(() => speakQuestion(data.questions[0]), 500);
            } else {
                alert(data.error || 'Failed to start interview');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        // Save current answer
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = userAnswer;
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setUserAnswer(newAnswers[nextIndex] || ''); // Load existing answer if any (or empty)
            setTimeout(() => speakQuestion(questions[nextIndex]), 500);
        } else {
            // Finish and Analyze
            setAnalyzing(true);
            try {
                const interviewId = sessionStorage.getItem('currentInterviewId');
                const response = await fetch('/api/ai/interview/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ interviewId, answers: newAnswers }),
                });
                const data = await response.json();
                if (response.ok) {
                    setAnalysis(data.analysis);
                    setIsSessionActive(false);
                } else {
                    alert(data.error || 'Failed to analyze interview');
                }
            } catch (error) {
                console.error(error);
                alert('Something went wrong generating feedback');
            } finally {
                setAnalyzing(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavbar />
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Interview Prep</h1>
                    <p className="text-gray-500">Practice with AI-generated questions tailored to your target role.</p>
                </div>

                {!isSessionActive ? (
                    <Card className="max-w-md mx-auto p-8">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Job Title
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. Product Manager"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description (Optional but Recommended)
                            </label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Paste the job description here for tailored questions..."
                                rows={4}
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handleStart}
                            disabled={!jobTitle || loading}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Generating Questions...
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5 mr-2" />
                                    Start Interview
                                </>
                            )}
                        </Button>
                    </Card>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-4 flex justify-between items-center text-sm text-gray-500">
                            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">In Progress</span>
                        </div>

                        <Card className="p-8 mb-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 flex-1">
                                    {questions[currentQuestionIndex]}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => speakQuestion(questions[currentQuestionIndex])}
                                    className={isSpeaking ? 'text-blue-600 animate-pulse' : 'text-gray-400'}
                                >
                                    <Mic className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 mb-6">
                                <div className="text-center mb-4">
                                    <Button
                                        onClick={startListening}
                                        disabled={isListening}
                                        className={`rounded-full w-16 h-16 flex items-center justify-center transition-all ${isListening
                                            ? 'bg-red-100 text-red-600 animate-pulse ring-4 ring-red-50'
                                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                            }`}
                                    >
                                        <Mic className="w-8 h-8" />
                                    </Button>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {isListening ? 'Listening...' : 'Tap to Speak'}
                                    </p>
                                </div>

                                <textarea
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    rows={4}
                                    placeholder="Your answer will appear here..."
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleNext} disabled={analyzing}>
                                    {analyzing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Analyzing Performance...
                                        </>
                                    ) : currentQuestionIndex === questions.length - 1 ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Finish & Get Feedback
                                        </>
                                    ) : (
                                        <>
                                            Next Question
                                            <MessageSquare className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {analysis && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Results</h2>
                            <div className="flex justify-center items-center gap-8 my-6">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-blue-600 mb-1">{analysis.score}/100</div>
                                    <div className="text-sm text-gray-500 font-medium">OVERALL SCORE</div>
                                </div>
                                <div className="h-16 w-px bg-gray-300"></div>
                                <div className="text-center">
                                    <div className={`text-3xl font-bold mb-1 ${analysis.recommendation.includes('Strong') ? 'text-green-600' :
                                            analysis.recommendation.includes('No') ? 'text-red-600' : 'text-blue-600'
                                        }`}>
                                        {analysis.recommendation}
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">RECOMMENDATION</div>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">Detailed Feedback</h3>
                            {analysis.feedback.map((item: any, i: number) => (
                                <Card key={i} className="p-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Q{i + 1}: {item.question}</h4>

                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Your Answer:</p>
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg italic">"{item.userAnswer || 'No answer provided'}"</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm font-bold text-blue-800 mb-1">Feedback</p>
                                            <p className="text-sm text-blue-700">{item.feedback}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm font-bold text-green-800 mb-1">Better Answer</p>
                                            <p className="text-sm text-green-700">{item.betterAnswer}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="text-center pt-8">
                            <Button onClick={() => {
                                setAnalysis(null);
                                setQuestions([]);
                                setAnswers([]);
                                setCurrentQuestionIndex(0);
                                setJobTitle('');
                                setJobDescription('');
                            }}>
                                Start New Interview
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
