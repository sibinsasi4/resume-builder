import { ScrapedJob } from './googleJobs';

export async function fetchRemoteOkJobs(query: string): Promise<ScrapedJob[]> {
    try {
        console.log(`Fetching RemoteOK jobs for: ${query}`);
        const response = await fetch('https://remoteok.com/api');

        if (!response.ok) {
            throw new Error(`RemoteOK API failed: ${response.statusText}`);
        }

        const data = await response.json();

        // RemoteOK returns an array where the first item is metadata (legal), skip it.
        const jobs = data.slice(1);

        const lowerQuery = query.toLowerCase();

        // Filter and map
        const matchedJobs = jobs.filter((job: any) => {
            const text = (job.position + ' ' + job.description + ' ' + job.tags.join(' ')).toLowerCase();
            return text.includes(lowerQuery);
        }).map((job: any) => ({
            title: job.position,
            company: job.company,
            location: job.location || 'Remote',
            postedAt: new Date(job.date).toLocaleDateString(),
            platform: 'RemoteOK',
            applyUrl: job.apply_url,
            description: `Remote role at ${job.company}. Tags: ${job.tags.slice(0, 3).join(', ')}`
        }));

        return matchedJobs.slice(0, 15); // Limit to 15

    } catch (error) {
        console.error('RemoteOK fetch error:', error);
        return [];
    }
}
