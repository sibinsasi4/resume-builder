import { scrapeGoogleJobs } from './lib/scraper/googleJobs';

async function main() {
    const query = 'Sales Executive';
    const location = 'India';

    console.log(`Testing LinkedIn Scraper for: "${query}" in "${location}"`);

    // This function internally handles the site:linkedin.com logic if 'linkedin' is in query, 
    // OR we can force it by passing a query that triggers it? 
    // Actually the current logic in googleJobs.ts checks: if (query.toLowerCase().includes('linkedin'))
    // So I should pass 'Sales Executive linkedin' to trigger the specific path, 
    // OR relying on the default path which does `site:linkedin.com/jobs ${query} ${location}`

    // Let's try the default path first as that's what the app does
    const jobs = await scrapeGoogleJobs(query, location);

    console.log(`Found ${jobs.length} jobs`);
    jobs.forEach(job => {
        console.log(`- ${job.title} at ${job.company} (${job.location}) [${job.platform}]`);
        console.log(`  Link: ${job.applyUrl}`);
    });
}

main().catch(console.error);
