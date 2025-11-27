import { ResumeData, ParsedJobDescription } from '../types';
import { extractSkills, calculateKeywordMatch } from './keywordExtractor';

export function calculateJobMatch(
    resumeData: ResumeData,
    resumeText: string,
    jobDescription: ParsedJobDescription
): {
    matchScore: number;
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
} {
    // 1. Skills Match (40% weight)
    const resumeSkills = extractSkills(resumeText);
    const requiredSkills = jobDescription.requiredSkills.map(s => s.toLowerCase());
    const preferredSkills = jobDescription.preferredSkills.map(s => s.toLowerCase());

    const requiredMatches = requiredSkills.filter(skill =>
        resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))
    );
    const preferredMatches = preferredSkills.filter(skill =>
        resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))
    );

    const skillsMatch = (
        (requiredMatches.length / Math.max(requiredSkills.length, 1)) * 70 +
        (preferredMatches.length / Math.max(preferredSkills.length, 1)) * 30
    );

    // 2. Experience Match (35% weight)
    const experienceYears = calculateExperienceYears(resumeData.experience);
    const requiredYears = extractYearsFromLevel(jobDescription.experienceLevel);

    let experienceMatch = 0;
    if (experienceYears >= requiredYears) {
        experienceMatch = 100;
    } else if (experienceYears >= requiredYears * 0.7) {
        experienceMatch = 80;
    } else if (experienceYears >= requiredYears * 0.5) {
        experienceMatch = 60;
    } else {
        experienceMatch = 40;
    }

    // 3. Education Match (25% weight)
    const educationMatch = calculateEducationMatch(
        resumeData.education,
        jobDescription.education
    );

    // Calculate overall match score
    const matchScore = (
        skillsMatch * 0.4 +
        experienceMatch * 0.35 +
        educationMatch * 0.25
    );

    return {
        matchScore: Math.round(matchScore),
        skillsMatch: Math.round(skillsMatch),
        experienceMatch: Math.round(experienceMatch),
        educationMatch: Math.round(educationMatch),
    };
}

function calculateExperienceYears(experience: any[]): number {
    if (!experience || !Array.isArray(experience)) return 0;

    let totalMonths = 0;

    experience.forEach(exp => {
        if (!exp.startDate) return;

        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : new Date(exp.endDate || new Date());
        const months = (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());
        totalMonths += Math.max(months, 0);
    });

    return totalMonths / 12;
}

function extractYearsFromLevel(level: string): number {
    const lowerLevel = level.toLowerCase();

    if (lowerLevel.includes('entry') || lowerLevel.includes('junior') || lowerLevel.includes('0-2')) {
        return 0;
    } else if (lowerLevel.includes('mid') || lowerLevel.includes('2-5')) {
        return 2;
    } else if (lowerLevel.includes('senior') || lowerLevel.includes('5-10')) {
        return 5;
    } else if (lowerLevel.includes('lead') || lowerLevel.includes('principal') || lowerLevel.includes('10+')) {
        return 10;
    }

    return 2; // Default to mid-level
}

function calculateEducationMatch(education: any[], requiredEducation: string[]): number {
    if (!requiredEducation || requiredEducation.length === 0) return 100;
    if (!education || education.length === 0) return 50;

    const degrees = education.map(edu => edu.degree ? edu.degree.toLowerCase() : '').filter(Boolean);
    const required = requiredEducation.map(req => req.toLowerCase());

    // Check for matches
    const hasMatch = required.some(req =>
        degrees.some(deg => deg.includes(req) || req.includes(deg))
    );

    return hasMatch ? 100 : 70;
}
