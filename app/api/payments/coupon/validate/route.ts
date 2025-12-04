import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code },
        });

        if (!coupon) {
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
        }

        if (!coupon.isActive) {
            return NextResponse.json({ error: 'Coupon is inactive' }, { status: 400 });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
        }

        return NextResponse.json({
            code: coupon.code,
            discount: coupon.discount,
            type: coupon.type,
            bonusType: coupon.bonusType,
            bonusValue: coupon.bonusValue,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
    }
}
