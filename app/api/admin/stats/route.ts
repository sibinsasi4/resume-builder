import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    console.log('Admin Stats API: Started');
    try {
        const session = await getServerSession(authOptions);
        console.log('Admin Stats API: Session retrieved', session?.user?.email, session?.user?.role);

        if (!session?.user?.id) {
            console.log('Admin Stats API: No user ID');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });
        console.log('Admin Stats API: User role from DB', user?.role);

        if (user?.role !== 'admin') {
            console.log('Admin Stats API: Not admin');
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // DEBUGGING: Step-by-step query enablement
        console.log('Admin Stats API: Running debug queries');

        try {
            // Run queries sequentially to avoid SQLite concurrency issues
            const totalUsers = await prisma.user.count();
            const totalResumes = await prisma.resume.count();
            // const totalDownloads = await prisma.download.count();
            const totalDownloads = 0; // Temporary fix for crashing query
            const activeUsersGroup = await prisma.userSession.groupBy({
                by: ['userId'],
                where: {
                    lastActiveAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            });
            const activeUsers24h = activeUsersGroup.length;

            return NextResponse.json({
                totalUsers,
                totalResumes,
                totalDownloads,
                totalRevenue: 0,
                activeSubscriptions: 0,
                paidUsers: 0,
                freeUsers: totalUsers,
                activeUsers24h,
                paymentStats: { total: 0, successful: 0, failed: 0, successRate: 0 },
                loginStats: { today: 0, thisWeek: 0, thisMonth: 0 },
                financialMetrics: { mrr: 0, arr: 0, arpu: 0 }
            });
        } catch (e) {
            console.error('Admin Stats API: Query failed', e);
            throw e;
        }
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
