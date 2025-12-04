import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { model } from '@/lib/ai/gemini';
import { canAccessFeature } from '@/lib/payments/subscription';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check subscription
        const hasAccess = await canAccessFeature(user.id, 'interview_prep');
        if (!hasAccess) {
            const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
            if (subscription?.plan !== 'premium') {
                return NextResponse.json({ error: 'Upgrade to Premium to access Interview Prep' }, { status: 403 });
            }
        }

        const { jobTitle, jobDescription, resumeId } = await req.json();

        if (!jobTitle) {
            return NextResponse.json({ error: 'Job title required' }, { status: 400 });
        }

        let context = '';
        if (resumeId) {
            const resume = await prisma.resume.findUnique({ where: { id: resumeId, userId: user.id } });
            if (resume) {
                const resumeData = JSON.parse(resume.data);
                context = `Candidate Resume Skills: ${resumeData.skills?.join(', ') || ''}. Experience: ${JSON.stringify(resumeData.experience || [])}.`;
            }
        }

        const prompt = `
            You are an Expert Technical Interviewer.
            Generate 10 challenging but relevant interview questions for the role of "${jobTitle}".
            
            Job Description Context: ${jobDescription || 'Not provided'}
            ${context}
            
            **Instructions:**
            1. Questions should be a mix of behavioral and technical (if applicable).
            2. Return ONLY a JSON array of strings.
            3. Do not include markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const questions = JSON.parse(text);

        // Create session
        const interview = await prisma.interviewSession.create({
            data: {
                userId: user.id,
                jobTitle,
                jobDescription,
                questions: JSON.stringify(questions),
                status: 'created',
            },
        });

        return NextResponse.json({ interviewId: interview.id, questions });

    } catch (error) {
        console.error('Interview Generation Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate interview' }, { status: 500 });
    }
}
