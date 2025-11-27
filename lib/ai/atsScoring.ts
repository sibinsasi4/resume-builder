import { ResumeData } from '../types';
import { extractKeywords, extractSkills, calculateKeywordMatch } from './keywordExtractor';

export function calculateATSScore(resumeData: ResumeData, resumeText: string): number {
    let score = 0;
    const maxScore = 100;

    // 1. Contact Information (15 points)
    if (resumeData.personalInfo) {
        if (resumeData.personalInfo.fullName) score += 3;
        if (resumeData.personalInfo.email) score += 3;
        if (resumeData.personalInfo.phone) score += 3;
        if (resumeData.personalInfo.location) score += 3;
        if (resumeData.personalInfo.linkedin || resumeData.personalInfo.github) score += 3;
    }

    // 2. Section Structure (20 points)
    if (resumeData.experience && resumeData.experience.length > 0) score += 7;
    if (resumeData.education && resumeData.education.length > 0) score += 7;
    if (resumeData.skills && resumeData.skills.length > 0) score += 6;

    // 3. Content Quality (30 points)
    // Experience descriptions
    const hasDetailedExperience = resumeData.experience && resumeData.experience.some(
        exp => exp.description && exp.description.length >= 3
    );
    if (hasDetailedExperience) score += 10;

    // Skills categorization
    if (resumeData.skills && resumeData.skills.length >= 3) score += 10;

    // Projects or certifications
    const hasProjectsOrCerts = (resumeData.projects && resumeData.projects.length > 0) ||
        (resumeData.certifications && resumeData.certifications.length > 0);
    if (hasProjectsOrCerts) score += 10;

    // 4. Keyword Density (20 points)
    const keywords = extractKeywords(resumeText);
    if (keywords.length >= 20) score += 10;
    if (keywords.length >= 40) score += 10;

    // 5. Formatting & Readability (15 points)
    // Check for consistent date formats
    const hasConsistentDates = resumeData.experience && resumeData.experience.every(
        exp => exp.startDate && (exp.endDate || exp.current)
    );
    if (hasConsistentDates) score += 8;

    // Check for quantifiable achievements (numbers in descriptions)
    const hasQuantifiableResults = resumeText.match(/\d+%|\d+x|\$\d+/);
    if (hasQuantifiableResults) score += 7;

    return Math.min(score, maxScore);
}

export function getATSFeedback(score: number): string[] {
    const feedback: string[] = [];

    if (score < 60) {
        feedback.push('Your resume needs significant improvements to pass ATS systems');
        feedback.push('Add more detailed work experience with bullet points');
        feedback.push('Include relevant skills and keywords from your target job');
    } else if (score < 80) {
        feedback.push('Your resume is good but could be optimized further');
        feedback.push('Add quantifiable achievements (e.g., "Increased sales by 30%")');
        feedback.push('Ensure all sections are complete and well-formatted');
    } else {
        feedback.push('Excellent! Your resume is well-optimized for ATS systems');
        feedback.push('Continue to tailor it for specific job descriptions');
    }

    return feedback;
}
