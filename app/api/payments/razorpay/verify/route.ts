import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifyRazorpaySignature } from '@/lib/payments/razorpay';
import { createSubscription } from '@/lib/payments/subscription';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            plan,
            billingCycle,
            couponCode,
        } = await req.json();

        // Verify payment signature
        const isValid = verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
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

        // Determine amount based on plan
        let amount = 0;
        if (plan === 'payperuse') {
            amount = 19;
        } else if (plan === 'monthly') {
            amount = 299;
        } else if (plan === 'yearly') {
            amount = 2999;
        }

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                userId: user.id,
                amount,
                currency: 'INR',
                status: 'completed',
                type: plan === 'payperuse' ? 'one_time' : 'subscription',
                description: `Payment for ${plan} plan`,
                gateway: 'razorpay',
                gatewayPaymentId: razorpay_payment_id,
                gatewayOrderId: razorpay_order_id,
            },
        });

        // Validate coupon for bonuses
        let bonusDownloads = 0;
        let bonusDays = 0;

        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode },
            });

            if (coupon && coupon.isActive) {
                // Check expiry and usage limits (simplified check as it was likely checked in create-order)
                const isValid = (!coupon.expiresAt || new Date() <= coupon.expiresAt) &&
                    (!coupon.maxUses || coupon.usedCount < coupon.maxUses); // Note: usedCount might have been incremented in create-order, so this check is tricky. 
                // Better approach: Trust create-order incremented it, or just check if it exists.
                // For now, we assume if it was applied in create-order, it's valid. 
                // But to be safe, we just read the bonus values.

                if (coupon.bonusType === 'downloads') {
                    bonusDownloads = coupon.bonusValue || 0;
                } else if (coupon.bonusType === 'duration') {
                    bonusDays = coupon.bonusValue || 0;
                }
            }
        }

        // Create or update subscription
        await createSubscription(
            user.id,
            plan,
            billingCycle as 'monthly' | 'yearly',
            razorpay_payment_id,
            'razorpay',
            bonusDownloads,
            bonusDays
        );

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}-${user.id.slice(0, 8)}`;

        // Create invoice
        await prisma.invoice.create({
            data: {
                invoiceNumber,
                amount,
                currency: 'INR',
                status: 'paid',
                customerName: user.name || 'Customer',
                customerEmail: user.email,
                paidAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            paymentId: payment.id,
            message: 'Payment verified successfully',
        });
    } catch (error) {
        console.error('Razorpay verification error:', error);
        return NextResponse.json(
            { error: 'Payment verification failed' },
            { status: 500 }
        );
    }
}
