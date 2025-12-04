import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { model } from '@/lib/ai/gemini';

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

        const { interviewId, answers } = await req.json(); // answers is an array of strings

        if (!interviewId || !answers || !Array.isArray(answers)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const interview = await prisma.interviewSession.findUnique({
            where: { id: interviewId, userId: user.id },
        });

        if (!interview) {
            return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
        }

        const questions = JSON.parse(interview.questions);

        const prompt = `
            You are an Expert Hiring Manager.
            Evaluate the candidate's performance in the following interview for the role of "${interview.jobTitle}".
            
            Job Description: ${interview.jobDescription || 'Not provided'}
            
            **Interview Transcript:**
            ${questions.map((q: string, i: number) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || 'No answer provided'}`).join('\n\n')}
            
            **Instructions:**
            1. Analyze the answers for technical accuracy, clarity, and relevance.
            2. Provide a "Hiring Recommendation" (Strong Hire, Hire, Weak Hire, No Hire).
            3. Assign a "Score" from 0 to 100.
            4. For EACH question, provide "Feedback" and a "Better Answer" example.
            
            **Output Format (JSON ONLY):**
            {
                "score": number,
                "recommendation": string,
                "feedback": [
                    {
                        "question": string,
                        "userAnswer": string,
                        "feedback": string,
                        "betterAnswer": string
                    }
                ]
            }
            Do not include markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(text);

        // Update session
        await prisma.interviewSession.update({
            where: { id: interviewId },
            data: {
                answers: JSON.stringify(answers),
                feedback: JSON.stringify(analysis.feedback),
                score: analysis.score,
                recommendation: analysis.recommendation,
                status: 'completed',
            },
        });

        return NextResponse.json({ analysis });

    } catch (error) {
        console.error('Interview Feedback Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate feedback' }, { status: 500 });
    }
}
