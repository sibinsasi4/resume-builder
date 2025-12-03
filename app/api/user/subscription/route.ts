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

        // Get user's subscription
        const subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id }
        });

        // Get usage records for current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const usageRecords = await prisma.usageRecord.findMany({
            where: {
                userId: session.user.id,
                type: 'download',
                createdAt: {
                    gte: startOfMonth
                }
            }
        });

        const downloadsUsed = usageRecords.length;

        // Determine download limit based on plan
        let downloadsLimit = 0;
        if (subscription) {
            if (subscription.plan === 'payperuse') {
                downloadsLimit = 1; // Single download
            } else if (subscription.plan === 'pro' || subscription.plan === 'premium') {
                downloadsLimit = 30; // 30 downloads per month
            }
        }

        return NextResponse.json({
            subscription: subscription || { plan: 'free', status: 'inactive' },
            usage: {
                downloadsUsed,
                downloadsLimit,
                downloadsRemaining: Math.max(0, downloadsLimit - downloadsUsed)
            }
        });
    } catch (error) {
        console.error('Subscription check error:', error);
        return NextResponse.json(
            { error: 'Failed to check subscription' },
            { status: 500 }
        );
    }
}
