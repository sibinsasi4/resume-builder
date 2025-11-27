import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        if (user?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get stats
        const [totalUsers, totalResumes, totalAnalyses] = await Promise.all([
            prisma.user.count(),
            prisma.resume.count(),
            prisma.jobAnalysis.count()
        ]);

        return NextResponse.json({
            totalUsers,
            totalResumes,
            totalDownloads: totalResumes, // In real app, track actual downloads
            totalRevenue: 0, // Will be calculated from payment records
            activeSubscriptions: 0, // Will be from subscription table
            totalAnalyses
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
