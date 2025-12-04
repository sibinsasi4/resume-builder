import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@visish.com';
    console.log(`Checking for user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        console.log('✅ User found:');
        console.log(`ID: ${user.id}`);
        console.log(`Role: ${user.role}`);
        console.log(`Password Hash: ${user.password ? 'Present' : 'MISSING'}`);
    } else {
        console.log('❌ User NOT found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
