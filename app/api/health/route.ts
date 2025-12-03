import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Try to connect to DB
        const userCount = await prisma.user.count();
        const users = await prisma.user.findMany({
            select: { email: true, role: true },
            take: 5
        });

        return NextResponse.json({
            status: 'ok',
            message: 'Database connected successfully',
            userCount,
            users,
            env: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV,
                dbHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'
            }
        });
    } catch (error: any) {
        console.error('Health check failed:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack
        }, { status: 500 });
    }
}
