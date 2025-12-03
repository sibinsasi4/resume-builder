import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserSubscription, getUsageStats } from '@/lib/payments/subscription';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { plan, status, limits, subscription } = await getUserSubscription(user.id);
        const usage = await getUsageStats(user.id);

        return NextResponse.json({
            plan,
            status,
            limits,
            usage,
            subscription: subscription ? {
                id: subscription.id,
                billingCycle: subscription.billingCycle,
                amount: subscription.amount,
                currency: subscription.currency,
                currentPeriodStart: subscription.currentPeriodStart,
                currentPeriodEnd: subscription.currentPeriodEnd,
                cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            } : null,
        });
    } catch (error) {
        console.error('Subscription status error:', error);
        return NextResponse.json(
            { error: 'Failed to get subscription status' },
            { status: 500 }
        );
    }
}
