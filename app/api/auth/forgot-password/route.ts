import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/mail';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return success even if user doesn't exist to prevent enumeration
            return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        // Save token to database
        await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expires,
            },
        });

        // Send email
        await sendPasswordResetEmail(email, token);

        return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
