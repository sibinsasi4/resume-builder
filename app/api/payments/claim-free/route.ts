import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSubscription } from '@/lib/payments/subscription';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan, couponCode } = await req.json();

        if (!couponCode) {
            return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
        }

        // Validate Coupon
        const coupon = await prisma.coupon.findUnique({
            where: { code: couponCode },
        });

        if (!coupon || !coupon.isActive) {
            return NextResponse.json({ error: 'Invalid or inactive coupon' }, { status: 400 });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
        }

        // Verify it's 100% off
        if (coupon.type !== 'percentage' || coupon.discount !== 100) {
            return NextResponse.json({ error: 'Coupon is not 100% off' }, { status: 400 });
        }

        // Verify plan restriction (Pay Per Download only)
        if (plan !== 'payperuse') {
            return NextResponse.json({ error: 'This coupon is only valid for Pay Per Download' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate bonuses
        let bonusDownloads = 0;
        let bonusDays = 0;
        if (coupon.bonusType === 'downloads') {
            bonusDownloads = coupon.bonusValue || 0;
        } else if (coupon.bonusType === 'duration') {
            bonusDays = coupon.bonusValue || 0;
        }

        // Grant Subscription/Access
        await createSubscription(
            user.id,
            plan,
            'monthly', // Default for payperuse, doesn't matter much as it's 24h
            undefined, // No gateway ID
            undefined, // No gateway
            bonusDownloads,
            bonusDays
        );

        // Record "Payment" (Free)
        await prisma.payment.create({
            data: {
                userId: user.id,
                amount: 0,
                currency: 'INR',
                status: 'completed',
                type: 'one_time',
                description: `Free redemption with coupon ${coupon.code}`,
                gateway: 'coupon',
                gatewayPaymentId: `free_${coupon.code}_${Date.now()}`,
                gatewayOrderId: `free_${coupon.code}_${Date.now()}`,
            },
        });

        // Increment usage
        await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Free claim error:', error);
        return NextResponse.json({ error: 'Failed to redeem coupon' }, { status: 500 });
    }
}
