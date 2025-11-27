import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Create admin user - REMOVE THIS IN PRODUCTION!
export async function POST(req: NextRequest) {
    try {
        const adminEmail = 'admin@visish.com';

        // Check if admin already exists
        let admin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (admin) {
            return NextResponse.json({
                success: true,
                message: 'Admin already exists',
                credentials: {
                    email: adminEmail,
                    password: 'admin123'
                }
            });
        }

        // Create admin user
        const hashedPassword = await hash('admin123', 12);
        admin = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'Administrator',
                role: 'admin',
                currentRole: 'System Administrator',
                targetRole: 'Platform Manager',
                experienceLevel: 'expert'
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Admin account created successfully',
            credentials: {
                email: adminEmail,
                password: 'admin123'
            }
        });
    } catch (error) {
        console.error('Admin setup error:', error);
        return NextResponse.json(
            { error: 'Failed to setup admin account' },
            { status: 500 }
        );
    }
}
