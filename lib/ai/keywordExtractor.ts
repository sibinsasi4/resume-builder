// Keyword extraction utility using basic NLP techniques

export function extractKeywords(text: string): string[] {
    // Convert to lowercase and remove special characters
    const cleaned = text.toLowerCase().replace(/[^a-z0-9\s+#]/g, ' ');

    // Split into words
    const words = cleaned.split(/\s+/).filter(word => word.length > 2);

    // Common stop words to filter out
    const stopWords = new Set([
        'the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'has',
        'will', 'are', 'was', 'were', 'been', 'being', 'can', 'could', 'should',
        'would', 'may', 'might', 'must', 'shall', 'our', 'your', 'their',
    ]);

    // Filter stop words and get unique keywords
    const keywords = words.filter(word => !stopWords.has(word));

    // Count frequency
    const frequency: Record<string, number> = {};
    keywords.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    // Sort by frequency and return top keywords
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([word]) => word);
}

export function extractSkills(text: string): string[] {
    const commonSkills = [
        // Programming languages
        'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin',
        // Frameworks
        'react', 'angular', 'vue', 'nextjs', 'nodejs', 'express', 'django', 'flask', 'spring', 'rails',
        // Databases
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb',
        // Cloud & DevOps
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github', 'ci/cd', 'terraform',
        // Tools
        'git', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'photoshop', 'illustrator',
        // Soft skills
        'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical', 'creative',
        // Other
        'agile', 'scrum', 'rest', 'api', 'microservices', 'testing', 'debugging', 'optimization',
    ];

    const lowerText = text.toLowerCase();
    const foundSkills: string[] = [];

    commonSkills.forEach(skill => {
        if (lowerText.includes(skill)) {
            foundSkills.push(skill);
        }
    });

    return [...new Set(foundSkills)];
}

export function calculateKeywordMatch(resumeKeywords: string[], jdKeywords: string[]): number {
    if (jdKeywords.length === 0) return 0;

    const matches = resumeKeywords.filter(keyword => jdKeywords.includes(keyword));
    return (matches.length / jdKeywords.length) * 100;
}
