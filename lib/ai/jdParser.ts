import { ParsedJobDescription } from '../types';
import { extractKeywords, extractSkills } from './keywordExtractor';

export function parseJobDescription(jdText: string): ParsedJobDescription {
    const lowerText = jdText.toLowerCase();

    // Extract title (usually in first few lines)
    const lines = jdText.split('\n').filter(line => line.trim());
    const title = lines[0] || 'Job Position';

    // Extract required skills
    const requiredSkills = extractRequiredSkills(jdText);

    // Extract preferred skills
    const preferredSkills = extractPreferredSkills(jdText);

    // Extract experience level
    const experienceLevel = extractExperienceLevel(jdText);

    // Extract keywords
    const keywords = extractKeywords(jdText);

    // Extract tools/technologies
    const tools = extractSkills(jdText);

    // Extract education requirements
    const education = extractEducation(jdText);

    return {
        title,
        requiredSkills,
        preferredSkills,
        experienceLevel,
        keywords,
        tools,
        education,
    };
}

function extractRequiredSkills(text: string): string[] {
    const skills: string[] = [];

    // Look for "required" or "must have" sections
    const requiredSection = text.match(/(?:required|must have|requirements)[:\s]+(.*?)(?=\n\n|preferred|nice to have|$)/is);

    if (requiredSection) {
        const sectionText = requiredSection[1];
        skills.push(...extractSkills(sectionText));
    }

    // Also extract from general text
    skills.push(...extractSkills(text));

    return [...new Set(skills)].slice(0, 15);
}

function extractPreferredSkills(text: string): string[] {
    const skills: string[] = [];

    // Look for "preferred" or "nice to have" sections
    const preferredSection = text.match(/(?:preferred|nice to have|bonus)[:\s]+(.*?)(?=\n\n|$)/is);

    if (preferredSection) {
        const sectionText = preferredSection[1];
        skills.push(...extractSkills(sectionText));
    }

    return [...new Set(skills)].slice(0, 10);
}

function extractExperienceLevel(text: string): string {
    const lowerText = text.toLowerCase();

    // Look for experience patterns
    const patterns = [
        /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
        /entry[\s-]level/i,
        /junior/i,
        /mid[\s-]level/i,
        /senior/i,
        /lead/i,
        /principal/i,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return match[0];
        }
    }

    return 'Not specified';
}

function extractEducation(text: string): string[] {
    const education: string[] = [];
    const lowerText = text.toLowerCase();

    const degrees = [
        'bachelor',
        'master',
        'phd',
        'doctorate',
        'associate',
        'diploma',
        'degree',
    ];

    degrees.forEach(degree => {
        if (lowerText.includes(degree)) {
            education.push(degree);
        }
    });

    return [...new Set(education)];
}
