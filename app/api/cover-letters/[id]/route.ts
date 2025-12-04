import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const coverLetter = await prisma.coverLetter.findUnique({
            where: { id: params.id },
        });

        if (!coverLetter) {
            return NextResponse.json({ error: 'Cover Letter not found' }, { status: 404 });
        }

        // Verify ownership
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (coverLetter.userId !== user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        return NextResponse.json({ coverLetter });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch cover letter' }, { status: 500 });
    }
}
