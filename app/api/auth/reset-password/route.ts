import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Missing token or password' }, { status: 400 });
        }

        // Find valid token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
        }

        if (new Date() > resetToken.expires) {
            await prisma.passwordResetToken.delete({ where: { token } });
            return NextResponse.json({ error: 'Token expired' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword },
        });

        // Delete used token
        await prisma.passwordResetToken.delete({
            where: { token },
        });

        return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
