import { ResumeData, ColorTheme } from '@/lib/types';

interface ElegantTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
}

export default function ElegantTemplate({ data, colorTheme, fontFamily, fontSize }: ElegantTemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

    return (
        <div className={`bg-white p-10 font-serif ${fontSize} max-w-[8.5in] mx-auto`} style={{ minHeight: '11in' }}>
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b" style={{ borderColor: colorTheme.primary }}>
                <h1 className="text-4xl font-light mb-3 tracking-wide" style={{ color: colorTheme.primary }}>
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm text-gray-600 space-x-2">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>|</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span>|</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-8 text-center">
                    <p className="text-gray-700 leading-relaxed italic">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-light mb-4 pb-2 border-b" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                        Experience
                    </h2>
                    {experience.map((exp) => (
                        <div key={exp.id} className="mb-5">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-semibold text-lg">{exp.position}</h3>
                                <span className="text-sm text-gray-500 italic">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <p className="text-gray-600 italic mb-2">{exp.company}, {exp.location}</p>
                            <ul className="space-y-1 text-gray-700">
                                {exp.description.map((desc, idx) => (
                                    <li key={idx} className="pl-4 border-l-2 border-gray-200">• {desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-light mb-4 pb-2 border-b" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                        Education
                    </h2>
                    {education.map((edu) => (
                        <div key={edu.id} className="mb-3">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                                    <p className="text-gray-600 italic">{edu.institution}, {edu.location}</p>
                                </div>
                                <span className="text-sm text-gray-500 italic">{edu.endDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 gap-8">
                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-light mb-4 pb-2 border-b" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                            Skills
                        </h2>
                        {skills.map((skillGroup) => (
                            <div key={skillGroup.id} className="mb-3">
                                <h3 className="font-semibold text-sm">{skillGroup.category}</h3>
                                <p className="text-gray-700 text-sm">{skillGroup.items.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-light mb-4 pb-2 border-b" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                            Certifications
                        </h2>
                        {certifications.map((cert) => (
                            <div key={cert.id} className="mb-2">
                                <h3 className="font-semibold text-sm">{cert.name}</h3>
                                <p className="text-gray-600 text-xs italic">{cert.issuer}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Projects */}
            {projects.length > 0 && (
                <div>
                    <h2 className="text-2xl font-light mb-4 pb-2 border-b" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                        Projects
                    </h2>
                    {projects.map((project) => (
                        <div key={project.id} className="mb-3">
                            <h3 className="font-semibold">{project.name}</h3>
                            <p className="text-gray-700 text-sm italic">{project.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
