import { ResumeData, JobAnalysisResult } from '../types';
import { parseJobDescription } from './jdParser';
import { calculateATSScore } from './atsScoring';
import { calculateJobMatch } from './jobMatching';
import { generateSwotAnalysis, generateRecommendation } from './swotAnalysis';
import { generateResumeSuggestions } from './suggestions';

export async function analyzeResumeWithJob(
    resumeData: ResumeData,
    jobDescriptionText: string
): Promise<JobAnalysisResult> {
    // Convert resume data to text for analysis
    const resumeText = convertResumeToText(resumeData);

    // Parse job description
    const parsedJD = parseJobDescription(jobDescriptionText);

    // Calculate ATS score
    const atsScore = calculateATSScore(resumeData, resumeText);

    // Calculate job match scores
    const matchScores = calculateJobMatch(resumeData, resumeText, parsedJD);

    // Generate SWOT analysis
    const swotAnalysis = generateSwotAnalysis(
        resumeData,
        resumeText,
        parsedJD,
        matchScores
    );

    // Generate recommendation
    const recommendation = generateRecommendation(
        matchScores.matchScore,
        matchScores.skillsMatch,
        matchScores.experienceMatch
    );

    // Generate resume suggestions
    const suggestions = generateResumeSuggestions(resumeData, resumeText, parsedJD);

    return {
        atsScore,
        matchScore: matchScores.matchScore,
        skillsMatch: matchScores.skillsMatch,
        experienceMatch: matchScores.experienceMatch,
        educationMatch: matchScores.educationMatch,
        swotAnalysis,
        suggestions,
        recommendation,
    };
}

function convertResumeToText(resumeData: ResumeData): string {
    const parts: string[] = [];

    // Personal info - with null checks
    if (resumeData.personalInfo) {
        const { personalInfo } = resumeData;
        if (personalInfo.fullName) parts.push(personalInfo.fullName);
        if (personalInfo.email) parts.push(personalInfo.email);
        if (personalInfo.phone) parts.push(personalInfo.phone);
        if (personalInfo.location) parts.push(personalInfo.location);
    }

    // Summary
    if (resumeData.summary) {
        parts.push(resumeData.summary);
    }

    // Experience
    if (resumeData.experience && Array.isArray(resumeData.experience)) {
        resumeData.experience.forEach(exp => {
            if (exp.position) parts.push(exp.position);
            if (exp.company) parts.push(exp.company);
            if (exp.description && Array.isArray(exp.description)) {
                parts.push(...exp.description);
            }
        });
    }

    // Education
    if (resumeData.education && Array.isArray(resumeData.education)) {
        resumeData.education.forEach(edu => {
            if (edu.degree) parts.push(edu.degree);
            if (edu.field) parts.push(edu.field);
            if (edu.institution) parts.push(edu.institution);
        });
    }

    // Skills
    if (resumeData.skills && Array.isArray(resumeData.skills)) {
        resumeData.skills.forEach(skillGroup => {
            if (skillGroup.category) parts.push(skillGroup.category);
            if (skillGroup.items && Array.isArray(skillGroup.items)) {
                parts.push(...skillGroup.items);
            }
        });
    }

    // Projects
    if (resumeData.projects && Array.isArray(resumeData.projects)) {
        resumeData.projects.forEach(project => {
            if (project.name) parts.push(project.name);
            if (project.description) parts.push(project.description);
            if (project.technologies && Array.isArray(project.technologies)) {
                parts.push(...project.technologies);
            }
        });
    }

    // Certifications
    if (resumeData.certifications && Array.isArray(resumeData.certifications)) {
        resumeData.certifications.forEach(cert => {
            if (cert.name) parts.push(cert.name);
            if (cert.issuer) parts.push(cert.issuer);
        });
    }

    // Achievements
    if (resumeData.achievements && Array.isArray(resumeData.achievements)) {
        parts.push(...resumeData.achievements.filter(Boolean));
    }

    return parts.filter(Boolean).join(' ');
}

