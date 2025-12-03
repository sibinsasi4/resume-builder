import { ScrapedJob } from './googleJobs';

const JOOBLE_API_KEY = 'f7f593b7-3803-495d-a012-1bcf08a73ea5';
const JOOBLE_API_URL = `https://jooble.org/api/${JOOBLE_API_KEY}`;

interface JoobleJob {
    title: string;
    location: string;
    snippet: string;
    salary: string;
    source: string;
    type: string;
    link: string;
    company: string;
    updated: string;
    id: string;
}

interface JoobleResponse {
    totalCount: number;
    jobs: JoobleJob[];
}

export async function fetchJoobleJobs(keywords: string, location: string = ''): Promise<ScrapedJob[]> {
    try {
        console.log(`Fetching Jooble jobs for: ${keywords} in ${location}`);

        const response = await fetch(JOOBLE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keywords,
                location
            })
        });

        if (!response.ok) {
            throw new Error(`Jooble API failed: ${response.statusText}`);
        }

        const data = await response.json() as JoobleResponse;

        if (!data.jobs) return [];

        return data.jobs.map(job => ({
            title: job.title,
            company: job.company || 'Unknown',
            location: job.location,
            postedAt: new Date(job.updated).toLocaleDateString(),
            platform: 'Jooble',
            applyUrl: job.link,
            description: job.snippet,
            salary: job.salary
        }));

    } catch (error) {
        console.error('Jooble fetch error:', error);
        return [];
    }
}
