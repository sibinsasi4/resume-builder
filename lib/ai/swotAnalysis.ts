import { ResumeData, ParsedJobDescription, SwotAnalysis, Recommendation } from '../types';
import { extractSkills } from './keywordExtractor';

export function generateSwotAnalysis(
    resumeData: ResumeData,
    resumeText: string,
    jobDescription: ParsedJobDescription,
    matchScores: {
        matchScore: number;
        skillsMatch: number;
        experienceMatch: number;
        educationMatch: number;
    }
): SwotAnalysis {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const opportunities: string[] = [];

    const resumeSkills = extractSkills(resumeText);
    const requiredSkills = jobDescription.requiredSkills.map(s => s.toLowerCase());
    const preferredSkills = jobDescription.preferredSkills.map(s => s.toLowerCase());

    // Helper for random phrasing
    const pick = (opts: string[]) => opts[Math.floor(Math.random() * opts.length)];

    // STRENGTHS
    if (matchScores.skillsMatch >= 70) {
        strengths.push(pick([
            `Strong skills alignment (${matchScores.skillsMatch}%) with the core job requirements.`,
            `Your technical profile is a great match (${matchScores.skillsMatch}%) for this role.`,
            `You possess most of the key skills required for this position.`
        ]));
    }

    if (matchScores.experienceMatch >= 80) {
        strengths.push(pick([
            'Your experience level is well-suited for this position.',
            'You have the professional background expected for this role.',
            'Your career history aligns perfectly with the seniority of this job.'
        ]));
    }

    if (resumeData.certifications && resumeData.certifications.length > 0) {
        strengths.push(`You have ${resumeData.certifications.length} certification(s) that demonstrate your commitment to learning.`);
    }

    const matchingSkills = resumeSkills.filter(skill =>
        requiredSkills.some(req => skill.includes(req) || req.includes(skill))
    );
    if (matchingSkills.length > 0) {
        // Capitalize skills
        const formattedSkills = matchingSkills.slice(0, 5).map(s => s.charAt(0).toUpperCase() + s.slice(1));
        strengths.push(`You match key requirements: ${formattedSkills.join(', ')}.`);
    }

    // WEAKNESSES
    if (matchScores.skillsMatch < 60) {
        weaknesses.push(pick([
            'There is a gap in the specific skills required for this role.',
            'Your profile is missing some of the core technical requirements.',
            'You may need to demonstrate more proficiency in the required tools.'
        ]));
    }

    const missingSkills = requiredSkills.filter(skill =>
        !resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))
    );

    if (missingSkills.length > 0) {
        const formattedMissing = missingSkills.slice(0, 5).map(s => s.charAt(0).toUpperCase() + s.slice(1));
        weaknesses.push(`Missing or not explicitly mentioned: ${formattedMissing.join(', ')}.`);
    }

    if (matchScores.experienceMatch < 60) {
        weaknesses.push('The role may require more years of experience than currently listed.');
    }

    if (!resumeData.summary) {
        weaknesses.push('A professional summary is missing, which is key for a quick first impression.');
    }

    // OPPORTUNITIES
    if (missingSkills.length > 0) {
        const topMissing = missingSkills.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1));
        opportunities.push(`Highlight any experience with ${topMissing.join(', ')} in your cover letter.`);
    }

    const missingPreferred = preferredSkills.filter(skill =>
        !resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))
    );

    if (missingPreferred.length > 0) {
        const formattedPref = missingPreferred.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1));
        opportunities.push(`Stand out by mentioning knowledge of: ${formattedPref.join(', ')}.`);
    }

    if (!resumeData.projects || resumeData.projects.length < 2) {
        opportunities.push('Adding a relevant project could demonstrate your practical skills better.');
    }

    opportunities.push(pick([
        'Tailor your summary to specifically mention the job title and key requirements.',
        'Rephrase your bullet points to match the terminology used in the job description.',
        'Quantify your achievements (e.g., "increased sales by 20%") to make a stronger impact.'
    ]));

    return {
        strengths: strengths.length > 0 ? strengths : ['Your resume has a solid foundation.'],
        weaknesses: weaknesses.length > 0 ? weaknesses : ['No major weaknesses detected relative to this job.'],
        opportunities: opportunities.slice(0, 5),
    };
}

export function generateRecommendation(
    matchScore: number,
    skillsMatch: number,
    experienceMatch: number
): Recommendation {
    if (matchScore >= 75 && skillsMatch >= 70) {
        return {
            decision: 'strongly-apply',
            reasoning: 'You are a strong match for this position. Your skills and experience align well with the job requirements. Apply with confidence and highlight your matching qualifications in your cover letter.',
            confidence: matchScore,
        };
    } else if (matchScore >= 60 && skillsMatch >= 50) {
        return {
            decision: 'apply-with-improvements',
            reasoning: 'You have a decent match, but there are some gaps. Before applying, consider: (1) Updating your resume to emphasize relevant skills, (2) Adding projects that demonstrate missing skills, (3) Tailoring your summary to this specific role. With these improvements, you\'ll have a better chance.',
            confidence: matchScore,
        };
    } else {
        return {
            decision: 'upskill-first',
            reasoning: 'There is a significant gap between your current profile and this role\'s requirements. We recommend: (1) Identifying the top 3-5 missing skills, (2) Taking courses or building projects to gain those skills, (3) Gaining more relevant experience through internships or freelance work. Reapply once you\'ve bridged these gaps.',
            confidence: matchScore,
        };
    }
}
