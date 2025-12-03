"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jobSearch_1 = require("./lib/services/jobSearch");
async function main() {
    const queries = ['Software Engineer', 'Developer', 'React', 'Manager'];
    for (const query of queries) {
        console.log(`\nTesting query: "${query}"`);
        const jobs = await (0, jobSearch_1.searchJobs)(query, 'Remote');
        console.log(`Found ${jobs.length} jobs`);
        if (jobs.length > 0) {
            console.log('First job:', jobs[0].title, 'at', jobs[0].company);
        }
    }
}
main().catch(console.error);
