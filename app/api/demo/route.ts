import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Create demo user if doesn't exist
async function ensureDemoUser() {
    const demoEmail = 'demo@visish.com';

    let demoUser = await prisma.user.findUnique({
        where: { email: demoEmail }
    });

    if (!demoUser) {
        const hashedPassword = await hash('demo123', 12);
        demoUser = await prisma.user.create({
            data: {
                email: demoEmail,
                password: hashedPassword,
                name: 'Demo User',
                role: 'user',
                currentRole: 'Software Developer',
                targetRole: 'Senior Software Engineer',
                experienceLevel: 'intermediate'
            }
        });

        // Create a sample resume for demo user
        await prisma.resume.create({
            data: {
                userId: demoUser.id,
                title: 'My Professional Resume',
                templateType: 'modern',
                colorTheme: 'purple',
                fontFamily: 'sans',
                data: JSON.stringify({
                    personalInfo: {
                        fullName: 'Demo User',
                        email: 'demo@visish.com',
                        phone: '+91 98765 43210',
                        location: 'Mumbai, India',
                        linkedin: 'linkedin.com/in/demouser',
                        portfolio: 'demouser.com'
                    },
                    summary: 'Experienced software developer with 3+ years of expertise in building scalable web applications. Passionate about creating user-friendly solutions and staying updated with latest technologies.',
                    experience: [
                        {
                            company: 'Tech Solutions Pvt Ltd',
                            position: 'Software Developer',
                            location: 'Mumbai, India',
                            startDate: '2021-06',
                            endDate: 'Present',
                            description: 'Developed and maintained web applications using React, Node.js, and PostgreSQL. Improved application performance by 40% through code optimization.'
                        }
                    ],
                    education: [
                        {
                            institution: 'Mumbai University',
                            degree: 'Bachelor of Technology',
                            field: 'Computer Science',
                            startDate: '2017',
                            endDate: '2021',
                            gpa: '8.5/10'
                        }
                    ],
                    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Git'],
                    projects: [
                        {
                            name: 'E-commerce Platform',
                            description: 'Built a full-stack e-commerce platform with payment integration',
                            technologies: ['React', 'Node.js', 'MongoDB'],
                            link: 'github.com/demo/ecommerce'
                        }
                    ]
                })
            }
        });
    }

    return demoUser;
}

export async function POST(req: NextRequest) {
    try {
        const demoUser = await ensureDemoUser();

        return NextResponse.json({
            success: true,
            credentials: {
                email: 'demo@visish.com',
                password: 'demo123'
            },
            message: 'Demo account ready. Use these credentials to login.'
        });
    } catch (error) {
        console.error('Demo setup error:', error);
        return NextResponse.json(
            { error: 'Failed to setup demo account' },
            { status: 500 }
        );
    }
}
