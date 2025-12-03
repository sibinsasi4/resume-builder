import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createRazorpayOrder, RAZORPAY_PLANS } from '@/lib/payments/razorpay';
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

        const { plan, couponCode } = await req.json();

        if (!plan || !RAZORPAY_PLANS[plan as keyof typeof RAZORPAY_PLANS]) {
            return NextResponse.json(
                { error: 'Invalid plan' },
                { status: 400 }
            );
        }

        const planDetails = RAZORPAY_PLANS[plan as keyof typeof RAZORPAY_PLANS];
        let finalAmount = planDetails.amount;

        // Apply coupon if provided
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode },
            });

            if (coupon && coupon.isActive) {
                // Check expiry
                if (coupon.expiresAt && new Date() > coupon.expiresAt) {
                    // Expired, ignore
                } else if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
                    // Usage limit reached, ignore
                } else {
                    // Apply discount
                    if (coupon.type === 'percentage') {
                        const discountAmount = (finalAmount * coupon.discount) / 100;
                        finalAmount = Math.round(finalAmount - discountAmount);
                    } else if (coupon.type === 'fixed') {
                        // Fixed amount is in Rupees, convert to paise
                        const discountInPaise = coupon.discount * 100;
                        finalAmount = Math.max(0, finalAmount - discountInPaise);
                    }

                    // Increment usage count
                    await prisma.coupon.update({
                        where: { id: coupon.id },
                        data: { usedCount: { increment: 1 } },
                    });
                }
            }
        }

        // Create Razorpay order
        const order = await createRazorpayOrder(
            finalAmount,
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
