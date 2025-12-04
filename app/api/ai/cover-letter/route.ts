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

        // Check subscription for premium feature access
        const hasAccess = await canAccessFeature(user.id, 'cover_letter');
        if (!hasAccess) {
            return NextResponse.json({ error: 'Upgrade to Premium to access Cover Letter Generator' }, { status: 403 });
        }

        const { resumeId, jobTitle, companyName, jobDescription } = await req.json();

        if (!resumeId || !jobTitle || !companyName || !jobDescription) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch resume data
        const resume = await prisma.resume.findUnique({
            where: { id: resumeId, userId: user.id },
        });

        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        const resumeData = JSON.parse(resume.data);

        // Construct prompt
        const prompt = `
            You are an expert career coach and professional resume writer.
            Write a compelling and professional cover letter for the following job application.
            
            **Candidate Details:**
            Name: ${user.name}
            Email: ${user.email}
            Skills: ${resumeData.skills?.join(', ') || 'Not specified'}
            Experience: ${JSON.stringify(resumeData.experience || [])}
            
            **Job Details:**
            Role: ${jobTitle}
            Company: ${companyName}
            Job Description: ${jobDescription}
            
            **Instructions:**
            1. Use a professional and enthusiastic tone.
            2. Highlight relevant skills and experiences that match the job description.
            3. Keep it concise (3-4 paragraphs).
            4. Do not include placeholders like "[Your Name]" - use the provided name.
            5. Return ONLY the body of the cover letter, no header/footer addresses unless standard format.
        `;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Save to database
        const coverLetter = await prisma.coverLetter.create({
            data: {
                userId: user.id,
                resumeId,
                jobTitle,
                companyName,
                jobDescription,
                content: text,
            },
        });

        return NextResponse.json({ coverLetter });

    } catch (error) {
        console.error('Cover Letter Generation Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate cover letter' }, { status: 500 });
    }
}
