import Razorpay from 'razorpay';

// Initialize Razorpay instance (conditional for build)
export const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
    : null;

// Plan pricing in INR (paise - 1 INR = 100 paise)
export const RAZORPAY_PLANS = {
    payperuse: {
        amount: 1900, // ₹19 in paise
        currency: 'INR',
        name: 'Pay Per Download',
    },
    monthly: {
        amount: 29900, // ₹299 in paise
        currency: 'INR',
        name: 'Monthly Pro',
        period: 'monthly',
    },
    yearly: {
        amount: 299900, // ₹2999 in paise (₹299 * 10 months)
        currency: 'INR',
        name: 'Yearly Pro',
        period: 'yearly',
    },
};

/**
 * Create a Razorpay order for one-time payment
 */
export async function createRazorpayOrder(
    amount: number,
    currency: string = 'INR',
    receipt?: string
) {
    if (!razorpay) {
        throw new Error('Razorpay is not configured');
    }

    try {
        const order = await razorpay.orders.create({
            amount, // Amount in paise
            currency,
            receipt: receipt || `order_${Date.now()}`,
            notes: {
                created_at: new Date().toISOString(),
            },
        });
        return order;
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        throw error;
    }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    const crypto = require('crypto');
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

    return expectedSignature === signature;
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyRazorpayWebhook(
    body: string,
    signature: string
): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest('hex');

    return expectedSignature === signature;
}

/**
 * Create a Razorpay subscription
 */
export async function createRazorpaySubscription(
    planId: string,
    customerId: string,
    totalCount?: number
) {
    if (!razorpay) {
        throw new Error('Razorpay is not configured');
    }
    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: totalCount || 12, // Default 12 months
            notes: {
                customer_id: customerId,
            },
        });
        return subscription;
    } catch (error) {
        console.error('Razorpay subscription creation failed:', error);
        throw error;
    }
}

/**
 * Cancel a Razorpay subscription
 */
export async function cancelRazorpaySubscription(subscriptionId: string) {
    if (!razorpay) {
        throw new Error('Razorpay is not configured');
    }
    try {
        const subscription = await razorpay.subscriptions.cancel(subscriptionId);
        return subscription;
    } catch (error) {
        console.error('Razorpay subscription cancellation failed:', error);
        throw error;
    }
}
