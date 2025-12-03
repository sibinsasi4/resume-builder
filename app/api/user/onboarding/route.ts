import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { onboardingSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validatedData = onboardingSchema.parse(body);

        const user = await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                currentRole: validatedData.currentRole,
                targetRole: validatedData.targetRole,
                experienceLevel: validatedData.experienceLevel,
            },
        });

        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        console.error('Onboarding error:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input data' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
