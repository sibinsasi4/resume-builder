import Stripe from 'stripe';

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// Plan pricing in USD (cents - 1 USD = 100 cents)
export const STRIPE_PLANS = {
    monthly: {
        amount: 999, // $9.99 in cents
        currency: 'usd',
        name: 'Monthly Pro',
        interval: 'month' as const,
    },
    yearly: {
        amount: 9999, // $99.99 in cents
        currency: 'usd',
        name: 'Yearly Pro',
        interval: 'year' as const,
    },
};

/**
 * Create a Stripe checkout session for subscription
 */
export async function createStripeCheckoutSession(
    customerId: string | null,
    customerEmail: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
) {
    try {
        const session = await stripe.checkout.sessions.create({
            customer: customerId || undefined,
            customer_email: customerId ? undefined : customerEmail,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
        });
        return session;
    } catch (error) {
        console.error('Stripe checkout session creation failed:', error);
        throw error;
    }
}

/**
 * Create a Stripe customer
 */
export async function createStripeCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>
) {
    try {
        const customer = await stripe.customers.create({
            email,
            name,
            metadata,
        });
        return customer;
    } catch (error) {
        console.error('Stripe customer creation failed:', error);
        throw error;
    }
}

/**
 * Create a Stripe customer portal session
 */
export async function createStripePortalSession(
    customerId: string,
    returnUrl: string
) {
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });
        return session;
    } catch (error) {
        console.error('Stripe portal session creation failed:', error);
        throw error;
    }
}

/**
 * Cancel a Stripe subscription
 */
export async function cancelStripeSubscription(subscriptionId: string) {
    try {
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });
        return subscription;
    } catch (error) {
        console.error('Stripe subscription cancellation failed:', error);
        throw error;
    }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyStripeWebhook(
    payload: string | Buffer,
    signature: string
): Stripe.Event {
    try {
        const event = stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        return event;
    } catch (error) {
        console.error('Stripe webhook verification failed:', error);
        throw error;
    }
}

/**
 * Create a Stripe price for a product
 */
export async function createStripePrice(
    productId: string,
    amount: number,
    currency: string,
    interval: 'month' | 'year'
) {
    try {
        const price = await stripe.prices.create({
            product: productId,
            unit_amount: amount,
            currency,
            recurring: {
                interval,
            },
        });
        return price;
    } catch (error) {
        console.error('Stripe price creation failed:', error);
        throw error;
    }
}
