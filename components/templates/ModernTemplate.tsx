import { ResumeData, ColorTheme } from '@/lib/types';
import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink, Award, GraduationCap, Languages } from 'lucide-react';

interface ModernTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
}

export default function ModernTemplate({ data, colorTheme, fontFamily, fontSize }: ModernTemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

    // Helper to get RGB values for opacity
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    };

    const primaryRgb = hexToRgb(colorTheme.primary);

    return (
        <div className={`bg-white shadow-lg ${fontFamily} ${fontSize} w-full mx-auto flex`} style={{ minHeight: '11in' }}>
            {/* Left Sidebar */}
            <div className="w-1/3 p-8 flex flex-col gap-8 text-white" style={{ backgroundColor: colorTheme.primary }}>

                {/* Profile Header (Sidebar) */}
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-4 leading-tight">
                        {personalInfo.fullName || 'Your Name'}
                    </h1>
                    <p className="text-sm font-medium uppercase tracking-widest opacity-90 mb-6 border-b border-white/20 pb-4">
                        {personalInfo.targetRole || 'Target Role'}
                    </p>

                    <div className="space-y-3 text-sm opacity-95">
                        {personalInfo.email && (
                            <div className="flex items-center gap-3">
                                <Mail size={14} className="flex-shrink-0" />
                                <span className="break-all">{personalInfo.email}</span>
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center gap-3">
                                <Phone size={14} className="flex-shrink-0" />
                                <span>{personalInfo.phone}</span>
                            </div>
                        )}
                        {personalInfo.location && (
                            <div className="flex items-center gap-3">
                                <MapPin size={14} className="flex-shrink-0" />
                                <span>{personalInfo.location}</span>
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-3">
                                <Linkedin size={14} className="flex-shrink-0" />
                                <span className="break-all">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-3">
                                <Globe size={14} className="flex-shrink-0" />
                                <span className="break-all">{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Education */}
                {education.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 opacity-90">
                            <GraduationCap size={16} /> Education
                        </h2>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="break-inside-avoid">
                                    <div className="font-bold text-base">{edu.degree}</div>
                                    <div className="text-sm opacity-90">{edu.institution}</div>
                                    <div className="text-xs opacity-75 mt-1 font-medium bg-white/10 inline-block px-2 py-0.5 rounded">
                                        {edu.startDate} - {edu.endDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 opacity-90">
                            Skills
                        </h2>
                        <div className="space-y-4">
                            {skills.map((skillGroup) => (
                                <div key={skillGroup.id} className="break-inside-avoid">
                                    <h3 className="text-xs font-bold uppercase opacity-75 mb-2">{skillGroup.category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skillGroup.items.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs font-medium px-2 py-1 rounded bg-white/10 border border-white/20"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {languages && languages.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 opacity-90">
                            <Languages size={16} /> Languages
                        </h2>
                        <div className="space-y-2">
                            {languages.map((lang: any, i: number) => (
                                <div key={i} className="flex justify-between items-center text-sm break-inside-avoid">
                                    <span className="font-medium">{lang.name || lang}</span>
                                    <span className="text-xs opacity-75 uppercase">{lang.proficiency || 'Fluent'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Content */}
            <div className="w-2/3 p-10 flex flex-col gap-8">

                {/* Summary */}
                {summary && (
                    <div className="break-inside-avoid">
                        <h2
                            className="text-lg font-bold uppercase tracking-wider mb-3 border-b-2 pb-1 inline-block"
                            style={{ color: colorTheme.primary, borderColor: colorTheme.secondary }}
                        >
                            Professional Profile
                        </h2>
                        <p className="text-slate-700 leading-relaxed text-justify">
                            {summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <div>
                        <h2
                            className="text-lg font-bold uppercase tracking-wider mb-6 border-b-2 pb-1 inline-block"
                            style={{ color: colorTheme.primary, borderColor: colorTheme.secondary }}
                        >
                            Work Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-xl text-slate-800">{exp.position}</h3>
                                        <span className="text-sm font-bold text-slate-500 whitespace-nowrap">
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3 text-sm font-medium" style={{ color: colorTheme.primary }}>
                                        <span>{exp.company}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-500 font-normal">{exp.location}</span>
                                    </div>

                                    <ul className="list-disc list-outside ml-4 space-y-1.5 text-slate-700 text-sm">
                                        {exp.description.map((desc, idx) => (
                                            <li key={idx} className="pl-1 leading-relaxed break-inside-avoid">
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <div>
                        <h2
                            className="text-lg font-bold uppercase tracking-wider mb-6 border-b-2 pb-1 inline-block"
                            style={{ color: colorTheme.primary, borderColor: colorTheme.secondary }}
                        >
                            Key Projects
                        </h2>
                        <div className="space-y-5">
                            {projects.map((project) => (
                                <div key={project.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-lg text-slate-800">{project.name}</h3>
                                        {project.link && (
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <ExternalLink size={12} />
                                                <span>Link</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-slate-700 text-sm mb-2 leading-relaxed">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, t) => (
                                            <span
                                                key={t}
                                                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                                                style={{
                                                    color: colorTheme.primary,
                                                    borderColor: colorTheme.secondary,
                                                    backgroundColor: `rgba(${primaryRgb}, 0.05)`
                                                }}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications (if not in sidebar) */}
                {certifications.length > 0 && (
                    <div>
                        <h2
                            className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1 inline-block"
                            style={{ color: colorTheme.primary, borderColor: colorTheme.secondary }}
                        >
                            Certifications
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="p-3 bg-slate-50 rounded border border-slate-100 break-inside-avoid">
                                    <div className="flex items-start gap-2">
                                        <Award size={16} className="mt-0.5 flex-shrink-0" style={{ color: colorTheme.primary }} />
                                        <div>
                                            <div className="font-bold text-sm text-slate-800">{cert.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{cert.issuer} • {cert.date}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
