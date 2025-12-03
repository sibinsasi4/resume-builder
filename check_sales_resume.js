"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./lib/prisma");
async function checkSalesResume() {
    try {
        // Find resume with title containing "Sales"
        const resume = await prisma_1.prisma.resume.findFirst({
            where: {
                title: { contains: 'Sales' }
            },
            include: { user: true }
        });
        if (!resume) {
            console.log('No Sales resume found');
            return;
        }
        console.log('Resume Title:', resume.title);
        console.log('User:', resume.user.email);
        try {
            const data = JSON.parse(resume.data);
            console.log('Personal Info City:', data.personalInfo?.city);
            console.log('Personal Info Country:', data.personalInfo?.country);
        }
        catch (e) {
            console.log('Error parsing data');
        }
    }
    catch (e) {
        console.error(e);
    }
}
checkSalesResume();
