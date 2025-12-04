import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createCouponSchema = z.object({
    code: z.string().min(3).max(20),
    discount: z.number().min(0),
    type: z.enum(['percentage', 'fixed']),
    maxUses: z.number().optional(),
    expiresAt: z.string().optional(),
    bonusType: z.enum(['none', 'downloads', 'duration']).default('none'),
    bonusValue: z.number().default(0),
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = createCouponSchema.parse(body);

        const existingCoupon = await prisma.coupon.findUnique({
            where: { code: validatedData.code },
        });

        if (existingCoupon) {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: validatedData.code,
                discount: validatedData.discount,
                type: validatedData.type,
                maxUses: validatedData.maxUses || null,
                expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
                bonusType: validatedData.bonusType,
                bonusValue: validatedData.bonusValue,
            },
        });

        return NextResponse.json({ coupon });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ coupons });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}
