"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJoobleJobs = fetchJoobleJobs;
const JOOBLE_API_KEY = 'f7f593b7-3803-495d-a012-1bcf08a73ea5';
const JOOBLE_API_URL = `https://jooble.org/api/${JOOBLE_API_KEY}`;
async function fetchJoobleJobs(keywords, location = '') {
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
        const data = await response.json();
        if (!data.jobs)
            return [];
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
    }
    catch (error) {
        console.error('Jooble fetch error:', error);
        return [];
    }
}
