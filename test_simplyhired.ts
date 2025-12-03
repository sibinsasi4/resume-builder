import { scrapeSimplyHired } from './lib/scraper/simplyHired';

async function main() {
    console.log('Starting SimplyHired scraper test...');
    const jobs = await scrapeSimplyHired('Software Engineer', 'Bangalore');
    console.log(`Found ${jobs.length} jobs:`);
    console.log(JSON.stringify(jobs, null, 2));
}

main().catch(console.error);
