import { ResumeData, ColorTheme } from '@/lib/types';

interface TimelineTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
}

export default function TimelineTemplate({ data, colorTheme, fontFamily, fontSize }: TimelineTemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

    return (
        <div className={`bg-white p-8 ${fontFamily} ${fontSize} max-w-[8.5in] mx-auto`} style={{ minHeight: '11in' }}>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: colorTheme.primary }}>
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>•</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span>•</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-8">
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                </div>
            )}

            {/* Professional Journey Timeline */}
            {experience.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: colorTheme.primary }}>Professional Journey</h2>
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: colorTheme.primary, opacity: 0.3 }} />

                        {experience.map((exp, index) => (
                            <div key={exp.id} className="relative pl-8 pb-8 last:pb-0">
                                {/* Timeline Dot */}
                                <div
                                    className="absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-white"
                                    style={{ backgroundColor: colorTheme.primary, transform: 'translateX(-7.5px)' }}
                                />

                                {/* Content */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="font-bold text-lg" style={{ color: colorTheme.secondary }}>{exp.position}</h3>
                                        <span className="text-sm font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: colorTheme.primary }}>
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <p className="font-semibold text-gray-700 mb-2">{exp.company} | {exp.location}</p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                                        {exp.description.map((desc, idx) => (
                                            <li key={idx}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education Timeline */}
            {education.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: colorTheme.primary }}>Education</h2>
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: colorTheme.accent, opacity: 0.3 }} />

                        {education.map((edu) => (
                            <div key={edu.id} className="relative pl-8 pb-6 last:pb-0">
                                <div
                                    className="absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-white"
                                    style={{ backgroundColor: colorTheme.accent, transform: 'translateX(-7.5px)' }}
                                />
                                <div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                                        <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    <p className="text-gray-700">{edu.institution}, {edu.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-6">
                {/* Skills */}
                {skills.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: colorTheme.primary }}>Skills</h2>
                        {skills.map((skillGroup) => (
                            <div key={skillGroup.id} className="mb-3">
                                <h3 className="font-semibold text-sm" style={{ color: colorTheme.secondary }}>{skillGroup.category}</h3>
                                <p className="text-gray-700 text-sm">{skillGroup.items.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: colorTheme.primary }}>Certifications</h2>
                        {certifications.map((cert) => (
                            <div key={cert.id} className="mb-2">
                                <h3 className="font-semibold text-sm">{cert.name}</h3>
                                <p className="text-gray-600 text-xs">{cert.issuer}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
