"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWWRJobs = fetchWWRJobs;
async function fetchWWRJobs(query) {
    try {
        console.log(`Fetching WeWorkRemotely jobs...`);
        // WWR has category specific feeds. We'll use the "Programming" one as default for tech roles,
        // or "All" if we can find it. For now, using Programming + Design + DevOps feeds is best, 
        // but let's start with the main Programming one.
        const url = 'https://weworkremotely.com/categories/remote-programming-jobs.rss';
        const response = await fetch(url);
        if (!response.ok)
            throw new Error('Failed to fetch WWR RSS');
        const xml = await response.text();
        // Simple Regex Parser for RSS items
        const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
        const jobs = [];
        const lowerQuery = query.toLowerCase();
        for (const item of items) {
            const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
            const linkMatch = item.match(/<link>(.*?)<\/link>/);
            const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/);
            const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
            const titleRaw = titleMatch ? titleMatch[1] : '';
            // WWR titles are often "Company: Job Title"
            const [company, title] = titleRaw.includes(':') ? titleRaw.split(':').map(s => s.trim()) : ['WeWorkRemotely', titleRaw];
            const link = linkMatch ? linkMatch[1] : '';
            const description = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '';
            const postedAt = dateMatch ? new Date(dateMatch[1]).toLocaleDateString() : 'Recently';
            // Filter by query
            if (title.toLowerCase().includes(lowerQuery) || description.toLowerCase().includes(lowerQuery)) {
                jobs.push({
                    title,
                    company,
                    location: 'Remote',
                    postedAt,
                    platform: 'WeWorkRemotely',
                    applyUrl: link,
                    description
                });
            }
        }
        return jobs.slice(0, 15);
    }
    catch (error) {
        console.error('WWR fetch error:', error);
        return [];
    }
}
