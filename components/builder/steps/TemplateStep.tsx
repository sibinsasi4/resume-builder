'use client';

import { templateConfigs, colorThemes } from '@/lib/constants';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import { TemplateType, ResumeData } from '@/lib/types';

interface TemplateStepProps {
    selectedTemplate: string;
    onSelectTemplate: (id: string) => void;
    colorTheme: string;
    onSelectColorTheme: (id: string) => void;
    fontFamily: string;
    onSelectFontFamily: (id: string) => void;
    fontSize: string;
    onSelectFontSize: (id: string) => void;
}

// Sample resume data for template previews
const sampleData: ResumeData = {
    personalInfo: {
        fullName: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexjohnson',
        github: 'github.com/alexjohnson',
        website: 'alexjohnson.dev',
    },
    summary: 'Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Led a team that increased platform performance by 40%.',
    experience: [
        {
            id: '1',
            company: 'TechCorp Inc.',
            position: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: 'Jan 2022',
            endDate: '',
            current: true,
            description: [
                'Led development of microservices architecture serving 2M+ users',
                'Mentored a team of 4 junior developers',
                'Reduced API response time by 60% through optimization',
            ],
        },
        {
            id: '2',
            company: 'StartupXYZ',
            position: 'Full Stack Developer',
            location: 'Remote',
            startDate: 'Mar 2019',
            endDate: 'Dec 2021',
            current: false,
            description: [
                'Built React-based dashboard used by 500+ enterprise clients',
                'Implemented CI/CD pipelines reducing deployment time by 75%',
            ],
        },
    ],
    education: [
        {
            id: '1',
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'Berkeley, CA',
            startDate: '2015',
            endDate: '2019',
            gpa: '3.8',
        },
    ],
    skills: [
        { id: '1', category: 'Languages', items: ['TypeScript', 'Python', 'Go', 'SQL'] },
        { id: '2', category: 'Frameworks', items: ['React', 'Next.js', 'Node.js', 'Express'] },
        { id: '3', category: 'Tools', items: ['Docker', 'AWS', 'Git', 'PostgreSQL'] },
    ],
    projects: [
        {
            id: '1',
            name: 'Open Source Analytics',
            description: 'Privacy-first analytics platform with 1000+ GitHub stars',
            technologies: ['React', 'Node.js', 'PostgreSQL'],
            link: 'github.com/alexj/analytics',
        },
    ],
    certifications: [
        { id: '1', name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023' },
    ],
    achievements: ['Speaker at ReactConf 2023', 'Open source contributor with 2K+ stars'],
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'],
};

export default function TemplateStep({
    selectedTemplate,
    onSelectTemplate,
    colorTheme,
    onSelectColorTheme,
    fontFamily,
    onSelectFontFamily,
    fontSize,
    onSelectFontSize,
}: TemplateStepProps) {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Choose Your Template
                </h2>
                <p className="text-slate-400 mt-2 text-lg">
                    Pick a design that matches your profession — each preview uses sample data
                </p>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templateConfigs.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    return (
                        <button
                            key={template.id}
                            onClick={() => onSelectTemplate(template.id)}
                            className={`group relative rounded-xl border-2 transition-all duration-300 text-left overflow-hidden ${
                                isSelected
                                    ? 'border-amber-500 shadow-xl shadow-amber-500/15 scale-[1.02] ring-2 ring-amber-500/30'
                                    : 'border-white/10 bg-white/5 hover:border-white/25 hover:shadow-lg hover:scale-[1.01]'
                            }`}
                        >
                            {/* Live Template Preview */}
                            <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
                                <div
                                    style={{
                                        transform: 'scale(0.22)',
                                        transformOrigin: 'top left',
                                        width: '454.5%',
                                        height: '454.5%',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <TemplateRenderer
                                        templateType={template.id as TemplateType}
                                        data={sampleData}
                                        colorThemeId={colorTheme}
                                        fontFamily={fontFamily}
                                        fontSize="small"
                                        spacing="compact"
                                        sectionOrder={sampleData.sectionOrder || []}
                                    />
                                </div>

                                {/* Hover overlay */}
                                <div className={`absolute inset-0 transition-all duration-300 ${
                                    isSelected
                                        ? 'bg-amber-500/10'
                                        : 'bg-transparent group-hover:bg-black/10'
                                }`} />
                            </div>

                            {/* Template info */}
                            <div className={`p-3 ${isSelected ? 'bg-amber-500/10' : 'bg-slate-900/80'}`}>
                                <h3 className={`font-semibold text-sm ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                                    {template.name}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                    {template.description}
                                </p>
                            </div>

                            {/* Selected badge */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <span className="text-sm text-slate-900 font-bold">✓</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Customization Row */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Color Theme */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">Color Theme</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {colorThemes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => onSelectColorTheme(theme.id)}
                                className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                                    colorTheme === theme.id
                                        ? 'border-white scale-110 shadow-lg'
                                        : 'border-transparent'
                                }`}
                                style={{ backgroundColor: theme.primary }}
                                title={theme.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Font Family */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">Font Style</h3>
                    <div className="space-y-2">
                        {[
                            { id: 'sans', label: 'Sans Serif', desc: 'Modern & clean' },
                            { id: 'serif', label: 'Serif', desc: 'Traditional & elegant' },
                            { id: 'mono', label: 'Monospace', desc: 'Tech & developer' },
                        ].map((font) => (
                            <button
                                key={font.id}
                                onClick={() => onSelectFontFamily(font.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                                    fontFamily === font.id
                                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                        : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                <span className={`text-sm font-medium ${font.id === 'serif' ? 'font-serif' : font.id === 'mono' ? 'font-mono' : 'font-sans'}`}>
                                    {font.label}
                                </span>
                                <span className="text-xs opacity-60">{font.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Font Size */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">Text Size</h3>
                    <div className="space-y-2">
                        {[
                            { id: 'small', label: 'Small', desc: 'Compact & dense' },
                            { id: 'medium', label: 'Medium', desc: 'Recommended' },
                            { id: 'large', label: 'Large', desc: 'Easy to read' },
                        ].map((size) => (
                            <button
                                key={size.id}
                                onClick={() => onSelectFontSize(size.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                                    fontSize === size.id
                                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                        : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                <span className="text-sm font-medium">{size.label}</span>
                                <span className="text-xs opacity-60">{size.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
