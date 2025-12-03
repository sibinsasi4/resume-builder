import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { searchJobs } from '@/lib/services/jobSearch';
import { getUserSubscription } from '@/lib/payments/subscription';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check subscription status
        const { plan, status } = await getUserSubscription(session.user.id);
        const isPremium = (plan === 'pro' || plan === 'premium' || plan === 'payperuse') && status === 'active';
        const isAdmin = session.user.role === 'admin';

        if (!isPremium && !isAdmin) {
            return NextResponse.json({
                error: 'Premium feature',
                requiresUpgrade: true
            }, { status: 403 });
        }

        const { resumeId } = await req.json().catch(() => ({}));

        // Get user's latest resume or specific resume to extract keywords
        const latestResume = await prisma.resume.findFirst({
            where: {
                userId: session.user.id,
                ...(resumeId ? { id: resumeId } : {})
            },
            orderBy: { updatedAt: 'desc' },
        });

        let query = '';
        let location = '';

        if (latestResume) {
            // 1. Try to use resume title first (if it looks like a job title)
            query = latestResume.title;

            try {
                const resumeData = JSON.parse(latestResume.data);

                // 2. If title is generic (e.g. "Resume", "Untitled"), try to find latest job title from experience
                const isGenericTitle = /resume|untitled|cv|profile/i.test(query);

                if (isGenericTitle && resumeData.experience && Array.isArray(resumeData.experience) && resumeData.experience.length > 0) {
                    // Use the most recent job title
                    query = resumeData.experience[0].title || query;
                }

                // 3. Extract location
                if (resumeData.personalInfo?.city) {
                    location = resumeData.personalInfo.city;
                } else if (resumeData.personalInfo?.country) {
                    location = resumeData.personalInfo.country;
                }
            } catch (e) {
                console.error('Error parsing resume data:', e);
            }
        } else {
            // Fallback if no resume found
            query = 'Software Engineer';
        }

        // Default location to India if not specified (User Request)
        if (!location || location.trim() === '') {
            location = 'India';
        }

        // Clean up query (remove "Resume", "CV", "Profile", etc.)
        query = query.replace(/resume|cv|profile|curriculum vitae/gi, '').trim();

        // Remove special characters but keep alphanumeric and spaces
        query = query.replace(/[^a-zA-Z0-9\s]/g, '').trim();

        // Search jobs
        console.log(`API Searching for: "${query}" in "${location}"`);
        const jobs = await searchJobs(query, location);
        console.log(`API Found ${jobs.length} jobs`);

        return NextResponse.json({
            jobs,
            query,
            location,
            matchCount: jobs.length
        });

    } catch (error) {
        console.error('Job matching error:', error);
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
}
