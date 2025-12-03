"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jobSearch_1 = require("./lib/services/jobSearch");
async function main() {
    const query = 'Sales Executive';
    const location = 'India';
    console.log(`Calling searchJobs for: "${query}" in "${location}"`);
    const jobs = await (0, jobSearch_1.searchJobs)(query, location);
    console.log(`Total Jobs Returned: ${jobs.length}`);
    // Group by source
    const bySource = jobs.reduce((acc, job) => {
        acc[job.source] = (acc[job.source] || 0) + 1;
        return acc;
    }, {});
    console.log('Jobs by Source:', bySource);
    // List first 5 jobs
    console.log('First 5 Jobs:');
    jobs.slice(0, 5).forEach(job => {
        console.log(`- [${job.source}] ${job.title} @ ${job.company}`);
        console.log(`  Link: ${job.applyUrl}`);
    });
}
main().catch(console.error);
