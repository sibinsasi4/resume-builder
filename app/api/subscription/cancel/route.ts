import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cancelSubscription as cancelSub } from '@/lib/payments/subscription';
import { cancelStripeSubscription } from '@/lib/payments/stripe';
import { cancelRazorpaySubscription } from '@/lib/payments/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
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
            include: { subscription: true },
        });

        if (!user || !user.subscription) {
            return NextResponse.json(
                { error: 'No active subscription found' },
                { status: 404 }
            );
        }

        // Cancel on payment gateway
        if (user.subscription.stripeSubscriptionId) {
            await cancelStripeSubscription(user.subscription.stripeSubscriptionId);
        } else if (user.subscription.razorpaySubscriptionId) {
            await cancelRazorpaySubscription(user.subscription.razorpaySubscriptionId);
        }

        // Update local subscription
        await cancelSub(user.id);

        return NextResponse.json({
            success: true,
            message: 'Subscription cancelled. You will have access until the end of your billing period.',
        });
    } catch (error) {
        console.error('Subscription cancellation error:', error);
        return NextResponse.json(
            { error: 'Failed to cancel subscription' },
            { status: 500 }
        );
    }
}
