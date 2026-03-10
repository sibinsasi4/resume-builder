import { FileText, Sparkles, Briefcase, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface WelcomeGuideProps {
    onCreateClick: () => void;
}

export default function WelcomeGuide({ onCreateClick }: WelcomeGuideProps) {
    return (
        <div className="bg-slate-900/50 border border-white/10 shadow-xl rounded-3xl p-8 text-center relative overflow-hidden group backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-purple-500/10 opacity-50" />

            <div className="relative z-10 max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-500/20">
                    <Sparkles className="w-8 h-8 text-amber-400" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">Welcome to Visish!</h2>
                <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                    Let's get your career moving. Follow these 3 simple steps to land your dream job.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                            <FileText className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">1. Create Resume</h3>
                        <p className="text-slate-400 text-sm">
                            Build a professional resume using our ATS-friendly templates.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">2. Analyze & Fix</h3>
                        <p className="text-slate-400 text-sm">
                            Get instant AI feedback to improve your score and readability.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                            <Briefcase className="w-5 h-5 text-teal-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">3. Find Jobs</h3>
                        <p className="text-slate-400 text-sm">
                            Match your resume with top jobs and apply instantly.
                        </p>
                    </div>
                </div>

                <Button
                    onClick={onCreateClick}
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-amber-500/20 hover:scale-105 transition-all font-semibold"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Start Your First Resume
                </Button>
            </div>
        </div>
    );
}
