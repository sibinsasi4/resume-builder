'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { Briefcase, LayoutDashboard, FileText, Linkedin, Mic } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardNavbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                VISISH
                            </h1>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    className={`gap-2 ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/cover-letter">
                                <Button
                                    variant="ghost"
                                    className={`gap-2 ${pathname?.startsWith('/cover-letter') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                                >
                                    <FileText className="w-4 h-4" />
                                    Cover Letters
                                </Button>
                            </Link>
                            <Link href="/linkedin-optimize">
                                <Button
                                    variant="ghost"
                                    className={`gap-2 ${pathname === '/linkedin-optimize' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                                >
                                    <Linkedin className="w-4 h-4" />
                                    LinkedIn
                                </Button>
                            </Link>
                            <Link href="/interview">
                                <Button
                                    variant="ghost"
                                    className={`gap-2 ${pathname === '/interview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                                >
                                    <Mic className="w-4 h-4" />
                                    Interview
                                </Button>
                            </Link>
                            <Link href="/dashboard/jobs">
                                <Button
                                    variant="ghost"
                                    className={`gap-2 ${pathname === '/dashboard/jobs' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                                >
                                    <Briefcase className="w-4 h-4" />
                                    Jobs
                                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                                        NEW
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 hidden sm:inline">Welcome, {session?.user?.name}</span>
                        <Button variant="outline" size="sm" onClick={() => signOut()}>
                            Sign Out
                        </Button>
                    </div>
                </div >
            </div >
        </nav >
    );
}
