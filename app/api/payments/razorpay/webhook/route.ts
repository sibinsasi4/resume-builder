import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayWebhook } from '@/lib/payments/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const isValid = verifyRazorpayWebhook(body, signature);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        const event = JSON.parse(body);

        // Handle different webhook events
        switch (event.event) {
            case 'subscription.activated':
                await handleSubscriptionActivated(event.payload.subscription.entity);
                break;

            case 'subscription.charged':
                await handleSubscriptionCharged(event.payload.payment.entity);
                break;

            case 'subscription.cancelled':
                await handleSubscriptionCancelled(event.payload.subscription.entity);
                break;

            case 'subscription.completed':
                await handleSubscriptionCompleted(event.payload.subscription.entity);
                break;

            case 'payment.failed':
                await handlePaymentFailed(event.payload.payment.entity);
                break;

            default:
                console.log('Unhandled webhook event:', event.event);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Razorpay webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handleSubscriptionActivated(subscription: any) {
    // Update subscription status to active
    await prisma.subscription.updateMany({
        where: { razorpaySubscriptionId: subscription.id },
        data: { status: 'active' },
    });
}

async function handleSubscriptionCharged(payment: any) {
    // Find subscription by payment
    const subscription = await prisma.subscription.findFirst({
        where: { razorpaySubscriptionId: payment.subscription_id },
        include: { user: true },
    });

    if (!subscription) return;

    // Create payment record
    await prisma.payment.create({
        data: {
            userId: subscription.userId,
            amount: payment.amount / 100, // Convert from paise to rupees
            currency: payment.currency,
            status: 'completed',
            type: 'subscription',
            description: 'Subscription renewal',
            gateway: 'razorpay',
            gatewayPaymentId: payment.id,
        },
    });

    // Update subscription period
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
        },
    });
}

async function handleSubscriptionCancelled(subscription: any) {
    await prisma.subscription.updateMany({
        where: { razorpaySubscriptionId: subscription.id },
        data: { status: 'cancelled' },
    });
}

async function handleSubscriptionCompleted(subscription: any) {
    await prisma.subscription.updateMany({
        where: { razorpaySubscriptionId: subscription.id },
        data: { status: 'expired' },
    });
}

async function handlePaymentFailed(payment: any) {
    // Find subscription
    const subscription = await prisma.subscription.findFirst({
        where: { razorpaySubscriptionId: payment.subscription_id },
    });

    if (!subscription) return;

    // Create failed payment record
    await prisma.payment.create({
        data: {
            userId: subscription.userId,
            amount: payment.amount / 100,
            currency: payment.currency,
            status: 'failed',
            type: 'subscription',
            description: 'Subscription payment failed',
            gateway: 'razorpay',
            gatewayPaymentId: payment.id,
        },
    });
}
