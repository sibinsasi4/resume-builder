'use client';

import { useState } from 'react';
import { Mic, Play, CheckCircle, Loader2, MessageSquare, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
// import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

import PricingModal from '@/components/subscription/PricingModal';
import { usePayment } from '@/hooks/usePayment';
import { useEffect } from 'react';

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
    const [hasAccess, setHasAccess] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const { handleSelectPlan } = usePayment();

    useEffect(() => {
        checkAccess();
    }, []);

    const checkAccess = async () => {
        try {
            const res = await fetch('/api/subscription/status');
            const data = await res.json();
            // Check if plan is pro/premium or has specific feature
            if (data.limits?.features?.includes('interview_prep')) {
                setHasAccess(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

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

        if (!hasAccess) {
            setShowPricing(true);
            return;
        }

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
        <div className="container mx-auto px-4 py-8 relative z-10">

            {/* Ambient Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-white/10 backdrop-blur-xl rounded-2xl ring-1 ring-white/20 shadow-2xl">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                            <Mic className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200 mb-4 tracking-tight">
                        Mock Interview Prep
                    </h1>
                    <p className="text-lg text-blue-200/80 max-w-2xl mx-auto font-light leading-relaxed">
                        Master your interview skills with AI-powered questions tailored specifically to your target role.
                    </p>
                </div>

                {!isSessionActive ? (
                    <Card className="max-w-xl mx-auto p-8 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Target Job Title
                            </label>
                            <input
                                type="text"
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:bg-white/10"
                                placeholder="e.g. Senior Product Manager"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Job Description (Optional)
                            </label>
                            <textarea
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:bg-white/10"
                                placeholder="Paste the job description or key requirements here..."
                                rows={4}
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handleStart}
                            disabled={!jobTitle || loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Generating Questions...
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5 mr-2" />
                                    Start Interview Session
                                </>
                            )}
                        </Button>
                    </Card>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-6 flex justify-between items-center text-sm">
                            <span className="text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
                            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                In Progress
                            </span>
                        </div>

                        <Card className="p-8 mb-6 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-2xl font-semibold text-white flex-1 leading-relaxed">
                                    {questions[currentQuestionIndex]}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => speakQuestion(questions[currentQuestionIndex])}
                                    className={isSpeaking ? 'text-blue-400 animate-pulse' : 'text-gray-400 hover:text-white'}
                                >
                                    <Mic className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="bg-black/20 p-6 rounded-2xl border border-white/5 mb-8">
                                <div className="text-center mb-6">
                                    <Button
                                        onClick={startListening}
                                        disabled={isListening}
                                        className={`rounded-full w-20 h-20 flex items-center justify-center transition-all ${isListening
                                            ? 'bg-red-500/20 text-red-500 animate-pulse ring-4 ring-red-500/10'
                                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25 hover:scale-110'
                                            }`}
                                    >
                                        <Mic className="w-8 h-8" />
                                    </Button>
                                    <p className="text-sm text-gray-400 mt-4 font-medium uppercase tracking-widest">
                                        {isListening ? 'Listening...' : 'Tap to Answer'}
                                    </p>
                                </div>

                                <textarea
                                    className="w-full p-4 bg-transparent border-none text-lg text-white placeholder-gray-500 focus:ring-0 resize-none text-center"
                                    rows={3}
                                    placeholder="Your answer will appear here..."
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleNext}
                                    disabled={analyzing}
                                    className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold"
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : currentQuestionIndex === questions.length - 1 ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Finish Interview
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
                        <Card className="p-8 text-center bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                            <h2 className="text-3xl font-bold text-white mb-2">Interview Analysis</h2>
                            <div className="flex justify-center items-center gap-12 my-8">
                                <div className="text-center">
                                    <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-400 mb-2">{analysis.score}</div>
                                    <div className="text-xs text-gray-400 font-bold tracking-widest uppercase">Overall Score</div>
                                </div>
                                <div className="h-20 w-px bg-white/10"></div>
                                <div className="text-center">
                                    <div className={`text-3xl font-bold mb-2 ${analysis.recommendation.includes('Strong') ? 'text-green-400' :
                                        analysis.recommendation.includes('No') ? 'text-red-400' : 'text-blue-400'
                                        }`}>
                                        {analysis.recommendation}
                                    </div>
                                    <div className="text-xs text-gray-400 font-bold tracking-widest uppercase">Verdict</div>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white">Detailed Feedback</h3>
                            {analysis.feedback.map((item: any, i: number) => (
                                <Card key={i} className="p-6 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-colors">
                                    <h4 className="font-semibold text-lg text-white mb-4 flex items-start gap-3">
                                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm whitespace-nowrap">Q{i + 1}</span>
                                        {item.question}
                                    </h4>

                                    <div className="mb-6 bg-black/20 rounded-xl p-4 border border-white/5">
                                        <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Your Answer</p>
                                        <p className="text-gray-300 italic">"{item.userAnswer || 'No answer provided'}"</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-blue-500/10 p-5 rounded-xl border border-blue-500/20">
                                            <p className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2">
                                                <Info className="w-4 h-4" /> Feedback
                                            </p>
                                            <p className="text-sm text-blue-100/80 leading-relaxed">{item.feedback}</p>
                                        </div>
                                        <div className="bg-green-500/10 p-5 rounded-xl border border-green-500/20">
                                            <p className="text-sm font-bold text-green-300 mb-2 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Improved Answer
                                            </p>
                                            <p className="text-sm text-green-100/80 leading-relaxed">{item.betterAnswer}</p>
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

            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                onSelectPlan={handleSelectPlan}
            />
        </div>
    );
}
