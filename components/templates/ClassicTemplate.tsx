import { ResumeData, ColorTheme } from '@/lib/types';

interface ClassicTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
}

export default function ClassicTemplate({ data, colorTheme, fontFamily }: ClassicTemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

    return (
        <div className={`bg-white p-8 shadow-lg ${fontFamily} max-w-[8.5in] mx-auto`} style={{ minHeight: '11in' }}>
            {/* Header */}
            <div className="border-b-4 pb-4 mb-6" style={{ borderColor: colorTheme.primary }}>
                <h1 className="text-4xl font-bold mb-2" style={{ color: colorTheme.primary }}>
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                    {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                    {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                </div>
                {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
                    <div className="flex flex-wrap gap-4 text-sm mt-2">
                        {personalInfo.linkedin && <span className="text-blue-600">🔗 LinkedIn</span>}
                        {personalInfo.github && <span className="text-blue-600">💻 GitHub</span>}
                        {personalInfo.website && <span className="text-blue-600">🌐 Website</span>}
                    </div>
                )}
            </div>

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
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h3 className="font-bold text-lg">{exp.position}</h3>
                                    <p className="text-gray-700">{exp.company} • {exp.location}</p>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                </span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {exp.description.map((desc, idx) => (
                                    <li key={idx}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3" style={{ color: colorTheme.primary }}>
                        Education
                    </h2>
                    {education.map((edu) => (
                        <div key={edu.id} className="mb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                                    <p className="text-gray-700">{edu.institution} • {edu.location}</p>
                                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {edu.startDate} - {edu.endDate}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3" style={{ color: colorTheme.primary }}>
                        Skills
                    </h2>
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
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3" style={{ color: colorTheme.primary }}>
                        Projects
                    </h2>
                    {projects.map((project) => (
                        <div key={project.id} className="mb-3">
                            <h3 className="font-bold">{project.name}</h3>
                            <p className="text-gray-700 text-sm mb-1">{project.description}</p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Technologies:</span> {project.technologies.join(', ')}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3" style={{ color: colorTheme.primary }}>
                        Certifications
                    </h2>
                    {certifications.map((cert) => (
                        <div key={cert.id} className="mb-2">
                            <h3 className="font-semibold">{cert.name}</h3>
                            <p className="text-sm text-gray-700">{cert.issuer} • {cert.date}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
