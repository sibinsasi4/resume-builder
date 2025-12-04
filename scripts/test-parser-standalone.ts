// Self-contained test script to verify parser logic

// --- Mock Types ---
interface ResumeData {
    personalInfo: any;
    summary?: string;
    experience: any[];
    education: any[];
    skills: any[];
    projects: any[];
    certifications: any[];
    achievements: any[];
    languages: any[];
    hobbies: any[];
}

// --- Parser Logic (Copied from lib/services/resumeStructureParser.ts) ---

function parseResumeStructure(text: string): ResumeData {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const fullText = text;

    const personalInfo = {
        fullName: extractName(lines),
        email: extractEmail(fullText),
        phone: extractPhone(fullText),
        location: extractLocation(lines),
        website: extractLink(fullText, /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i, ['linkedin.com', 'github.com']),
        linkedin: extractLink(fullText, /linkedin\.com\/in\/[\w-]+/i),
        github: extractLink(fullText, /github\.com\/[\w-]+/i),
    };

    const sections = splitIntoSections(text);

    return {
        personalInfo,
        summary: sections.summary || '',
        experience: parseExperience(sections.experience),
        education: parseEducation(sections.education),
        skills: parseSkills(sections.skills),
        projects: parseProjects(sections.projects),
        certifications: [],
        achievements: [],
        languages: [],
        hobbies: [],
    };
}

function extractName(lines: string[]): string {
    const blacklist = ['resume', 'cv', 'curriculum vitae', 'page'];
    for (const line of lines.slice(0, 5)) {
        if (!blacklist.some(w => line.toLowerCase().includes(w)) && line.length < 50) {
            return line;
        }
    }
    return '';
}

function extractEmail(text: string): string {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = text.match(emailRegex);
    return match ? match[0] : '';
}

function extractPhone(text: string): string {
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : '';
}

function extractLocation(lines: string[]): string {
    return '';
}

function extractLink(text: string, regex: RegExp, excludeDomains: string[] = []): string {
    const match = text.match(regex);
    if (match) {
        const url = match[0];
        if (excludeDomains.some(d => url.toLowerCase().includes(d))) return '';
        return url.startsWith('http') ? url : `https://${url}`;
    }
    return '';
}

interface SectionMap {
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string;
    projects?: string;
}

function splitIntoSections(text: string): SectionMap {
    const sectionMap: SectionMap = {};
    const keywords: any = {
        experience: ['experience', 'work history', 'employment', 'professional experience'],
        education: ['education', 'academic background', 'qualifications'],
        skills: ['skills', 'technical skills', 'competencies', 'technologies'],
        projects: ['projects', 'personal projects', 'key projects'],
        summary: ['summary', 'profile', 'professional summary', 'about me']
    };

    const lines = text.split('\n');
    let currentSection: keyof SectionMap | 'unknown' = 'unknown';
    let buffer: string[] = [];

    for (const line of lines) {
        const lowerLine = line.toLowerCase().trim();
        let foundNewSection = false;

        for (const [section, terms] of Object.entries(keywords)) {
            if ((terms as string[]).some(term => lowerLine === term || lowerLine === term + ':')) {
                if (currentSection !== 'unknown') {
                    sectionMap[currentSection] = (sectionMap[currentSection] || '') + buffer.join('\n');
                }
                currentSection = section as keyof SectionMap;
                buffer = [];
                foundNewSection = true;
                break;
            }
        }

        if (!foundNewSection) {
            if (currentSection !== 'unknown') {
                buffer.push(line);
            }
        }
    }

    if (currentSection !== 'unknown') {
        sectionMap[currentSection] = (sectionMap[currentSection] || '') + buffer.join('\n');
    }

    return sectionMap;
}

function parseSkills(text?: string): any[] {
    if (!text) return [];
    const items = text.split(/[,•\n]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 50);
    if (items.length === 0) return [];
    return [{ id: 'imported-skill-1', category: 'Imported Skills', items: [...new Set(items)] }];
}

function parseExperience(text?: string): any[] {
    if (!text) return [];
    return [{
        id: 'imported-exp-1',
        position: 'Imported Position',
        company: 'Please Edit',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: [text.trim()]
    }];
}

function parseEducation(text?: string): any[] {
    if (!text) return [];
    return [{
        id: 'imported-edu-1',
        institution: 'Imported Education',
        degree: 'Please Edit',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        achievements: [text.trim()]
    }];
}

function parseProjects(text?: string): any[] {
    if (!text) return [];
    return [{
        id: 'imported-proj-1',
        name: 'Imported Project',
        description: text.trim(),
        technologies: [],
        link: ''
    }];
}

// --- Test Execution ---

const sampleResume = `
John Doe
john.doe@example.com
(123) 456-7890
https://linkedin.com/in/johndoe

Professional Summary
Experienced software engineer with 5 years of experience in React and Node.js.

Experience
Senior Developer
Tech Corp
Jan 2020 - Present
Led a team of 5 developers. Built scalable APIs.

Junior Developer
Startup Inc
Jan 2018 - Dec 2019
Worked on frontend components.

Education
Bachelor of Science in Computer Science
University of Technology
2014 - 2018

Skills
JavaScript, TypeScript, React, Node.js, SQL, AWS
`;

console.log('Testing Resume Parser...');
const result = parseResumeStructure(sampleResume);

console.log('--- Result ---');
console.log(JSON.stringify(result, null, 2));

const errors: string[] = [];

if (result.personalInfo.fullName !== 'John Doe') errors.push('Name mismatch');
if (result.personalInfo.email !== 'john.doe@example.com') errors.push('Email mismatch');
if (result.personalInfo.phone !== '(123) 456-7890') errors.push('Phone mismatch');
if (result.personalInfo.linkedin !== 'https://linkedin.com/in/johndoe') errors.push('LinkedIn mismatch');

if (!result.summary?.includes('Experienced software engineer')) errors.push('Summary mismatch');

if (result.experience.length !== 1) errors.push('Experience count mismatch');
if (!result.experience[0].description[0].includes('Tech Corp')) errors.push('Experience content mismatch');

if (result.education.length !== 1) errors.push('Education count mismatch');
if (!result.education[0].achievements[0].includes('University of Technology')) errors.push('Education content mismatch');

if (result.skills.length !== 1) errors.push('Skills count mismatch');
if (!result.skills[0].items.includes('React')) errors.push('Skills content mismatch');

if (errors.length > 0) {
    console.error('❌ Verification Failed:', errors);
    process.exit(1);
} else {
    console.log('✅ Verification Passed!');
}
