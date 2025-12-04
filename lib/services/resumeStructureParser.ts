import { ResumeData, PersonalInfo, Experience, Education, Skill, Project } from '@/lib/types';

export function parseResumeStructure(text: string): ResumeData {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const fullText = text; // Keep full text for regex matching

    // 1. Extract Personal Info
    const personalInfo: PersonalInfo = {
        fullName: extractName(lines),
        email: extractEmail(fullText),
        phone: extractPhone(fullText),
        location: extractLocation(lines),
        website: extractLink(fullText, /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i, ['linkedin.com', 'github.com']),
        linkedin: extractLink(fullText, /linkedin\.com\/in\/[\w-]+/i),
        github: extractLink(fullText, /github\.com\/[\w-]+/i),
    };

    // 2. Split into Sections
    const sections = splitIntoSections(text);

    // 3. Parse Sections
    return {
        personalInfo,
        summary: sections.summary || '',
        experience: parseExperience(sections.experience),
        education: parseEducation(sections.education),
        skills: parseSkills(sections.skills),
        projects: parseProjects(sections.projects),
        certifications: [], // Hard to parse reliably without specific keywords
        achievements: [],
        languages: [],
        hobbies: [],
    };
}

// --- Helper Functions ---

function extractName(lines: string[]): string {
    // Heuristic: Name is usually the first non-empty line
    // Filter out common header words just in case
    const blacklist = ['resume', 'cv', 'curriculum vitae', 'page', 'summary', 'profile', 'experience', 'education', 'skills', 'projects', 'contact'];

    for (const line of lines.slice(0, 10)) { // Check first 10 lines
        const lower = line.toLowerCase();

        // Skip if:
        // 1. Contains blacklist word
        // 2. Ends with colon (likely a header)
        // 3. Is too long (> 40 chars)
        // 4. Is too short (< 3 chars)
        if (
            !blacklist.some(w => lower.includes(w)) &&
            !line.trim().endsWith(':') &&
            line.length < 40 &&
            line.length > 2
        ) {
            return line;
        }
    }
    return '';
}

// ... (email/phone/location/link functions unchanged) ...

function splitIntoSections(text: string): SectionMap {
    const sectionMap: SectionMap = {};

    // Keywords to identify section headers
    const keywords = {
        experience: ['experience', 'work history', 'employment', 'professional experience', 'work experience', 'career history', 'professional background', 'career summary'],
        education: ['education', 'academic background', 'qualifications', 'academic history', 'education & qualifications'],
        skills: ['skills', 'technical skills', 'competencies', 'technologies', 'core competencies', 'skills & expertise', 'technical proficiencies'],
        projects: ['projects', 'personal projects', 'key projects', 'academic projects'],
        summary: ['summary', 'profile', 'professional summary', 'about me', 'executive summary', 'objective']
    };

    const lines = text.split('\n');
    let currentSection: keyof SectionMap | 'unknown' = 'unknown';
    let buffer: string[] = [];

    for (const line of lines) {
        const lowerLine = line.toLowerCase().trim();

        // Skip empty lines if we haven't found a section yet (reduce noise)
        if (!lowerLine && currentSection === 'unknown') continue;

        let foundNewSection = false;

        // Check if this line is a header
        for (const [section, terms] of Object.entries(keywords)) {
            // Check for exact match or match with colon/symbols
            // e.g. "Experience" or "Experience:" or "--- Experience ---"
            if (terms.some(term => {
                const cleanLine = lowerLine.replace(/[:|\-•]/g, '').trim();
                return cleanLine === term;
            })) {
                // Found a header!
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
            } else {
                // If we haven't found a section yet, check if it looks like a summary
                // If it's a long line (paragraph) and not a contact info line, assume summary
                if (line.length > 100) {
                    // Implicit summary start
                    currentSection = 'summary';
                    buffer.push(line);
                }
            }
        }
    }

    if (currentSection !== 'unknown') {
        sectionMap[currentSection] = (sectionMap[currentSection] || '') + buffer.join('\n');
    }

    return sectionMap;
}

function parseSkills(text?: string): Skill[] {
    if (!text) return [];

    // Heuristic: Skills are often comma separated or bullet points
    // Let's just dump everything into one "Imported Skills" category for now
    // Splitting by comma or newline

    const items = text.split(/[,•\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 1 && s.length < 50); // Filter noise

    if (items.length === 0) return [];

    return [{
        id: 'imported-skill-1',
        category: 'Imported Skills',
        items: [...new Set(items)] // Dedupe
    }];
}

function parseExperience(text?: string): Experience[] {
    if (!text) return [];

    // This is hard. We'll create one big block for now if we can't parse perfectly.
    // Or try to split by date patterns?
    // Let's return a single "Imported Experience" entry with the full text in description
    // This encourages the user to edit it.

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

function parseEducation(text?: string): Education[] {
    if (!text) return [];

    return [{
        id: 'imported-edu-1',
        institution: 'Imported Education',
        degree: 'Please Edit',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        achievements: [text.trim()] // Education type uses achievements, not description
    }];
}

function parseProjects(text?: string): Project[] {
    if (!text) return [];

    return [{
        id: 'imported-proj-1',
        name: 'Imported Project',
        description: text.trim(),
        technologies: [],
        link: ''
    }];
}
