import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        // Simple security check
        const { searchParams } = new URL(req.url);
        const key = searchParams.get('key');
        if (key !== 'visish_secret_seed_123') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('🌱 Seeding database via API...');

        // Create demo user
        const demoPassword = await bcrypt.hash('demo123', 10);
        const demoUser = await prisma.user.upsert({
            where: { email: 'demo@visish.com' },
            update: {},
            create: {
                email: 'demo@visish.com',
                name: 'Demo User',
                password: demoPassword,
                role: 'user',
                currentRole: 'Software Developer',
                targetRole: 'Senior Software Engineer',
                experienceLevel: 'intermediate',
            },
        });

        // Create demo subscription
        await prisma.subscription.upsert({
            where: { userId: demoUser.id },
            update: {},
            create: {
                userId: demoUser.id,
                plan: 'pro',
                status: 'active',
                billingCycle: 'monthly',
                amount: 999,
                currency: 'INR',
                downloadsLimit: 0,
                analysesLimit: 0,
            },
        });

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await prisma.user.upsert({
            where: { email: 'admin@visish.com' },
            update: {},
            create: {
                email: 'admin@visish.com',
                name: 'Admin User',
                password: adminPassword,
                role: 'admin',
            },
        });

        // Create admin subscription
        await prisma.subscription.upsert({
            where: { userId: adminUser.id },
            update: {},
            create: {
                userId: adminUser.id,
                plan: 'premium',
                status: 'active',
                billingCycle: 'yearly',
                amount: 9999,
                currency: 'INR',
                downloadsLimit: 0,
                analysesLimit: 0,
            },
        });

        return NextResponse.json({
            status: 'success',
            message: 'Database seeded successfully',
            users: [demoUser.email, adminUser.email]
        });

    } catch (error: any) {
        console.error('Seed API failed:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
