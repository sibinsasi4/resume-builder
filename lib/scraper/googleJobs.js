"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeGoogleJobs = scrapeGoogleJobs;
const puppeteer_1 = __importDefault(require("puppeteer"));
async function scrapeGoogleJobs(query, location) {
    let browser;
    try {
        browser = await puppeteer_1.default.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--window-size=1280,800'
            ],
            ignoreDefaultArgs: ['--enable-automation']
        });
        const page = await browser.newPage();
        // Set a realistic user agent to avoid immediate blocking
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        // Construct search URL
        // If query implies LinkedIn, use site:linkedin.com
        let searchQuery = `${query} jobs in ${location}`;
        if (query.toLowerCase().includes('linkedin')) {
            searchQuery = `site:linkedin.com/jobs ${query.replace('linkedin', '')} in ${location}`;
        }
        else {
            // Default to broad search including LinkedIn
            searchQuery = `site:linkedin.com/jobs ${query} ${location}`;
        }
        const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        console.log(`Scraping URL: ${url}`);
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        const pageTitle = await page.title();
        console.log(`Page Title: ${pageTitle}`);
        // Check for "Before you continue" consent page
        if (pageTitle.includes('Before you continue') || pageTitle.includes('Consent')) {
            console.log('Hit consent page, trying to accept...');
            try {
                // Click "Reject all" or "Accept all" - selectors vary
                const buttons = await page.$$('button');
                for (const button of buttons) {
                    const text = await page.evaluate(el => el.textContent, button);
                    if (text?.includes('Reject all') || text?.includes('Accept all')) {
                        await button.click();
                        await page.waitForNavigation({ waitUntil: 'networkidle2' });
                        break;
                    }
                }
            }
            catch (e) {
                console.log('Failed to handle consent page');
            }
        }
        // Wait for results
        try {
            // Wait for the main results container
            await page.waitForSelector('#rso', { timeout: 5000 });
        }
        catch (e) {
            console.log('Timeout waiting for #rso');
        }
        // Extract jobs
        const jobs = await page.evaluate(() => {
            const results = [];
            // Find all anchors that look like LinkedIn job links
            // The debug HTML shows links like: https://in.linkedin.com/jobs/sales-executive-jobs
            const links = Array.from(document.querySelectorAll('a'));
            links.forEach(link => {
                const href = link.href;
                // STRICT CHECK: Must be a direct LinkedIn link, not a Google search result link
                // Google links are like: https://www.google.com/search?q=site:linkedin.com...
                // We want: https://in.linkedin.com/jobs/... or https://www.linkedin.com/jobs/...
                const isGoogleLink = href.includes('google.com') || href.startsWith('/search');
                const isLinkedIn = href.includes('linkedin.com/jobs') || href.includes('linkedin.com/in/');
                if (isLinkedIn && !isGoogleLink) {
                    // Try to find the title inside the link (h3)
                    const titleEl = link.querySelector('h3');
                    let title = titleEl ? titleEl.textContent || '' : link.textContent || '';
                    // Clean up title
                    // Example: "13000+ Sales Executive jobs in India" -> "Sales Executive"
                    // Example: "Sales Executive - Company Name - Location"
                    let company = 'LinkedIn';
                    let location = 'See details';
                    // Heuristic for "Collection" pages (e.g. "13000+ Sales Executive jobs in India")
                    if (title.match(/\d+\+? .* jobs in .*/i)) {
                        // It's a collection link, still useful!
                        company = 'Multiple Companies';
                        // Extract location if possible
                        const inIndex = title.lastIndexOf(' in ');
                        if (inIndex > -1) {
                            location = title.substring(inIndex + 4).trim();
                        }
                    }
                    // Heuristic for individual jobs "Title - Company - Location"
                    else if (title.includes('-')) {
                        const parts = title.split('-');
                        if (parts.length >= 2) {
                            title = parts[0].trim();
                            company = parts[1].trim();
                        }
                    }
                    // Avoid duplicates and empty titles
                    if (title && !results.some(r => r.applyUrl === href)) {
                        results.push({
                            title,
                            company,
                            location,
                            postedAt: 'Recently',
                            platform: 'LinkedIn',
                            applyUrl: href,
                            description: 'View this job on LinkedIn'
                        });
                    }
                }
            });
            return results.slice(0, 15);
        });
        if (jobs.length === 0) {
            console.log('Scraper found 0 jobs, returning fallback data');
            return getMockJobs(query, location);
        }
        return jobs;
    }
    catch (error) {
        console.error('Scraping error:', error);
        return [];
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
}
// Fallback mock data generator if scraping fails (for demo purposes)
function getMockJobs(query, location) {
    return [
        {
            title: `${query} (Scraped Fallback)`,
            company: 'Tech Giant Corp',
            location: location,
            postedAt: 'Just now',
            platform: 'Other',
            applyUrl: 'https://linkedin.com/jobs',
            description: `We are looking for a ${query} to join our team in ${location}. This is a fallback result because the live scraper was blocked.`
        },
        {
            title: `Senior ${query}`,
            company: 'Startup Inc',
            location: location,
            postedAt: '2 hours ago',
            platform: 'Other',
            applyUrl: 'https://indeed.com',
            description: `Exciting opportunity for a Senior ${query}. Apply now!`
        },
        {
            title: `Junior ${query}`,
            company: 'Global Systems',
            location: location,
            postedAt: '1 day ago',
            platform: 'Other',
            applyUrl: 'https://naukri.com',
            description: `Freshers welcome for this ${query} role.`
        }
    ];
}
