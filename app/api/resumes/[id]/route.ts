import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET a specific resume
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const whereClause = session.user.role === 'admin'
            ? { id: params.id }
            : { id: params.id, userId: session.user.id };

        const resume = await prisma.resume.findFirst({
            where: whereClause,
        });

        if (!resume) {
            return NextResponse.json(
                { error: 'Resume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ resume });
    } catch (error) {
        console.error('Error fetching resume:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resume' },
            { status: 500 }
        );
    }
}

// PUT update a resume
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();

        const whereClause = session.user.role === 'admin'
            ? { id: params.id }
            : { id: params.id, userId: session.user.id };

        const resume = await prisma.resume.updateMany({
            where: whereClause,
            data: {
                title: body.title,
                templateType: body.templateType,
                colorTheme: body.colorTheme,
                fontFamily: body.fontFamily,
                data: body.data,
            },
        });

        if (resume.count === 0) {
            return NextResponse.json(
                { error: 'Resume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating resume:', error);
        return NextResponse.json(
            { error: 'Failed to update resume' },
            { status: 500 }
        );
    }
}

// DELETE a resume
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const whereClause = session.user.role === 'admin'
            ? { id: params.id }
            : { id: params.id, userId: session.user.id };

        const resume = await prisma.resume.deleteMany({
            where: whereClause,
        });

        if (resume.count === 0) {
            return NextResponse.json(
                { error: 'Resume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting resume:', error);
        return NextResponse.json(
            { error: 'Failed to delete resume' },
            { status: 500 }
        );
    }
}
