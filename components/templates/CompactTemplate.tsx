import { ResumeData, ColorTheme } from '@/lib/types';

interface CompactTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
}

export default function CompactTemplate({ data, colorTheme, fontFamily, fontSize }: CompactTemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

    return (
        <div className={`bg-white p-6 ${fontFamily} ${fontSize} w-full mx-auto`} style={{ minHeight: '11in' }}>
            {/* Compact Header */}
            <div className="mb-4 pb-3 border-b-2" style={{ borderColor: colorTheme.primary }}>
                <h1 className="text-3xl font-bold" style={{ color: colorTheme.primary }}>
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-xs text-gray-600 mt-1">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span> | {personalInfo.phone}</span>}
                    {personalInfo.location && <span> | {personalInfo.location}</span>}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* Left Column - 1/3 */}
                <div className="space-y-4">
                    {/* Skills */}
                    {skills.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Skills</h2>
                            {skills.map((skillGroup) => (
                                <div key={skillGroup.id} className="mb-2">
                                    <h3 className="font-semibold text-xs">{skillGroup.category}</h3>
                                    <div className="text-xs text-gray-700">
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
                        <div>
                            <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Education</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-2 text-xs">
                                    <div className="font-bold">{edu.degree}</div>
                                    <div className="text-gray-700">{edu.field}</div>
                                    <div className="text-gray-600">{edu.institution}</div>
                                    <div className="text-gray-500">{edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Certifications</h2>
                            {certifications.map((cert) => (
                                <div key={cert.id} className="mb-2 text-xs">
                                    <div className="font-semibold">{cert.name}</div>
                                    <div className="text-gray-600">{cert.issuer}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column - 2/3 */}
                <div className="col-span-2 space-y-4">
                    {/* Summary */}
                    {summary && (
                        <div>
                            <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Profile</h2>
                            <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Experience</h2>
                            {experience.map((exp) => (
                                <div key={exp.id} className="mb-3">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-sm">{exp.position}</h3>
                                        <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-700 font-semibold">{exp.company} | {exp.location}</p>
                                    <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-0.5">
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
                            <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Projects</h2>
                            {projects.map((project) => (
                                <div key={project.id} className="mb-2">
                                    <h3 className="font-bold text-xs">{project.name}</h3>
                                    <p className="text-xs text-gray-700">{project.description}</p>
                                    <p className="text-xs text-gray-600">
                                        {project.technologies.join(', ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
