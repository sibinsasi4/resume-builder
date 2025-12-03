import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeResumeWithJob } from '@/lib/ai/analysisService';
import { ResumeData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { resumeId, resumeText, jobDescription, jobTitle } = body;

        let resumeData: ResumeData;
        let resumeIdForDb: string | undefined = undefined;

        // Check if using existing resume or uploaded text
        if (resumeId) {
            // Existing flow: Get resume from database
            const resume = await prisma.resume.findFirst({
                where: {
                    id: resumeId,
                    userId: session.user.id,
                },
            });

            if (!resume) {
                return NextResponse.json(
                    { error: 'Resume not found' },
                    { status: 404 }
                );
            }

            resumeData = resume.data as any;
            resumeIdForDb = resume.id;
        } else if (resumeText) {
            // New flow: Create minimal ResumeData from uploaded text
            resumeData = createMinimalResumeData(resumeText);
        } else {
            return NextResponse.json(
                { error: 'Either resumeId or resumeText must be provided' },
                { status: 400 }
            );
        }

        // Run analysis
        const analysisResult = await analyzeResumeWithJob(
            resumeData,
            jobDescription
        );

        // Save analysis to database
        const analysis = await prisma.jobAnalysis.create({
            data: {
                userId: session.user.id,
                resumeId: resumeIdForDb,
                jobTitle: jobTitle || 'Job Position',
                jobDescription,
                atsScore: analysisResult.atsScore,
                matchScore: analysisResult.matchScore,
                skillsMatch: analysisResult.skillsMatch,
                experienceMatch: analysisResult.experienceMatch,
                educationMatch: analysisResult.educationMatch,
                analysis: JSON.stringify({
                    swotAnalysis: analysisResult.swotAnalysis,
                    suggestions: analysisResult.suggestions,
                    recommendation: analysisResult.recommendation,
                }),
            },
        });

        return NextResponse.json({
            success: true,
            analysisId: analysis.id,
            result: analysisResult,
        });
    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze resume' },
            { status: 500 }
        );
    }
}

/**
 * Create a minimal ResumeData object from plain text
 * This is used for uploaded resumes where we don't have structured data
 */
function createMinimalResumeData(text: string): ResumeData {
    return {
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
        },
        summary: text.substring(0, 500), // Use first 500 chars as summary
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
    };
}
