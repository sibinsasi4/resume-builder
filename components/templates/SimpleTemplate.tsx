import { ResumeData, ColorTheme } from '@/lib/types';

interface SimpleTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
}

export default function SimpleTemplate({ data, colorTheme, fontFamily, fontSize }: SimpleTemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

    return (
        <div className={`bg-white p-12 ${fontFamily} ${fontSize} w-full mx-auto`} style={{ minHeight: '11in' }}>
            {/* Header - Ultra Simple */}
            <div className="mb-8">
                <h1 className="text-5xl font-light mb-3">{personalInfo.fullName || 'Your Name'}</h1>
                <div className="text-gray-600 space-x-3">
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
                    <p className="text-gray-700 leading-relaxed text-lg">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Experience</h2>
                    {experience.map((exp) => (
                        <div key={exp.id} className="mb-6">
                            <div className="flex justify-between mb-1">
                                <h3 className="font-semibold text-lg">{exp.position}</h3>
                                <span className="text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <p className="text-gray-600 mb-2">{exp.company}</p>
                            <ul className="space-y-1 text-gray-700">
                                {exp.description.map((desc, idx) => (
                                    <li key={idx}>• {desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Education</h2>
                    {education.map((edu) => (
                        <div key={edu.id} className="mb-4">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                </div>
                                <span className="text-gray-600">{edu.endDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Skills</h2>
                    {skills.map((skillGroup) => (
                        <div key={skillGroup.id} className="mb-2">
                            <span className="font-semibold">{skillGroup.category}: </span>
                            <span className="text-gray-700">{skillGroup.items.join(', ')}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Projects</h2>
                    {projects.map((project) => (
                        <div key={project.id} className="mb-4">
                            <h3 className="font-semibold">{project.name}</h3>
                            <p className="text-gray-700">{project.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Certifications</h2>
                    {certifications.map((cert) => (
                        <div key={cert.id} className="mb-2">
                            <span className="font-semibold">{cert.name}</span>
                            <span className="text-gray-600"> — {cert.issuer}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
