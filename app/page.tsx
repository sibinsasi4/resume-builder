'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, FileText, Zap, Target, TrendingUp, CheckCircle, Star, Users } from "lucide-react";

export default function HomePage() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Professional Templates",
            description: "Choose from 5 stunning, ATS-optimized resume templates designed by experts",
            color: "from-amber-500 to-yellow-500"
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: "AI-Powered Analysis",
            description: "Get instant ATS scores, job matching, and personalized recommendations",
            color: "from-blue-500 to-indigo-500"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Real-Time Editor",
            description: "See your changes instantly with our live preview editor",
            color: "from-amber-400 to-orange-500"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Job Match Score",
            description: "Know exactly how well you match with any job description",
            color: "from-emerald-500 to-teal-500"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "SWOT Analysis",
            description: "Understand your strengths and areas for improvement",
            color: "from-blue-600 to-cyan-600"
        },
        {
            icon: <CheckCircle className="w-8 h-8" />,
            title: "One-Click Export",
            description: "Download print-ready PDFs that pass ATS systems",
            color: "from-yellow-500 to-amber-600"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "AI Cover Letters",
            description: "Generate tailored cover letters for any job description in seconds",
            color: "from-slate-400 to-zinc-400"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "LinkedIn Optimizer",
            description: "Get AI suggestions to optimize your LinkedIn profile for recruiters",
            color: "from-blue-500 to-blue-700"
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: "Mock Interview Prep",
            description: "Practice with AI-generated questions and get real-time feedback",
            color: "from-amber-400 to-yellow-400"
        }
    ];

    const stats = [
        { value: "10K+", label: "Resumes Created" },
        { value: "95%", label: "Success Rate" },
        { value: "4.9/5", label: "User Rating" },
        { value: "24/7", label: "Support" }
    ];



    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-amber-500/30">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-2000" />
            </div>

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-sans font-extrabold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent tracking-tight">
                                VISISH
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">Features</Link>
                            <Link href="/pricing" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">Pricing</Link>
                            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
                                Sign In
                            </Link>
                            <Link href="/signup"
                                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 rounded-full font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105">
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-6 pt-32 pb-32">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-white/10 rounded-full text-amber-400 text-sm font-medium mb-6 animate-fade-in backdrop-blur-md">
                        <Sparkles className="w-4 h-4" />
                        <span>Now with AI-Powered Analysis</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-slide-up">
                        Craft Your Perfect <br />
                        <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
                            Career Story
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Create ATS-optimized resumes in minutes. Stand out from the crowd with professional templates designed by recruiters.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link href="/signup"
                            className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                            Start Building Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#demo"
                            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                            Watch Demo
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-slate-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-slate-400">Everything you need to create the perfect resume</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index}
                            className="group bg-slate-900/50 rounded-2xl p-8 border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-xl"
                            style={{ animationDelay: `${index * 100}ms` }}>
                            <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials/Trust Section */}
            <section className="relative z-10 container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                        What Our Users Say
                    </h2>
                    <p className="text-xl text-slate-400">Hear from professionals who landed their dream jobs</p>
                </div>
                <div className="mt-20 grid md:grid-cols-2 gap-8 items-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-slate-300" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Sarah Mitchell</h4>
                                    <p className="text-sm text-slate-400">Product Manager at TechCorp</p>
                                </div>
                            </div>
                            <p className="text-slate-300 italic">
                                "Visish helped me restructure my experience perfectly. I got 3x more interview calls within a week!"
                            </p>
                            <div className="mt-6 flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="pl-8 border-l border-slate-800">
                        <h3 className="text-3xl font-bold mb-6 text-white">
                            Trusted by professionals from tailored industries
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Data Science', count: '2.5k+' },
                                { label: 'Engineering', count: '5k+' },
                                { label: 'Marketing', count: '1.8k+' },
                                { label: 'Management', count: '3k+' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-2xl font-bold text-white">{stat.count}</div>
                                    <div className="text-slate-500 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="relative z-10 container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/50 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-amber-500/5" />
                    <div className="relative z-10">
                        <h2 className="text-5xl font-bold mb-6 text-white">Ready to Stand Out?</h2>
                        <p className="text-xl mb-8 opacity-90 text-slate-300">
                            Join thousands of professionals who landed their dream jobs with Visish
                        </p>
                        <Link href="/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105">
                            Create Your Resume Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-800 bg-slate-950 mt-12">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="mb-4">
                                <span className="text-2xl font-sans font-extrabold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent tracking-tight">
                                    VISISH
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Professional resume builder helping you achieve your career goals.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="/pricing" className="hover:text-amber-400 transition-colors">Pricing</Link></li>
                                <li><Link href="#features" className="hover:text-amber-400 transition-colors">Features</Link></li>
                                <li><Link href="#templates" className="hover:text-amber-400 transition-colors">Templates</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="/about" className="hover:text-amber-400 transition-colors">About</Link></li>
                                <li><Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link></li>
                                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms</Link></li>
                                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                    © 2024 Visish. All rights reserved. Built with ❤️ for your career.
                </div>
            </footer>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div >
    );
}
