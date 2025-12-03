import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking users in database...');
    const users = await prisma.user.findMany({
        select: { email: true, role: true, id: true }
    });
    console.log('Found users:', users);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
