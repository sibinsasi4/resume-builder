import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET all resumes for the current user
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const resumes = await prisma.resume.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            select: {
                id: true,
                title: true,
                templateType: true,
                colorTheme: true,
                updatedAt: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ resumes });
    } catch (error) {
        console.error('Error fetching resumes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resumes' },
            { status: 500 }
        );
    }
}

// POST create a new resume
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { title, templateType, colorTheme, data } = body;

        // Use provided data or default empty structure
        const resumeData = data || {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                location: '',
            },
            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            achievements: [],
        };

        const resume = await prisma.resume.create({
            data: {
                userId: session.user.id,
                title: title || 'Untitled Resume',
                templateType: templateType || 'classic',
                colorTheme: colorTheme || 'blue',
                fontFamily: 'sans',
                data: JSON.stringify(resumeData),
            },
        });

        return NextResponse.json({ resume }, { status: 201 });
    } catch (error) {
        console.error('Error creating resume:', error);
        return NextResponse.json(
            { error: 'Failed to create resume' },
            { status: 500 }
        );
    }
}
