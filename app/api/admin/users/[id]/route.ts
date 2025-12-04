import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = params.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscription: true,
                _count: {
                    select: {
                        resumes: true,
                        downloads: true,
                    }
                },
                downloads: {
                    orderBy: { createdAt: 'desc' },
                    take: 50, // Limit to last 50 downloads
                    include: {
                        resume: {
                            select: { title: true }
                        }
                    }
                },
                sessions: {
                    orderBy: { lastActiveAt: 'desc' },
                    take: 5
                },
                resumes: {
                    orderBy: { updatedAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        templateType: true,
                        updatedAt: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { role } = body;

        if (role !== 'user' && role !== 'admin') {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: { role },
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
    }
}
