import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhook } from '@/lib/payments/stripe';
import { createSubscription } from '@/lib/payments/subscription';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        // Verify webhook
        const event = verifyStripeWebhook(body, signature);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            case 'invoice.paid':
                await handleInvoicePaid(event.data.object as Stripe.Invoice);
                break;

            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            default:
                console.log('Unhandled Stripe event:', event.type);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Stripe webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    // Find user by Stripe customer ID
    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) {
        // Create user if doesn't exist (shouldn't happen normally)
        console.error('User not found for customer:', customerId);
        return;
    }

    // Create subscription record
    await createSubscription(
        user.id,
        'pro', // Default to pro plan
        'monthly', // Will be updated by subscription webhook
        subscriptionId,
        'stripe'
    );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) return;

    const status = subscription.status === 'active' ? 'active' :
        subscription.status === 'canceled' ? 'cancelled' :
            subscription.status === 'past_due' ? 'active' : 'expired';

    const billingCycle = subscription.items.data[0]?.price.recurring?.interval === 'year'
        ? 'yearly'
        : 'monthly';

    await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
            userId: user.id,
            plan: 'pro',
            status,
            billingCycle,
            amount: (subscription.items.data[0]?.price.unit_amount || 0) / 100,
            currency: subscription.currency.toUpperCase(),
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            stripeSubscriptionId: subscription.id,
            downloadsLimit: 30,
            analysesLimit: 0,
        },
        update: {
            status,
            billingCycle,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
    });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: 'cancelled' },
    });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) return;

    // Create payment record
    await prisma.payment.create({
        data: {
            userId: user.id,
            amount: (invoice.amount_paid || 0) / 100,
            currency: invoice.currency.toUpperCase(),
            status: 'completed',
            type: 'subscription',
            description: invoice.description || 'Subscription payment',
            gateway: 'stripe',
            gatewayPaymentId: invoice.payment_intent as string,
        },
    });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) return;

    // Create failed payment record
    await prisma.payment.create({
        data: {
            userId: user.id,
            amount: (invoice.amount_due || 0) / 100,
            currency: invoice.currency.toUpperCase(),
            status: 'failed',
            type: 'subscription',
            description: 'Subscription payment failed',
            gateway: 'stripe',
        },
    });
}
