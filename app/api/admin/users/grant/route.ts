import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, downloads } = await req.json();

        if (!userId || !downloads) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const downloadsToAdd = parseInt(downloads);

        // Find or create subscription
        const userSubscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        if (userSubscription) {
            // Update existing subscription
            await prisma.subscription.update({
                where: { userId },
                data: {
                    downloadsLimit: { increment: downloadsToAdd },
                    currentPeriodEnd: new Date(Date.now() + 24 * 60 * 60 * 1000), // Extend/Reset to 24h from now
                    status: 'active', // Reactivate if expired
                },
            });
        } else {
            // Create new payperuse subscription
            await prisma.subscription.create({
                data: {
                    userId,
                    plan: 'payperuse',
                    status: 'active',
                    downloadsLimit: downloadsToAdd,
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h access
                },
            });
        }

        return NextResponse.json({ success: true, message: `Granted ${downloadsToAdd} downloads` });
    } catch (error) {
        console.error('Error granting access:', error);
        return NextResponse.json({ error: 'Failed to grant access' }, { status: 500 });
    }
}
