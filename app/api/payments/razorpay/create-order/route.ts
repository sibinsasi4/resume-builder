import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createRazorpayOrder, RAZORPAY_PLANS } from '@/lib/payments/razorpay';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { plan } = await req.json();

        if (!plan || !RAZORPAY_PLANS[plan as keyof typeof RAZORPAY_PLANS]) {
            return NextResponse.json(
                { error: 'Invalid plan' },
                { status: 400 }
            );
        }

        const planDetails = RAZORPAY_PLANS[plan as keyof typeof RAZORPAY_PLANS];

        // Create Razorpay order
        const order = await createRazorpayOrder(
            planDetails.amount,
            planDetails.currency,
            `order_${session.user.email}_${Date.now()}`
        );

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
