import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create demo user
    const demoPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@visish.com' },
        update: {},
        create: {
            email: 'demo@visish.com',
            name: 'Demo User',
            password: demoPassword,
            role: 'user',
            currentRole: 'Software Developer',
            targetRole: 'Senior Software Engineer',
            experienceLevel: 'intermediate',
        },
    });

    console.log('✅ Created demo user:', demoUser.email);

    // Create demo subscription
    const demoSubscription = await prisma.subscription.upsert({
        where: { userId: demoUser.id },
        update: {},
        create: {
            userId: demoUser.id,
            plan: 'pro',
            status: 'active',
            billingCycle: 'monthly',
            amount: 999,
            currency: 'INR',
            downloadsLimit: 0, // unlimited
            analysesLimit: 0, // unlimited
        },
    });

    console.log('✅ Created demo subscription');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@visish.com' },
        update: {},
        create: {
            email: 'admin@visish.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'admin',
        },
    });

    console.log('✅ Created admin user:', adminUser.email);

    // Create admin subscription
    await prisma.subscription.upsert({
        where: { userId: adminUser.id },
        update: {},
        create: {
            userId: adminUser.id,
            plan: 'premium',
            status: 'active',
            billingCycle: 'yearly',
            amount: 9999,
            currency: 'INR',
            downloadsLimit: 0,
            analysesLimit: 0,
        },
    });

    console.log('✅ Created admin subscription');

    // Create sample resume for demo user
    const sampleResumeData = {
        personalInfo: {
            fullName: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+91 98765 43210',
            location: 'Bangalore, India',
            linkedin: 'linkedin.com/in/johndoe',
            github: 'github.com/johndoe',
        },
        summary: 'Experienced software developer with 5+ years in full-stack development. Passionate about building scalable web applications and solving complex problems.',
        experience: [
            {
                id: '1',
                company: 'Tech Solutions Inc.',
                position: 'Senior Software Developer',
                location: 'Bangalore, India',
                startDate: '2021-01',
                endDate: 'Present',
                current: true,
                description: 'Leading development of microservices architecture. Mentoring junior developers and conducting code reviews.',
                highlights: [
                    'Reduced API response time by 40% through optimization',
                    'Led migration from monolith to microservices',
                    'Implemented CI/CD pipeline reducing deployment time by 60%',
                ],
            },
            {
                id: '2',
                company: 'StartupXYZ',
                position: 'Full Stack Developer',
                location: 'Mumbai, India',
                startDate: '2019-06',
                endDate: '2020-12',
                current: false,
                description: 'Developed and maintained web applications using React and Node.js.',
                highlights: [
                    'Built customer dashboard serving 10,000+ users',
                    'Implemented real-time notifications using WebSockets',
                    'Improved test coverage from 40% to 85%',
                ],
            },
        ],
        education: [
            {
                id: '1',
                institution: 'Indian Institute of Technology',
                degree: 'Bachelor of Technology',
                field: 'Computer Science',
                location: 'Delhi, India',
                startDate: '2015-08',
                endDate: '2019-05',
                gpa: '8.5/10',
            },
        ],
        skills: [
            { id: '1', name: 'JavaScript', category: 'Programming Languages' },
            { id: '2', name: 'TypeScript', category: 'Programming Languages' },
            { id: '3', name: 'Python', category: 'Programming Languages' },
            { id: '4', name: 'React', category: 'Frontend' },
            { id: '5', name: 'Node.js', category: 'Backend' },
            { id: '6', name: 'PostgreSQL', category: 'Databases' },
            { id: '7', name: 'MongoDB', category: 'Databases' },
            { id: '8', name: 'Docker', category: 'DevOps' },
            { id: '9', name: 'AWS', category: 'Cloud' },
            { id: '10', name: 'Git', category: 'Tools' },
        ],
        projects: [
            {
                id: '1',
                name: 'E-commerce Platform',
                description: 'Built a full-stack e-commerce platform with payment integration',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                link: 'github.com/johndoe/ecommerce',
            },
        ],
        certifications: [
            {
                id: '1',
                name: 'AWS Certified Developer',
                issuer: 'Amazon Web Services',
                date: '2022-06',
            },
        ],
    };

    const demoResume = await prisma.resume.create({
        data: {
            userId: demoUser.id,
            title: 'Software Developer Resume',
            templateType: 'modern',
            colorTheme: 'blue',
            fontFamily: 'sans',
            data: JSON.stringify(sampleResumeData),
        },
    });

    console.log('✅ Created sample resume for demo user');

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📝 Login credentials:');
    console.log('Demo User: demo@visish.com / demo123');
    console.log('Admin User: admin@visish.com / admin123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
