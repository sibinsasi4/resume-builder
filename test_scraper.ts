import { scrapeGoogleJobs } from './lib/scraper/googleJobs';

async function main() {
    console.log('Starting scraper test...');
    const jobs = await scrapeGoogleJobs('Software Engineer', 'Bangalore');
    console.log(`Found ${jobs.length} jobs:`);
    console.log(JSON.stringify(jobs, null, 2));
}

main().catch(console.error);
