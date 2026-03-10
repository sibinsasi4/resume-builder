import { ResumeData, ColorTheme } from '@/lib/types';
import { Phone, Mail, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableSection from './SortableSection';

interface PremiumTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    spacing?: 'compact' | 'standard';
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function PremiumTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    spacing = 'standard',
    sectionOrder = [],
    onReorder
}: PremiumTemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements } = data;

    // Helper for section headers
    const SectionHeader = ({ title }: { title: string }) => (
        <div className="flex items-center gap-4 mb-6">
            <h2
                className="text-xl font-bold tracking-widest uppercase"
                style={{ color: '#1e293b' }} // Dark slate for text
            >
                {title}
            </h2>
            <div className="h-0.5 flex-grow bg-gray-200 relative">
                <div className="absolute left-0 top-0 h-full w-12" style={{ backgroundColor: colorTheme.primary }}></div>
            </div>
        </div>
    );

    // Helper for sidebar headers
    const SidebarHeader = ({ title }: { title: string }) => (
        <div className="mb-4 pb-2 border-b border-gray-200">
            <h3
                className="font-bold text-lg tracking-widest uppercase"
                style={{ color: colorTheme.primary }}
            >
                {title}
            </h3>
        </div>
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id && onReorder) {
            const oldIndex = sectionOrder.indexOf(active.id as string);
            const newIndex = sectionOrder.indexOf(over.id as string);
            onReorder(arrayMove(sectionOrder, oldIndex, newIndex));
        }
    };

    const sections: Record<string, React.ReactNode> = {
        summary: summary && (
            <div className="mb-10">
                <SectionHeader title="Profile Summary" />
                <p className="text-slate-600 leading-relaxed text-sm text-justify">
                    {summary}
                </p>
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-10">
                <SectionHeader title="Work Experience" />
                <div className="space-y-8">
                    {experience.map((exp) => (
                        <div key={exp.id} className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-0 top-2 bottom-0 w-px bg-slate-200 -ml-4 hidden md:block"></div>

                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="font-bold text-lg text-slate-800">{exp.position}</h3>
                                <span
                                    className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 whitespace-nowrap"
                                >
                                    {exp.startDate} - {exp.current ? 'PRESENT' : exp.endDate}
                                </span>
                            </div>

                            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <span style={{ color: colorTheme.primary }}>{exp.company}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500 text-xs">{exp.location}</span>
                            </div>

                            <ul className="space-y-2 text-sm text-slate-600">
                                {exp.description.map((desc, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-slate-300"></span>
                                        <span className="leading-relaxed">{desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-10">
                <SectionHeader title="Projects" />
                <div className="grid grid-cols-1 gap-6">
                    {projects.map((proj) => (
                        <div key={proj.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-800">{proj.name}</h3>
                                {proj.link && <ExternalLink size={14} className="text-slate-400" />}
                            </div>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{proj.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {proj.technologies.map((tech, t) => (
                                    <span key={t} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div className="mb-10">
                <SectionHeader title="Certifications" />
                <div className="grid grid-cols-2 gap-4">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="p-3 border border-slate-200 rounded hover:border-slate-300 transition-colors">
                            <div className="font-bold text-sm text-slate-800">{cert.name}</div>
                            <div className="text-xs text-slate-500 mt-1 flex justify-between">
                                <span>{cert.issuer}</span>
                                <span>{cert.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        education: education.length > 0 && (
            <div className="mb-10">
                <SidebarHeader title="Education" />
                <div className="space-y-6 mt-4">
                    {education.map((edu) => (
                        <div key={edu.id} className="relative pl-4 border-l-2 border-slate-200">
                            <div className="text-xs font-bold text-slate-500 mb-1">{edu.startDate} - {edu.endDate}</div>
                            <div className="font-bold text-slate-800 uppercase text-sm leading-tight mb-1">{edu.institution}</div>
                            <div className="text-sm text-slate-600 italic">{edu.degree}</div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-10">
                <SidebarHeader title="Skills" />
                <div className="space-y-4 mt-4">
                    {skills.map((group) => (
                        <div key={group.id}>
                            <div className="text-xs font-bold uppercase text-slate-400 mb-2">{group.category}</div>
                            <div className="flex flex-wrap gap-2">
                                {group.items.map((item, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 shadow-sm"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        languages: languages && languages.length > 0 && (
            <div className="mb-10">
                <SidebarHeader title="Languages" />
                <div className="space-y-2 mt-4">
                    {languages.map((lang: any, i: number) => (
                        <div key={i} className="flex justify-between items-center">
                            <span className="font-medium text-slate-700">{lang.name || lang}</span>
                            <span className="text-xs text-slate-500 uppercase">{lang.proficiency || 'Fluent'}</span>
                        </div>
                    ))}
                </div>
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-10">
                <SectionHeader title="Achievements" />
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )
    };

    // Column definitions
    const leftColumnIds = ['education', 'skills', 'languages'];
    const rightColumnIds = ['summary', 'experience', 'projects', 'certifications', 'achievements'];

    const defaultOrder = ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'languages', 'achievements'];
    const currentOrder = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    const leftSections = currentOrder.filter(id => leftColumnIds.includes(id));
    const rightSections = currentOrder.filter(id => rightColumnIds.includes(id));

    // Append missing
    leftColumnIds.forEach(id => { if (!leftSections.includes(id)) leftSections.push(id); });
    rightColumnIds.forEach(id => { if (!rightSections.includes(id)) rightSections.push(id); });

    const renderColumn = (sectionIds: string[]) => (
        <>
            {sectionIds.map(sectionId => {
                const content = sections[sectionId];
                if (!content) return null;
                const isMovable = ['skills', 'certifications', 'achievements'].includes(sectionId);
                return (
                    <SortableSection key={sectionId} id={sectionId} enabled={isMovable}>
                        {content}
                    </SortableSection>
                );
            })}
        </>
    );

    return (
        <div className={`bg-white shadow-2xl ${fontFamily} ${fontSize} mx-auto print:mx-0 flex flex-col`} style={{ width: '210mm', minHeight: '297mm' }}>

            {/* Top Header - More Premium Look */}
            <div className="relative pt-12 pb-10 px-12">
                {/* Decorative background element */}
                <div
                    className="absolute top-0 left-0 w-full h-4"
                    style={{ backgroundColor: colorTheme.primary }}
                ></div>

                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-extrabold mb-3 tracking-tight text-slate-900">
                            {personalInfo.fullName || 'RICHARD SANCHEZ'}
                        </h1>
                        <p
                            className="text-xl tracking-[0.2em] uppercase font-medium"
                            style={{ color: colorTheme.primary }}
                        >
                            {personalInfo.targetRole || 'Marketing Manager'}
                        </p>
                    </div>
                    {/* Optional: Add a placeholder for photo if we had one, or just keep it clean text */}
                </div>
            </div>

            <div className="flex flex-grow">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                        {/* Left Sidebar - Gray Background for contrast */}
                        <div className="w-[35%] p-8 bg-slate-50 border-r border-slate-100">

                            {/* Contact */}
                            <div className="mb-10">
                                <SidebarHeader title="Contact" />
                                <div className="space-y-4 text-sm text-slate-600 mt-4">
                                    {personalInfo.phone && (
                                        <div className="flex items-center gap-3 group">
                                            <div className="p-2 rounded-full bg-white shadow-sm text-slate-700 group-hover:text-white transition-colors" style={{ color: colorTheme.primary }}>
                                                <Phone size={16} />
                                            </div>
                                            <span className="font-medium">{personalInfo.phone}</span>
                                        </div>
                                    )}
                                    {personalInfo.email && (
                                        <div className="flex items-center gap-3 group">
                                            <div className="p-2 rounded-full bg-white shadow-sm text-slate-700 group-hover:text-white transition-colors" style={{ color: colorTheme.primary }}>
                                                <Mail size={16} />
                                            </div>
                                            <span className="font-medium break-all">{personalInfo.email}</span>
                                        </div>
                                    )}
                                    {personalInfo.location && (
                                        <div className="flex items-center gap-3 group">
                                            <div className="p-2 rounded-full bg-white shadow-sm text-slate-700 group-hover:text-white transition-colors" style={{ color: colorTheme.primary }}>
                                                <MapPin size={16} />
                                            </div>
                                            <span className="font-medium">{personalInfo.location}</span>
                                        </div>
                                    )}
                                    {personalInfo.website && (
                                        <div className="flex items-center gap-3 group">
                                            <div className="p-2 rounded-full bg-white shadow-sm text-slate-700 group-hover:text-white transition-colors" style={{ color: colorTheme.primary }}>
                                                <Globe size={16} />
                                            </div>
                                            <span className="font-medium break-all">{personalInfo.website}</span>
                                        </div>
                                    )}
                                    {personalInfo.linkedin && (
                                        <div className="flex items-center gap-3 group">
                                            <div className="p-2 rounded-full bg-white shadow-sm text-slate-700 group-hover:text-white transition-colors" style={{ color: colorTheme.primary }}>
                                                <Linkedin size={16} />
                                            </div>
                                            <span className="font-medium break-all">{personalInfo.linkedin.replace('https://linkedin.com/in/', '')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {renderColumn(leftSections)}
                        </div>

                        {/* Right Content */}
                        <div className="w-[65%] p-10 pt-8">
                            {renderColumn(rightSections)}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
