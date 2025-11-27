import { ResumeData, ParsedJobDescription, ResumeSuggestion } from '../types';
import { extractSkills } from './keywordExtractor';

export function generateResumeSuggestions(
    resumeData: ResumeData,
    resumeText: string,
    jobDescription: ParsedJobDescription
): ResumeSuggestion[] {
    const suggestions: ResumeSuggestion[] = [];

    const resumeSkills = extractSkills(resumeText);
    const requiredSkills = jobDescription.requiredSkills.map(s => s.toLowerCase());

    // Summary suggestions
    if (!resumeData.summary) {
        suggestions.push({
            section: 'summary',
            type: 'add',
            suggestion: `Add a professional summary highlighting your experience in ${jobDescription.title}. Example: "Results-driven professional with X years of experience in [key skills]. Proven track record of [achievements relevant to the role]."`,
            priority: 'high',
        });
    } else if (resumeData.summary.length < 100) {
        suggestions.push({
            section: 'summary',
            type: 'modify',
            suggestion: 'Expand your summary to 2-3 sentences, emphasizing how your background aligns with this specific role.',
            priority: 'medium',
        });
    }

    // Experience suggestions
    if (resumeData.experience && resumeData.experience.length > 0) {
        resumeData.experience.forEach((exp, index) => {
            if (exp.description && exp.description.length < 3) {
                suggestions.push({
                    section: 'experience',
                    type: 'modify',
                    suggestion: `Add more bullet points to "${exp.position}" at ${exp.company}. Include quantifiable achievements (e.g., "Increased efficiency by 30%", "Managed team of 5").`,
                    priority: 'high',
                });
            }

            // Check if descriptions have numbers/metrics
            const hasMetrics = exp.description && exp.description.some(desc => /\d+%|\d+x|\$\d+|\d+ (users|customers|projects)/.test(desc));
            if (!hasMetrics) {
                suggestions.push({
                    section: 'experience',
                    type: 'modify',
                    suggestion: `Add quantifiable results to "${exp.position}". Replace vague statements with specific metrics and outcomes.`,
                    priority: 'medium',
                });
            }
        });
    }

    // Skills suggestions
    const missingSkills = requiredSkills.filter(skill =>
        !resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))
    );

    if (missingSkills.length > 0) {
        suggestions.push({
            section: 'skills',
            type: 'add',
            suggestion: `Add these required skills if you have experience with them: ${missingSkills.slice(0, 5).join(', ')}. If you don't have experience, consider learning them.`,
            priority: 'high',
        });
    }

    // Projects suggestions
    if ((!resumeData.projects || resumeData.projects.length === 0) && missingSkills.length > 0) {
        suggestions.push({
            section: 'projects',
            type: 'add',
            suggestion: `Create a project section and add 2-3 projects demonstrating skills like ${missingSkills.slice(0, 3).join(', ')}. Include project name, description, technologies used, and link if available.`,
            priority: 'high',
        });
    }

    // Certifications suggestions
    if (!resumeData.certifications || resumeData.certifications.length === 0) {
        suggestions.push({
            section: 'certifications',
            type: 'add',
            suggestion: 'Consider adding relevant certifications to boost your credibility. Look for industry-recognized certifications in your field.',
            priority: 'low',
        });
    }

    // Education suggestions
    if (!resumeData.education || resumeData.education.length === 0) {
        suggestions.push({
            section: 'education',
            type: 'add',
            suggestion: 'Add your educational background. Include degree, field of study, institution, and graduation date.',
            priority: 'high',
        });
    }

    // Keyword optimization
    const jdKeywords = jobDescription.keywords.slice(0, 10);
    const missingKeywords = jdKeywords.filter(kw =>
        !resumeText.toLowerCase().includes(kw.toLowerCase())
    );

    if (missingKeywords.length > 0) {
        suggestions.push({
            section: 'summary',
            type: 'modify',
            suggestion: `Incorporate these keywords from the job description naturally into your resume: ${missingKeywords.slice(0, 5).join(', ')}`,
            priority: 'medium',
        });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
