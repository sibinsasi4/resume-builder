import { fetchJoobleJobs } from './lib/scraper/jooble';

async function main() {
    const queries = ['Operation Manager'];

    for (const query of queries) {
        console.log(`\nTesting Jooble for: "${query}" in India`);
        const jobs = await fetchJoobleJobs(query, 'India');
        console.log(`Found ${jobs.length} jobs`);
        if (jobs.length > 0) {
            console.log('First job:', jobs[0].title, 'at', jobs[0].company);
        }
    }
}

main().catch(console.error);
