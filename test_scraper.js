"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleJobs_1 = require("./lib/scraper/googleJobs");
async function main() {
    console.log('Starting scraper test...');
    const jobs = await (0, googleJobs_1.scrapeGoogleJobs)('Software Engineer', 'Bangalore');
    console.log(`Found ${jobs.length} jobs:`);
    console.log(JSON.stringify(jobs, null, 2));
}
main().catch(console.error);
