"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchJobs = searchJobs;
// Mock data for demonstration
const MOCK_JOBS = [
    {
        id: '1',
        title: 'Junior Software Engineer',
        company: 'TechCorp Solutions',
        location: 'Bangalore, India',
        type: 'Full-time',
        salary: '₹6L - ₹12L',
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        applyUrl: 'https://linkedin.com/jobs',
        description: 'Great opportunity for fresh graduates to start their career in software development. Knowledge of React is a plus.',
        source: 'LinkedIn',
        isFresher: true
    },
    {
        id: '2',
        title: 'Product Management Intern',
        company: 'InnovateX',
        location: 'Remote',
        type: 'Internship',
        salary: '₹20k/month',
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        applyUrl: 'https://indeed.com',
        description: 'Learn product management from industry experts. Open to final year students and fresh graduates.',
        source: 'Indeed',
        isFresher: true
    },
    {
        id: '3',
        title: 'Senior Data Scientist',
        company: 'DataFlow Systems',
        location: 'Hyderabad, India',
        type: 'Full-time',
        salary: '₹25L - ₹40L',
        postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        applyUrl: 'https://naukri.com',
        description: 'Looking for a Data Scientist with 5+ years of experience in Python, ML, and AI.',
        source: 'Naukri',
        isFresher: false
    },
    {
        id: '4',
        title: 'Frontend Developer',
        company: 'Creative Studio',
        location: 'Mumbai, India',
        type: 'Contract',
        salary: '₹10L - ₹18L',
        postedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        applyUrl: 'https://glassdoor.com',
        description: 'Need a skilled Frontend Developer to build responsive web interfaces. 2-3 years experience required.',
        source: 'Glassdoor',
        isFresher: false
    },
    {
        id: '5',
        title: 'Graduate Trainee Engineer',
        company: 'ServerLogic',
        location: 'Pune, India',
        type: 'Full-time',
        salary: '₹4L - ₹6L',
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        applyUrl: 'https://foundit.in',
        description: 'Hiring freshers for our engineering training program. CS/IT background preferred.',
        source: 'FoundIt',
        isFresher: true
    },
    {
        id: '6',
        title: 'UX Designer',
        company: 'DesignFirst',
        location: 'Bangalore, India',
        type: 'Full-time',
        salary: '₹12L - ₹22L',
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        applyUrl: 'https://linkedin.com',
        description: 'Create intuitive and beautiful user experiences for our global clients.',
        source: 'LinkedIn',
        isFresher: false
    },
    {
        id: '7',
        title: 'Associate Marketing Manager',
        company: 'GrowthHackers',
        location: 'Delhi, India',
        type: 'Full-time',
        salary: '₹5L - ₹8L',
        postedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        applyUrl: 'https://indeed.com',
        description: 'Entry level marketing role. Good communication skills required.',
        source: 'Indeed',
        isFresher: true
    },
    {
        id: '8',
        title: 'Operations Manager',
        company: 'LogisticsPro',
        location: 'Mumbai, India',
        type: 'Full-time',
        salary: '₹15L - ₹25L',
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        applyUrl: 'https://linkedin.com',
        description: 'Oversee daily operations and improve efficiency. Experience in logistics preferred.',
        source: 'LinkedIn',
        isFresher: false
    },
    {
        id: '9',
        title: 'HR Specialist',
        company: 'PeopleFirst',
        location: 'Bangalore, India',
        type: 'Full-time',
        salary: '₹8L - ₹12L',
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        applyUrl: 'https://naukri.com',
        description: 'Handle recruitment and employee relations. MBA in HR required.',
        source: 'Naukri',
        isFresher: true
    },
    {
        id: '10',
        title: 'Sales Executive',
        company: 'SalesForceX',
        location: 'Delhi, India',
        type: 'Full-time',
        salary: '₹4L - ₹7L',
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        applyUrl: 'https://foundit.in',
        description: 'Drive sales and acquire new customers. Freshers with good communication skills welcome.',
        source: 'FoundIt',
        isFresher: true
    }
];
const remoteOk_1 = require("../scraper/remoteOk");
const weworkremotely_1 = require("../scraper/weworkremotely");
const jooble_1 = require("../scraper/jooble");
const googleJobs_1 = require("../scraper/googleJobs");
async function searchJobs(query, location = '') {
    try {
        console.log(`Searching for jobs: ${query} in ${location}`);
        // Run fetches in parallel
        const [joobleJobs, remoteOkJobs, wwrJobs, linkedInJobs] = await Promise.all([
            (0, jooble_1.fetchJoobleJobs)(query, location),
            (0, remoteOk_1.fetchRemoteOkJobs)(query),
            (0, weworkremotely_1.fetchWWRJobs)(query),
            (0, googleJobs_1.scrapeGoogleJobs)(query, location)
        ]);
        console.log(`Jooble: ${joobleJobs.length}, RemoteOK: ${remoteOkJobs.length}, WWR: ${wwrJobs.length}, LinkedIn(via Google): ${linkedInJobs.length}`);
        // Prioritize Jooble -> LinkedIn -> RemoteOK -> WWR
        const allJobs = [...joobleJobs, ...linkedInJobs, ...remoteOkJobs, ...wwrJobs];
        if (allJobs.length > 0) {
            return allJobs.map((job, index) => ({
                id: `job-${index}`,
                title: job.title,
                company: job.company,
                location: job.location,
                type: 'Full-time',
                salary: job.salary || '',
                postedAt: new Date(job.postedAt),
                applyUrl: job.applyUrl,
                description: job.description,
                source: job.platform,
                isFresher: job.title.toLowerCase().includes('junior') || job.title.toLowerCase().includes('intern')
            }));
        }
        else {
            // Fallback: If no specific matches, fetch generic "dev" jobs
            console.log('No specific matches found, fetching generic jobs...');
            const [genericJooble, genericRemote, genericWWR] = await Promise.all([
                (0, jooble_1.fetchJoobleJobs)('developer', location),
                (0, remoteOk_1.fetchRemoteOkJobs)('dev'),
                (0, weworkremotely_1.fetchWWRJobs)('')
            ]);
            const genericJobs = [...genericJooble, ...genericRemote, ...genericWWR];
            return genericJobs.map((job, index) => ({
                id: `fallback-job-${index}`,
                title: job.title,
                company: job.company,
                location: job.location,
                type: 'Full-time',
                salary: job.salary || '',
                postedAt: new Date(job.postedAt),
                applyUrl: job.applyUrl,
                description: job.description,
                source: job.platform,
                isFresher: job.title.toLowerCase().includes('junior') || job.title.toLowerCase().includes('intern')
            }));
        }
    }
    catch (e) {
        console.error('Job search failed', e);
    }
    return [];
}
