'use client';

import { useState, useEffect } from 'react';
import { FileText, Mic, Briefcase, Sparkles, Video, Search, MapPin, Building2, Calendar, Mail, Phone, Globe } from 'lucide-react';

const features = [
    {
        id: 'resume',
        title: 'Professional Resume Builder',
        description: 'Create ATS-optimized resumes in minutes with our AI-powered builder.',
        icon: FileText,
        color: 'amber',
        content: (
            <div className="relative w-full h-full bg-slate-200 rounded-lg p-2 overflow-hidden flex flex-col font-sans text-[10px] leading-tight text-slate-800 shadow-md">
                {/* Resume Paper Mockup */}
                <div className="bg-white w-full h-full shadow-sm flex flex-col p-4 animate-scale-in origin-top">
                    {/* Header */}
                    <div className="border-b-2 border-slate-800 pb-3 mb-3 flex justify-between items-end">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Alex Morgan</h1>
                            <p className="text-amber-600 font-semibold tracking-wide text-xs mt-0.5">Senior Software Engineer</p>
                        </div>
                        <div className="text-right text-[8px] text-slate-500 space-y-0.5">
                            <div className="flex items-center justify-end gap-1"><Mail className="w-2 h-2" /> alex.morgan@example.com</div>
                            <div className="flex items-center justify-end gap-1"><Phone className="w-2 h-2" /> +1 (555) 123-4567</div>
                            <div className="flex items-center justify-end gap-1"><MapPin className="w-2 h-2" /> San Francisco, CA</div>
                        </div>
                    </div>

                    <div className="flex gap-4 h-full">
                        {/* Left Column */}
                        <div className="w-2/3 space-y-4">
                            {/* Summary */}
                            <div>
                                <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-0.5 mb-1.5 uppercase text-[9px]">Professional Summary</h2>
                                <p className="text-slate-600 text-[9px] leading-relaxed">
                                    Innovative Senior Software Engineer with 6+ years of experience in full-stack development. Proven track record of leading high-performance teams and delivering scalable web applications.
                                </p>
                            </div>

                            {/* Experience */}
                            <div>
                                <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-0.5 mb-2 uppercase text-[9px]">Experience</h2>
                                <div className="space-y-2">
                                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                        <div className="flex justify-between mb-0.5">
                                            <span className="font-bold text-slate-800">TechFlow Systems</span>
                                            <span className="text-slate-500 text-[8px]">2021 - Present</span>
                                        </div>
                                        <div className="text-[8px] font-medium text-slate-600 mb-1">Senior Frontend Lead</div>
                                        <ul className="list-disc list-inside text-slate-500 space-y-0.5 pl-1">
                                            <li>Architected core dashboard reducing load times by 40%.</li>
                                            <li>Mentored 5 junior developers and established code standards.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-0.5">
                                            <span className="font-bold text-slate-800">InnovateX</span>
                                            <span className="text-slate-500 text-[8px]">2018 - 2021</span>
                                        </div>
                                        <div className="text-[8px] font-medium text-slate-600 mb-1">Full Stack Developer</div>
                                        <ul className="list-disc list-inside text-slate-500 space-y-0.5 pl-1">
                                            <li>Developed 3 key client applications using React and Node.js.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-1/3 space-y-4 bg-slate-50 p-2 -my-2 rounded-r h-[105%]">
                            {/* Skills */}
                            <div className="mt-2">
                                <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-0.5 mb-2 uppercase text-[9px]">Skills</h2>
                                <div className="flex flex-wrap gap-1">
                                    {['React', 'Next.js', 'Typescript', 'Node.js', 'AWS', 'Tailwind', 'GraphQL'].map(skill => (
                                        <span key={skill} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[8px] font-medium text-slate-700">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Education */}
                            <div>
                                <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-0.5 mb-2 uppercase text-[9px]">Education</h2>
                                <div>
                                    <div className="font-bold text-slate-800">BS Computer Science</div>
                                    <div className="text-slate-600 text-[8px]">Stanford University</div>
                                    <div className="text-slate-500 text-[8px]">2014 - 2018</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg px-3 py-1 rounded-full flex items-center gap-1.5 animate-bounce-slow z-10">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[10px] font-bold">ATS Score: 98</span>
                </div>
            </div>
        )
    },
    {
        id: 'cover-letter',
        title: 'Smart Cover Letters',
        description: 'Generate tailored cover letters for every job application instantly.',
        icon: FileText,
        color: 'purple',
        content: (
            <div className="relative w-full h-full bg-slate-200 rounded-lg p-3 overflow-hidden flex flex-col items-center shadow-inner">
                {/* Paper Sheet */}
                <div className="bg-white w-full max-w-[90%] h-full shadow-lg p-5 flex flex-col font-serif text-[10px] leading-relaxed text-slate-800 animate-slide-up">
                    {/* Header */}
                    <div className="mb-4 text-slate-600 text-[9px]">
                        <p>September 24, 2024</p>
                        <p className="mt-2 text-slate-800 font-bold">Hiring Manager</p>
                        <p>Google Inc.</p>
                        <p>Mountain View, CA</p>
                    </div>

                    <div className="space-y-3 relative">
                        {/* Typing Effect Overlay Mask - reveals text */}
                        <p>Dear Hiring Manager,</p>
                        <p>
                            I am writing to express my strong interest in the Senior Frontend Engineer position at Google. With over 6 years of experience building scalable web applications and a passion for user-centric design, I am confident in my ability to contribute effectively to your engineering team.
                        </p>
                        <p>
                            In my current role at TechFlow Systems, I led the architectural redesign of our core dashboard, resulting in a 40% improvement in load times and significantly enhancing user satisfaction. I have extensive experience with the modern JavaScript ecosystem, including React, Next.js, and TypeScript, which aligns perfectly with your technology stack.
                        </p>
                        <div className="h-0.5 w-10 bg-purple-500/20 absolute -left-3 top-10 animate-pulse"></div>
                    </div>

                    <div className="mt-auto pt-4">
                        <p>Sincerely,</p>
                        <p className="font-script text-lg mt-1 text-purple-900">Alex Morgan</p>
                    </div>
                </div>

                {/* Action Button Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <div className="bg-slate-900/90 backdrop-blur text-white text-xs px-4 py-2 rounded-lg font-medium shadow-xl flex items-center gap-2 border border-white/10">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        Generating for "Senior Engineer"...
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'interview',
        title: 'AI Interview Coach',
        description: 'Practice with realistic AI interviews and get real-time feedback.',
        icon: Mic,
        color: 'blue',
        content: (
            <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-white/5 flex flex-col shadow-2xl font-sans group">
                {/* Video Area */}
                <div className="flex-1 relative flex flex-col bg-slate-950">
                    {/* Header Overlay */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {/* REC Indicator */}
                        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 w-max">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                            <span className="text-[10px] text-red-400 font-mono font-bold tracking-widest">REC 00:42</span>
                        </div>

                        {/* Analysis HUD */}
                        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 w-40 shadow-2xl animate-fade-in-up">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Real-time Analysis</span>
                                <Sparkles className="w-2 h-2 text-blue-400" />
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between text-[8px] text-slate-300 mb-0.5 font-medium"><span>Pace</span><span className="text-green-400">Perfect</span></div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5"><div className="h-full w-[85%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[8px] text-slate-300 mb-0.5 font-medium"><span>Clarity</span><span className="text-blue-400">High</span></div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5"><div className="h-full w-[92%] bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logo Watermark (Top Right) */}
                    <div className="absolute top-4 right-4 z-10 opacity-50">
                        <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur px-2 py-1 rounded-lg border border-white/5">
                            <span className="text-[10px] font-bold text-white tracking-widest">VISISH</span>
                        </div>
                    </div>

                    {/* Main Content (AI Waveform) */}
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                        {/* Audio Waveform Animation */}
                        <div className="flex items-center gap-1 h-12 mb-6">
                            {[...Array(9)].map((_, i) => (
                                <div key={i}
                                    className="w-1.5 bg-blue-500/80 rounded-full animate-wave"
                                    style={{
                                        animationDelay: `${i * 0.1}s`,
                                        height: i % 2 === 0 ? '40%' : '80%',
                                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                                    }}
                                ></div>
                            ))}
                        </div>

                        {/* Question Bubble */}
                        <div className="bg-slate-900/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl max-w-[80%] text-center transform transition-all hover:scale-105 cursor-default">
                            <p className="text-white text-xs font-medium leading-relaxed">
                                "Tell me about a time you resolved a technical conflict within your team."
                            </p>
                        </div>
                    </div>

                    {/* User Feed (PIP) - Larger & Styled */}
                    <div className="absolute bottom-4 right-4 w-28 h-36 bg-slate-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col z-20 group-hover:scale-105 transition-transform duration-300 ring-1 ring-white/5">
                        <div className="flex-1 bg-slate-800 flex items-center justify-center relative">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-white/5">
                                <span className="text-xs font-bold text-slate-400">You</span>
                            </div>
                            {/* Fake mic status */}
                            <div className="absolute bottom-2 right-2 bg-black/50 p-1 rounded-full">
                                <Mic className="w-2.5 h-2.5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Bar - Refined */}
                <div className="h-16 bg-slate-950 border-t border-white/10 flex items-center justify-center gap-8 relative z-30">
                    <button className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 text-slate-400 hover:bg-slate-700 hover:text-white transition flex items-center justify-center active:scale-95"><Mic className="w-4 h-4" /></button>
                    <button className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all active:scale-95 ring-4 ring-red-500/10 group-hover:ring-red-500/20">
                        <div className="w-5 h-5 bg-white rounded-md"></div>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 text-slate-400 hover:bg-slate-700 hover:text-white transition flex items-center justify-center active:scale-95"><Video className="w-4 h-4" /></button>
                </div>

                <style jsx>{`
                    @keyframes wave {
                        0%, 100% { height: 40%; opacity: 0.5; }
                        50% { height: 100%; opacity: 1; }
                    }
                    .animate-wave {
                        animation: wave 1s ease-in-out infinite;
                    }
                `}</style>
            </div>
        )
    },
    {
        id: 'jobs',
        title: 'Smart Job Matching',
        description: 'Find jobs that perfectly match your skills and experience.',
        icon: Briefcase,
        color: 'green',
        content: (
            <div className="relative w-full h-full bg-slate-900 rounded-lg p-4 border border-white/5 overflow-hidden flex flex-col gap-3">
                {/* Match Header */}
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Top Recommended</span>
                    <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-white/5">Filter: Best Match</span>
                </div>

                {/* Job Cards */}
                <div className="space-y-2.5">
                    {/* Card 1 - High Match */}
                    <div className="p-3 bg-slate-800/80 border border-amber-500/50 rounded-lg shadow-lg shadow-black/20 group hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-0.5">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2.5">
                                <div className="w-8 h-8 rounded bg-white flex items-center justify-center overflow-hidden">
                                    <span className="font-bold text-slate-900 text-xs">G</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white leading-none mb-1">Frontend Lead</h3>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1">Google <span className="w-0.5 h-0.5 rounded-full bg-slate-500"></span> Palo Alto</div>
                                </div>
                            </div>
                            <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">98% Match</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <span className="text-[9px] bg-white/5 text-slate-300 px-1.5 py-0.5 rounded">React</span>
                            <span className="text-[9px] bg-white/5 text-slate-300 px-1.5 py-0.5 rounded">Leadership</span>
                            <span className="text-[9px] bg-white/5 text-slate-300 px-1.5 py-0.5 rounded">$180k+</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="p-3 bg-slate-900/50 border border-white/5 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2.5">
                                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                                    <span className="font-bold text-slate-400 text-xs">A</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-200 leading-none mb-1">Senior UI Engineer</h3>
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1">Amazon <span className="w-0.5 h-0.5 rounded-full bg-slate-500"></span> Remote</div>
                                </div>
                            </div>
                            <span className="bg-green-500/10 text-green-500/80 border border-green-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">92% Match</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <span className="text-[9px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded">Design System</span>
                            <span className="text-[9px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded">Figma</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="p-3 bg-slate-900/50 border border-white/5 rounded-lg opacity-60">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2.5">
                                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                                    <span className="font-bold text-slate-400 text-xs">S</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-200 leading-none mb-1">Full Stack Dev</h3>
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1">Stripe <span className="w-0.5 h-0.5 rounded-full bg-slate-500"></span> SF</div>
                                </div>
                            </div>
                            <span className="bg-yellow-500/10 text-yellow-500/80 border border-yellow-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">88% Match</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

export default function FeatureShowcase() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % features.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const CurrentFeature = features[currentIndex];
    const Icon = CurrentFeature.icon;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            {/* Background Blobs - Dynamic Colors based on active slide */}
            <div className="absolute inset-0 transition-opacity duration-1000">
                <div className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[128px] animate-pulse transition-colors duration-1000 ${CurrentFeature.color === 'amber' ? 'bg-amber-500/20' :
                    CurrentFeature.color === 'purple' ? 'bg-purple-600/20' :
                        CurrentFeature.color === 'blue' ? 'bg-blue-500/20' :
                            'bg-green-500/20'
                    }`}></div>
                <div className={`absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-[128px] animate-pulse delay-1000 transition-colors duration-1000 ${CurrentFeature.color === 'amber' ? 'bg-purple-600/20' :
                    CurrentFeature.color === 'purple' ? 'bg-blue-500/20' :
                        CurrentFeature.color === 'blue' ? 'bg-green-500/20' :
                            'bg-amber-500/20'
                    }`}></div>
            </div>

            {/* Main Content Card */}
            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 relative animate-float shadow-2xl">
                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-6">
                        <div className={`w-20 h-20 bg-gradient-to-br rounded-2xl rotate-12 opacity-50 blur-xl transition-colors duration-1000 ${CurrentFeature.color === 'amber' ? 'from-amber-400 to-yellow-600' :
                            CurrentFeature.color === 'purple' ? 'from-purple-400 to-pink-600' :
                                CurrentFeature.color === 'blue' ? 'from-blue-400 to-cyan-600' :
                                    'from-green-400 to-emerald-600'
                            }`}></div>
                    </div>

                    <div className="space-y-8">
                        {/* Visual Display Area */}
                        <div className="relative aspect-video rounded-xl bg-slate-950/50 overflow-hidden border border-white/5 shadow-inner group ring-1 ring-white/5">
                            {/* Transition wrapper for content */}
                            <div key={CurrentFeature.id} className="w-full h-full p-4 animate-fade-in text-left">
                                {CurrentFeature.content}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="transition-all duration-500 text-left">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg transition-colors duration-500 ${CurrentFeature.color === 'amber' ? 'bg-amber-500/10 text-amber-500' :
                                    CurrentFeature.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                                        CurrentFeature.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-green-500/10 text-green-500'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-white transition-all duration-300">
                                    {CurrentFeature.title}
                                </h3>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed h-14">
                                {CurrentFeature.description}
                            </p>
                        </div>

                        {/* Progress Indicators */}
                        <div className="flex gap-2 pt-4 justify-start">
                            {features.map((feature, idx) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex
                                        ? `w-8 ${feature.color === 'amber' ? 'bg-amber-500' :
                                            feature.color === 'purple' ? 'bg-purple-500' :
                                                feature.color === 'blue' ? 'bg-blue-500' :
                                                    'bg-green-500'
                                        }`
                                        : 'w-2 bg-slate-700 hover:bg-slate-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="text-2xl font-bold text-amber-500 mb-1">10k+</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Resumes Built</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="text-2xl font-bold text-amber-500 mb-1">98%</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Success Rate</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
