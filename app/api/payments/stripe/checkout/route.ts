import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createStripeCheckoutSession, STRIPE_PLANS } from '@/lib/payments/stripe';
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

        const { plan, billingCycle } = await req.json();

        if (!plan || !billingCycle) {
            return NextResponse.json(
                { error: 'Missing plan or billing cycle' },
                { status: 400 }
            );
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // For now, use test price IDs - in production, create these in Stripe Dashboard
        const priceId = billingCycle === 'monthly'
            ? process.env.STRIPE_MONTHLY_PRICE_ID || 'price_test_monthly'
            : process.env.STRIPE_YEARLY_PRICE_ID || 'price_test_yearly';

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Create checkout session
        const checkoutSession = await createStripeCheckoutSession(
            user.stripeCustomerId || null,
            user.email,
            priceId,
            `${appUrl}/dashboard?payment=success`,
            `${appUrl}/pricing?payment=cancelled`
        );

        return NextResponse.json({
            sessionId: checkoutSession.id,
            url: checkoutSession.url,
        });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
