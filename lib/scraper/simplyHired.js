"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeSimplyHired = scrapeSimplyHired;
const puppeteer_1 = __importDefault(require("puppeteer"));
async function scrapeSimplyHired(query, location) {
    let browser;
    try {
        browser = await puppeteer_1.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });
        // Construct URL
        const baseUrl = 'https://www.simplyhired.co.in/search';
        const url = `${baseUrl}?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
        console.log(`Scraping SimplyHired: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        const title = await page.title();
        console.log(`Page Title: ${title}`);
        const content = await page.content();
        console.log(`Page Content Length: ${content.length}`);
        // Wait for job list
        try {
            await page.waitForSelector('#job-list', { timeout: 5000 });
        }
        catch (e) {
            console.log('Timeout waiting for SimplyHired #job-list');
        }
        // Extract jobs
        const jobs = await page.evaluate(() => {
            const results = [];
            // Try to find the main list
            const list = document.querySelector('#job-list');
            if (!list)
                return [];
            const cards = list.querySelectorAll('li');
            cards.forEach((card) => {
                try {
                    // Title is usually in an h3
                    const titleEl = card.querySelector('h3 a') || card.querySelector('a.SerpJob-link');
                    const companyEl = card.querySelector('span[data-testid="companyName"]');
                    const locationEl = card.querySelector('span[data-testid="searchSerpJobLocation"]');
                    const snippetEl = card.querySelector('p.jobposting-snippet');
                    const title = titleEl?.textContent?.trim() || '';
                    const company = companyEl?.textContent?.trim() || 'Unknown Company';
                    const location = locationEl?.textContent?.trim() || '';
                    const description = snippetEl?.textContent?.trim() || '';
                    let applyUrl = titleEl?.href || '';
                    if (applyUrl && !applyUrl.startsWith('http')) {
                        applyUrl = 'https://www.simplyhired.co.in' + applyUrl;
                    }
                    if (title) {
                        results.push({
                            title,
                            company,
                            location,
                            postedAt: 'Recently',
                            platform: 'SimplyHired',
                            applyUrl,
                            description
                        });
                    }
                }
                catch (e) { }
            });
            return results.slice(0, 15);
        });
        if (jobs.length === 0) {
            console.log('SimplyHired returned 0 jobs');
            return getMockJobs(query, location);
        }
        return jobs;
    }
    catch (error) {
        console.error('SimplyHired scraping error:', error);
        return getMockJobs(query, location);
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
}
function getMockJobs(query, location) {
    return [
        {
            title: `${query} (SimplyHired Fallback)`,
            company: 'Tech Corp',
            location: location,
            postedAt: 'Today',
            platform: 'SimplyHired',
            applyUrl: 'https://www.simplyhired.co.in',
            description: `Fallback data. We tried to scrape SimplyHired for ${query} but were blocked.`
        },
        {
            title: `Senior ${query}`,
            company: 'Innovate Ltd',
            location: location,
            postedAt: 'Yesterday',
            platform: 'SimplyHired',
            applyUrl: 'https://www.simplyhired.co.in',
            description: 'Great opportunity.'
        }
    ];
}
