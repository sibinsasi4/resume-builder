import { ResumeData, ColorTheme } from '@/lib/types';

interface ModernTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
}

export default function ModernTemplate({ data, colorTheme, fontFamily, fontSize }: ModernTemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

    return (
        <div className={`bg-white shadow-lg ${fontFamily} ${fontSize} max-w-[8.5in] mx-auto flex`} style={{ minHeight: '11in' }}>
            {/* Left Sidebar */}
            <div className="w-1/3 p-6" style={{ backgroundColor: colorTheme.primary, color: 'white' }}>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
                    <div className="text-sm space-y-2 opacity-90">
                        {personalInfo.email && <div>✉ {personalInfo.email}</div>}
                        {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
                        {personalInfo.location && <div>📍 {personalInfo.location}</div>}
                    </div>
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3 border-b-2 pb-2 border-white/30">Skills</h2>
                        {skills.map((skillGroup) => (
                            <div key={skillGroup.id} className="mb-3">
                                <h3 className="font-semibold text-sm mb-1">{skillGroup.category}</h3>
                                <div className="text-sm opacity-90 space-y-1">
                                    {skillGroup.items.map((item, idx) => (
                                        <div key={idx}>• {item}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3 border-b-2 pb-2 border-white/30">Education</h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3 text-sm">
                                <h3 className="font-bold">{edu.degree}</h3>
                                <p className="opacity-90">{edu.field}</p>
                                <p className="opacity-80 text-xs">{edu.institution}</p>
                                <p className="opacity-70 text-xs">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold mb-3 border-b-2 pb-2 border-white/30">Certifications</h2>
                        {certifications.map((cert) => (
                            <div key={cert.id} className="mb-2 text-sm">
                                <h3 className="font-semibold">{cert.name}</h3>
                                <p className="opacity-80 text-xs">{cert.issuer}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Content */}
            <div className="w-2/3 p-8">
                {/* Summary */}
                {summary && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2" style={{ color: colorTheme.primary }}>
                            Professional Summary
                        </h2>
                        <p className="text-gray-700">{summary}</p>
                    </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-3" style={{ color: colorTheme.primary }}>
                            Experience
                        </h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-4">
                                <h3 className="font-bold text-lg">{exp.position}</h3>
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>{exp.company} • {exp.location}</span>
                                    <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                                    {exp.description.map((desc, idx) => (
                                        <li key={idx}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-3" style={{ color: colorTheme.primary }}>
                            Projects
                        </h2>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-3">
                                <h3 className="font-bold">{project.name}</h3>
                                <p className="text-gray-700 text-sm mb-1">{project.description}</p>
                                <p className="text-xs text-gray-600">
                                    <span className="font-semibold">Tech:</span> {project.technologies.join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
