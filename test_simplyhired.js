"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simplyHired_1 = require("./lib/scraper/simplyHired");
async function main() {
    console.log('Starting SimplyHired scraper test...');
    const jobs = await (0, simplyHired_1.scrapeSimplyHired)('Software Engineer', 'Bangalore');
    console.log(`Found ${jobs.length} jobs:`);
    console.log(JSON.stringify(jobs, null, 2));
}
main().catch(console.error);
