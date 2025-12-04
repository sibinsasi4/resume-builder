'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, FileText, Zap, Target, TrendingUp, CheckCircle, Star } from "lucide-react";

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
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: "AI-Powered Analysis",
            description: "Get instant ATS scores, job matching, and personalized recommendations",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Real-Time Editor",
            description: "See your changes instantly with our live preview editor",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Job Match Score",
            description: "Know exactly how well you match with any job description",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "SWOT Analysis",
            description: "Understand your strengths and areas for improvement",
            color: "from-indigo-500 to-purple-500"
        },
        {
            icon: <CheckCircle className="w-8 h-8" />,
            title: "One-Click Export",
            description: "Download print-ready PDFs that pass ATS systems",
            color: "from-pink-500 to-rose-500"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "AI Cover Letters",
            description: "Generate tailored cover letters for any job description in seconds",
            color: "from-orange-400 to-amber-400"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "LinkedIn Optimizer",
            description: "Get AI suggestions to optimize your LinkedIn profile for recruiters",
            color: "from-blue-600 to-indigo-600"
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: "Mock Interview Prep",
            description: "Practice with AI-generated questions and get real-time feedback",
            color: "from-green-400 to-emerald-500"
        }
    ];

    const stats = [
        { value: "10K+", label: "Resumes Created" },
        { value: "95%", label: "Success Rate" },
        { value: "4.9/5", label: "User Rating" },
        { value: "24/7", label: "Support" }
    ];



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${scrollY * 0.5}px)` }} />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${-scrollY * 0.3}px)` }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                VISISH
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="#features" className="hover:text-blue-400 transition-colors">Features</Link>
                            <Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link>
                            <Link href="/login" className="hover:text-blue-400 transition-colors">Sign In</Link>
                            <Link href="/signup"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8 animate-fade-in">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm">Trusted by 10,000+ job seekers</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                            Build Your
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                            Dream Resume
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Create stunning, ATS-optimized resumes with AI-powered insights.
                        Land your dream job with professional templates and smart recommendations.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link href="/signup"
                            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                            Start Building Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#demo"
                            className="px-8 py-4 bg-white/10 backdrop-blur-xl rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                            Watch Demo
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-gray-400">Everything you need to create the perfect resume</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index}
                            className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                            style={{ animationDelay: `${index * 100}ms` }}>
                            <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>



            {/* CTA Section */}
            <section className="relative z-10 container mx-auto px-6 py-24">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10">
                        <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join thousands of professionals who landed their dream jobs with VISISH
                        </p>
                        <Link href="/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            Create Your Resume Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl mt-24">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <span className="text-xl font-bold">VISISH</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                AI-powered resume builder helping you land your dream job.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#templates" className="hover:text-white transition-colors">Templates</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
                        © 2024 VISISH. All rights reserved. Built with ❤️ for job seekers.
                    </div>
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
        </div>
    );
}
