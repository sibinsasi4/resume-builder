import { ResumeData, ColorTheme } from '@/lib/types';
import { Phone, Mail, MapPin, Globe, Linkedin, ExternalLink, Calendar, Building2 } from 'lucide-react';
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

interface TimelineTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    spacing?: 'compact' | 'standard';
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function TimelineTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    spacing = 'standard',
    sectionOrder = [],
    onReorder
}: TimelineTemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements } = data;

    // Helper to get RGB values for opacity
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    };

    const primaryRgb = hexToRgb(colorTheme.primary);

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
            <div className="relative pl-4 border-l-4" style={{ borderColor: colorTheme.primary }}>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-slate-800">Professional Profile</h2>
                <p className="text-slate-600 leading-relaxed text-justify">
                    {summary}
                </p>
            </div>
        ),
        experience: experience.length > 0 && (
            <table className="w-full border-collapse">
                <thead className="print:table-header-group">
                    <tr>
                        <td className="pb-6">
                            <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2 text-slate-800">
                                <Building2 size={20} style={{ color: colorTheme.primary }} />
                                Work Experience
                            </h2>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {experience.map((exp) => (
                        <tr key={exp.id}>
                            <td className="relative pl-8 pb-8 border-l-2 border-slate-200 align-top">
                                {/* Timeline Dot */}
                                <div
                                    className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10"
                                    style={{ backgroundColor: colorTheme.primary }}
                                />

                                {/* Content Card */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow -mt-2">
                                    <div className="flex justify-between items-start mb-2 break-inside-avoid">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{exp.position}</h3>
                                            <div className="font-medium" style={{ color: colorTheme.secondary }}>{exp.company}</div>
                                        </div>
                                        <div
                                            className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap"
                                        >
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-400 mb-3 flex items-center gap-1 break-inside-avoid">
                                        <MapPin size={12} />
                                        {exp.location}
                                    </div>

                                    <ul className="space-y-2 text-sm text-slate-600">
                                        {exp.description.map((desc, idx) => (
                                            <li key={idx} className="flex items-start gap-2 break-inside-avoid">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-slate-300" />
                                                <span className="leading-relaxed">{desc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ),
        projects: projects.length > 0 && (
            <table className="w-full border-collapse">
                <thead className="print:table-header-group">
                    <tr>
                        <td className="pb-6">
                            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800">Key Projects</h2>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((proj) => (
                        <tr key={proj.id}>
                            <td className="pb-4">
                                <div className="bg-slate-50 p-4 rounded-lg border-l-4 break-inside-avoid" style={{ borderColor: colorTheme.accent }}>
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ),
        education: education.length > 0 && (
            <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b pb-2 border-slate-200 text-slate-800">Education</h2>
                <div className="space-y-4">
                    {education.map((edu) => (
                        <div key={edu.id} className="break-inside-avoid">
                            <div className="text-sm font-bold text-slate-800">{edu.institution}</div>
                            <div className="text-sm text-slate-600 italic mb-1">{edu.degree}</div>
                            <div className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded inline-block text-slate-500">
                                {edu.startDate} - {edu.endDate}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        skills: skills.length > 0 && (
            <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b pb-2 border-slate-200 text-slate-800">Skills</h2>
                <div className="space-y-4">
                    {skills.map((group) => (
                        <div key={group.id} className="break-inside-avoid">
                            <div className="text-xs font-bold uppercase text-slate-400 mb-2">{group.category}</div>
                            <div className="flex flex-wrap gap-2">
                                {group.items.map((item, i) => (
                                    <span
                                        key={i}
                                        className="px-2.5 py-1 rounded text-xs font-medium transition-colors"
                                        style={{
                                            backgroundColor: `rgba(${primaryRgb}, 0.1)`,
                                            color: colorTheme.primary
                                        }}
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
        certifications: certifications.length > 0 && (
            <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b pb-2 border-slate-200 text-slate-800">Certifications</h2>
                <div className="space-y-3">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="bg-slate-50 p-3 rounded border border-slate-100 break-inside-avoid">
                            <div className="font-bold text-sm text-slate-800">{cert.name}</div>
                            <div className="text-xs text-slate-500 mt-1">{cert.issuer}</div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        languages: languages && languages.length > 0 && (
            <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b pb-2 border-slate-200 text-slate-800">Languages</h2>
                <div className="space-y-2">
                    {languages.map((lang: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-700">{lang.name || lang}</span>
                            <span className="text-xs text-slate-400 uppercase">{lang.proficiency || 'Fluent'}</span>
                        </div>
                    ))}
                </div>
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b pb-2 border-slate-200 text-slate-800">Achievements</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )
    };

    // Column definitions
    const leftColumnIds = ['summary', 'experience', 'projects'];
    const rightColumnIds = ['education', 'skills', 'certifications', 'languages', 'achievements'];

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
        <div className={`bg-white ${fontFamily} ${fontSize} mx-auto print:mx-0 flex flex-col`} style={{ width: '210mm', minHeight: '297mm' }}>

            {/* Header Section with Gradient Accent */}
            <div className="relative p-8 pb-10 overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full h-2"
                    style={{ background: `linear-gradient(90deg, ${colorTheme.primary}, ${colorTheme.secondary})` }}
                />
                <div className="flex justify-between items-start mt-4">
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
                            {personalInfo.fullName || 'Your Name'}
                        </h1>
                        <p
                            className="text-xl font-medium tracking-wide uppercase"
                            style={{ color: colorTheme.primary }}
                        >
                            {personalInfo.targetRole || 'Target Role'}
                        </p>
                    </div>

                    {/* Contact Grid */}
                    <div className="text-sm space-y-2 text-right">
                        {personalInfo.email && (
                            <div className="flex items-center justify-end gap-2 text-slate-600">
                                <span>{personalInfo.email}</span>
                                <Mail size={14} style={{ color: colorTheme.primary }} />
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center justify-end gap-2 text-slate-600">
                                <span>{personalInfo.phone}</span>
                                <Phone size={14} style={{ color: colorTheme.primary }} />
                            </div>
                        )}
                        {personalInfo.location && (
                            <div className="flex items-center justify-end gap-2 text-slate-600">
                                <span>{personalInfo.location}</span>
                                <MapPin size={14} style={{ color: colorTheme.primary }} />
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center justify-end gap-2 text-slate-600">
                                <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                                <Linkedin size={14} style={{ color: colorTheme.primary }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-grow px-8 pb-8 flex gap-8 items-start">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                        {/* Left Column (Main Content) */}
                        <div className="w-2/3 space-y-8">
                            {renderColumn(leftSections)}
                        </div>

                        {/* Right Column (Sidebar) */}
                        <div className="w-1/3 space-y-8">
                            {renderColumn(rightSections)}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
