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

    // STRENGTHS
    if (matchScores.skillsMatch >= 70) {
        strengths.push(`Strong skills alignment with ${matchScores.skillsMatch}% match to job requirements`);
    }

    if (matchScores.experienceMatch >= 80) {
        strengths.push('Your experience level matches or exceeds the job requirements');
    }

    if (resumeData.certifications && resumeData.certifications.length > 0) {
        strengths.push(`You have ${resumeData.certifications.length} relevant certification(s) that add credibility`);
    }

    if (resumeData.projects && resumeData.projects.length >= 3) {
        strengths.push('Strong project portfolio demonstrates hands-on experience');
    }

    const matchingSkills = resumeSkills.filter(skill =>
        requiredSkills.some(req => skill.includes(req) || req.includes(skill))
    );
    if (matchingSkills.length > 0) {
        strengths.push(`Key matching skills: ${matchingSkills.slice(0, 5).join(', ')}`);
    }

    // WEAKNESSES
    if (matchScores.skillsMatch < 60) {
        weaknesses.push('Significant skills gap - missing several key requirements from the job description');
    }

    const missingSkills = requiredSkills.filter(skill =>
        !resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))
    );

    if (missingSkills.length > 0) {
        weaknesses.push(`Missing required skills: ${missingSkills.slice(0, 5).join(', ')}`);
    }

    if (matchScores.experienceMatch < 60) {
        weaknesses.push('Experience level may be below what the role requires');
    }

    if (!resumeData.experience || resumeData.experience.length === 0) {
        weaknesses.push('No work experience listed - consider adding internships or relevant projects');
    }

    if (!resumeData.summary) {
        weaknesses.push('Missing professional summary - add one to make a strong first impression');
    }

    // OPPORTUNITIES
    if (missingSkills.length > 0) {
        opportunities.push(`Learn these in-demand skills: ${missingSkills.slice(0, 3).join(', ')}`);
    }

    const missingPreferred = preferredSkills.filter(skill =>
        !resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))
    );

    if (missingPreferred.length > 0) {
        opportunities.push(`Consider gaining experience in: ${missingPreferred.slice(0, 3).join(', ')}`);
    }

    if (!resumeData.projects || resumeData.projects.length < 2) {
        opportunities.push('Build 2-3 projects showcasing the required skills to strengthen your application');
    }

    if (!resumeData.certifications || resumeData.certifications.length === 0) {
        opportunities.push('Obtain relevant certifications to boost your credibility');
    }

    opportunities.push('Tailor your resume summary to highlight how your experience aligns with this specific role');

    return {
        strengths: strengths.length > 0 ? strengths : ['Review your resume to identify your key strengths'],
        weaknesses: weaknesses.length > 0 ? weaknesses : ['Your resume looks strong overall'],
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
