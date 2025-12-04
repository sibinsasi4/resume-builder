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
        const hasAccess = await canAccessFeature(user.id, 'linkedin_optimization');
        // Note: We need to ensure 'linkedin_optimization' is in the features list for the user's plan
        // For now, we'll assume Pro/Premium have it.

        if (!hasAccess) {
            // Fallback check if strict feature flags aren't fully deployed yet
            const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
            if (subscription?.plan !== 'premium' && subscription?.plan !== 'pro') {
                return NextResponse.json({ error: 'Upgrade to Premium to access LinkedIn Optimizer' }, { status: 403 });
            }
        }

        const { resumeId } = await req.json();

        if (!resumeId) {
            return NextResponse.json({ error: 'Resume ID required' }, { status: 400 });
        }

        const resume = await prisma.resume.findUnique({
            where: { id: resumeId, userId: user.id },
        });

        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        const resumeData = JSON.parse(resume.data);

        const prompt = `
            You are a LinkedIn Profile Expert and Personal Branding Coach.
            Analyze the following resume data and generate optimized content for a LinkedIn profile.
            
            **Candidate Profile:**
            Name: ${user.name}
            Current Role: ${resumeData.personalInfo?.jobTitle || 'Not specified'}
            Skills: ${resumeData.skills?.join(', ') || 'Not specified'}
            Experience: ${JSON.stringify(resumeData.experience || [])}
            Summary: ${resumeData.summary || ''}
            
            **Generate the following sections in JSON format:**
            1. **Headline**: A catchy, SEO-friendly headline (max 220 chars).
            2. **About**: A compelling "About" section (first person, engaging, max 2000 chars).
            3. **ExperienceEnhancements**: Suggestions to improve the descriptions of their top 3 roles for LinkedIn (more conversational, achievement-focused).
            4. **Keywords**: Top 10 keywords to include for SEO.
            
            **Output Format:**
            JSON object with keys: headline, about, experienceEnhancements (array of strings), keywords (array of strings).
            Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const optimization = JSON.parse(text);

        return NextResponse.json({ optimization });

    } catch (error) {
        console.error('LinkedIn Optimization Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate optimization' }, { status: 500 });
    }
}
