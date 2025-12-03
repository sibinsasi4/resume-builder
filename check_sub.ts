import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const email = 'sibinsasi4@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
        include: { subscription: true }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('User:', user.id, user.email, user.role);
    console.log('Subscription:', user.subscription);

    if (user.subscription) {
        const now = new Date();
        const end = user.subscription.currentPeriodEnd;
        console.log('Current Time:', now);
        console.log('Period End:', end);

        if (end) {
            console.log('Is Expired?', now > end);
        } else {
            console.log('Period End is null');
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
