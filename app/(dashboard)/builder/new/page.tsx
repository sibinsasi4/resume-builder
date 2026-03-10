'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BuilderWizard from '@/components/builder/BuilderWizard';

export default function NewBuilderPage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin" />
                        <div className="absolute inset-2 border-r-2 border-yellow-500 rounded-full animate-spin" />
                        <div className="absolute inset-4 border-b-2 border-purple-500 rounded-full animate-spin" />
                    </div>
                    <p className="mt-6 text-slate-400 animate-pulse font-medium">Loading builder...</p>
                </div>
            </div>
        );
    }

    return <BuilderWizard />;
}
