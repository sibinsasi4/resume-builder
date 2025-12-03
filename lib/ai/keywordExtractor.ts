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
        'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical', 'creative', 'negotiation', 'time management', 'adaptability',
        // Sales & Marketing
        'sales', 'marketing', 'crm', 'seo', 'sem', 'content marketing', 'social media', 'lead generation', 'cold calling', 'account management', 'b2b', 'b2c', 'salesforce', 'hubspot', 'email marketing', 'branding', 'market research',
        // HR & Management
        'recruiting', 'talent acquisition', 'human resources', 'employee relations', 'performance management', 'onboarding', 'training', 'payroll', 'compliance', 'strategic planning', 'project management', 'operations',
        // Operations & Strategy
        'logistics', 'supply chain', 'procurement', 'inventory management', 'process improvement', 'six sigma', 'lean', 'kaizen', 'stakeholder management', 'vendor management', 'contract negotiation', 'risk management', 'change management', 'business analysis', 'kpi', 'okr', 'resource allocation', 'workflow optimization', 'sops',
        // Finance & Accounting
        'accounting', 'finance', 'budgeting', 'forecasting', 'financial analysis', 'excel', 'quickbooks', 'auditing', 'taxation', 'financial reporting', 'gaap', 'ifrs', 'payroll', 'bookkeeping', 'compliance',
        // Data & Analytics
        'data analysis', 'statistics', 'machine learning', 'ai', 'tableau', 'power bi', 'excel', 'data visualization', 'big data', 'sql', 'python', 'r', 'sas',
        // Healthcare & Medical
        'patient care', 'nursing', 'medical terminology', 'emr', 'ehr', 'hipaa', 'clinical research', 'healthcare management', 'public health', 'cpr', 'bls', 'triage', 'phlebotomy', 'medical billing', 'medical coding',
        // Engineering (Non-Software)
        'autocad', 'solidworks', 'matlab', 'civil engineering', 'mechanical engineering', 'electrical engineering', 'project engineering', 'manufacturing', 'quality control', 'quality assurance', 'maintenance', 'robotics', 'plc', 'scada',
        // Legal & Compliance
        'legal research', 'contract law', 'corporate law', 'litigation', 'legal writing', 'compliance', 'regulatory affairs', 'intellectual property', 'paralegal', 'mediation', 'arbitration',
        // Creative & Design
        'graphic design', 'ui/ux', 'adobe creative suite', 'photoshop', 'illustrator', 'indesign', 'video editing', 'premiere pro', 'after effects', 'copywriting', 'content creation', 'social media marketing', 'branding', 'photography',
        // Administrative & Office
        'data entry', 'customer service', 'office management', 'scheduling', 'calendar management', 'microsoft office', 'outlook', 'powerpoint', 'word', 'transcription', 'filing', 'receptionist', 'executive assistant',
        // Education & Training
        'curriculum development', 'instructional design', 'classroom management', 'teaching', 'tutoring', 'e-learning', 'lms', 'mentoring', 'coaching', 'educational technology',
        // Other
        'agile', 'scrum', 'rest', 'api', 'microservices', 'testing', 'debugging', 'optimization', 'customer service', 'client relations', 'public speaking', 'writing', 'editing', 'research', 'troubleshooting',
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
