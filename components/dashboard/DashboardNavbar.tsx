'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { Briefcase, LayoutDashboard, FileText, Linkedin, Mic } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AnnouncementBanner from './AnnouncementBanner';

export default function DashboardNavbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Hide navbar on editor pages
    if (pathname?.includes('/editor')) {
        return null;
    }

    return (
        <nav className="bg-slate-950/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
            <AnnouncementBanner />
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
                                VISISH
                            </h1>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    className={`gap-2 ${pathname === '/dashboard' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/cover-letter">
                                <Button
                                    variant="ghost"
                                    className={`gap-2 ${pathname?.startsWith('/cover-letter') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <FileText className="w-4 h-4" />
                                    Cover Letters
                                </Button>
                            </Link>
                            <Link href="/linkedin-optimize">
                                <Button
                                    variant="ghost"
                                    className={`gap-2 ${pathname === '/linkedin-optimize' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Linkedin className="w-4 h-4" />
                                    LinkedIn
                                </Button>
                            </Link>
                            <Link href="/interview">
                                <Button
                                    variant="ghost"
                                    className={`gap-2 ${pathname === '/interview' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Mic className="w-4 h-4" />
                                    Interview
                                </Button>
                            </Link>
                            <Link href="/dashboard/jobs">
                                <Button
                                    variant="ghost"
                                    className={`gap-2 ${pathname === '/dashboard/jobs' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Briefcase className="w-4 h-4" />
                                    Jobs
                                    <span className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-bold text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                                        NEW
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 hidden sm:inline">Welcome, {session?.user?.name}</span>
                        <Button variant="outline" size="sm" onClick={() => signOut()} className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
                            Sign Out
                        </Button>
                    </div>
                </div >
            </div >
        </nav >
    );
}
