import { prisma } from './lib/prisma';

async function checkAdminResume() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'admin@visish.com' }
        });

        if (!user) {
            console.log('User admin@visish.com not found');
            return;
        }

        const latestResume = await prisma.resume.findFirst({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
        });

        if (!latestResume) {
            console.log('No resume found for admin');
            return;
        }

        console.log('Resume Title:', latestResume.title);

        let query = latestResume.title;
        try {
            const resumeData = JSON.parse(latestResume.data);
            const isGenericTitle = /resume|untitled|cv|profile/i.test(query);

            if (isGenericTitle) {
                console.log('Generic title detected.');
                if (resumeData.experience && resumeData.experience.length > 0) {
                    query = resumeData.experience[0].title || query;
                    console.log('Using experience title:', query);
                } else {
                    console.log('No experience found, using title.');
                }
            }
        } catch (e) {
            console.log('Error parsing resume data');
        }

        console.log('Final Search Query:', query);

    } catch (e) {
        console.error(e);
    }
}

checkAdminResume();
