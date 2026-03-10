import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-amber-500/30">
            {/* Dynamic Background - Globally Applied (Dark Premium Mode) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-2000" />
            </div>

            <div className="relative z-10">
                <DashboardNavbar />
                {children}
            </div>
        </div>
    );
}
