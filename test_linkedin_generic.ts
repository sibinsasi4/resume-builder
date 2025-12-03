import { scrapeGoogleJobs } from './lib/scraper/googleJobs';

async function main() {
    // Test a different category to prove it works generally
    const query = 'Marketing Manager';
    const location = 'India';

    console.log(`Testing LinkedIn Scraper for: "${query}" in "${location}"`);

    const jobs = await scrapeGoogleJobs(query, location);

    console.log(`Found ${jobs.length} jobs`);
    jobs.forEach(job => {
        console.log(`- ${job.title} at ${job.company} (${job.location}) [${job.platform}]`);
        console.log(`  Link: ${job.applyUrl}`);
    });
}

main().catch(console.error);
