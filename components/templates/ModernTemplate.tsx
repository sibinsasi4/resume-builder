import { ResumeData, ColorTheme } from '@/lib/types';
import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink, Award, GraduationCap, Languages, User, Briefcase, Code, Star } from 'lucide-react';
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

interface ModernTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    spacing?: 'compact' | 'standard';
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function ModernTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    spacing = 'standard',
    sectionOrder = [],
    onReorder
}: ModernTemplateProps) {
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

    // Define column assignments
    // In Compact mode, move Achievements to sidebar to save vertical space in main column
    const sidebarSectionIds = ['education', 'skills', 'languages'];
    const mainSectionIds = ['summary', 'experience', 'projects', 'certifications', 'achievements'];

    if (spacing === 'compact' && experience.length > 2) {
        // Move Achievements to sidebar only if experience is long, to save space in main column
        const achievementIdx = mainSectionIds.indexOf('achievements');
        if (achievementIdx !== -1) mainSectionIds.splice(achievementIdx, 1);
        if (!sidebarSectionIds.includes('achievements')) sidebarSectionIds.push('achievements');

        // Move Certifications to sidebar as well if desired or if experience is long
        const certIdx = mainSectionIds.indexOf('certifications');
        if (certIdx !== -1) mainSectionIds.splice(certIdx, 1);
        if (!sidebarSectionIds.includes('certifications')) sidebarSectionIds.push('certifications');
    }

    // Define all sections
    const sections: Record<string, React.ReactNode> = {
        summary: summary && (
            <div className="break-inside-avoid mb-8">
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
        ),
        experience: experience.length > 0 && (
            <div className="mb-8">
                <h2
                    className="text-lg font-bold uppercase tracking-wider mb-6 border-b-2 pb-1 inline-block"
                    style={{ color: colorTheme.primary, borderColor: colorTheme.secondary }}
                >
                    Work Experience
                </h2>
                <div className={`${spacing === 'compact' ? 'space-y-4' : 'space-y-6'}`}>
                    {experience.map((exp) => (
                        <div key={exp.id} className="break-inside-avoid">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-xl text-slate-800">{exp.position}</h3>
                                <span className="text-sm font-bold text-slate-500 whitespace-nowrap">
                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                </span>
                            </div>

                            <div className={`flex items-center gap-2 ${spacing === 'compact' ? 'mb-2' : 'mb-3'} text-sm font-medium`} style={{ color: colorTheme.primary }}>
                                <span>{exp.company}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500 font-normal">{exp.location}</span>
                            </div>

                            <ul className={`list-disc list-outside ml-4 ${spacing === 'compact' ? 'space-y-1' : 'space-y-1.5'} text-slate-700 text-sm`}>
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
        ),
        education: education.length > 0 && (
            <div className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 opacity-90">
                    <GraduationCap size={16} /> Education
                </h2>
                <div className="space-y-4">
                    {education.map((edu) => (
                        <div key={edu.id} className="break-inside-avoid">
                            {/* Smart Fit: Inline Date to save vertical space */}
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-base leading-tight">{edu.degree}</div>
                                <div className="text-[10px] font-bold opacity-75 bg-white/10 px-1.5 py-0.5 rounded whitespace-nowrap ml-2 mt-0.5">
                                    {edu.startDate} - {edu.endDate}
                                </div>
                            </div>
                            <div className="text-sm opacity-90 mt-0.5">{edu.institution}</div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 opacity-90">
                    <Code size={16} /> Skills
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
        ),
        projects: projects.length > 0 && (
            <div className="mb-8">
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

                            {/* Smart Fit: In compact mode, show technologies as text line to save space */}
                            {spacing === 'compact' ? (
                                <div className="text-xs text-slate-500 font-medium">
                                    <span className="opacity-75">Tech stack:</span> {project.technologies.join(', ')}
                                </div>
                            ) : (
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
                            )}
                        </div>
                    ))}
                </div>
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div className="mb-8">
                <h2
                    className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 opacity-90 ${spacing === 'compact' && sidebarSectionIds.includes('certifications') ? 'mb-2' : ''}`}
                    style={sidebarSectionIds.includes('certifications') ? {} : { color: colorTheme.primary, borderColor: colorTheme.secondary }} // Use sidebar style if in sidebar
                >
                    {/* Icon switch if in sidebar vs main */}
                    {sidebarSectionIds.includes('certifications') ? <Award size={16} /> : null}
                    {sidebarSectionIds.includes('certifications') ? 'Certifications' : (
                        <span className={`text-lg border-b-2 pb-1 inline-block`} style={{ color: colorTheme.primary, borderColor: colorTheme.secondary }}>Certifications</span>
                    )}
                </h2>

                {/* Logic: If in Sidebar OR Compact mode, show as pills. Else show list. */}
                {(sidebarSectionIds.includes('certifications') || spacing === 'compact') ? (
                    <div className="flex flex-wrap gap-2">
                        {certifications.map((cert) => (
                            <div key={cert.id} className="break-inside-avoid max-w-full">
                                <span
                                    className="text-[11px] leading-tight font-medium px-2 py-1.5 rounded bg-white/10 border border-white/20 inline-flex items-center text-left"
                                >
                                    <span>{cert.name}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
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
                )}
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className={`${spacing === 'compact' ? 'mb-4' : 'mb-8'}`}>
                <h2
                    className={`font-bold uppercase tracking-wider ${sidebarSectionIds.includes('achievements') ? 'text-sm mb-3 flex items-center gap-2 opacity-90' : 'text-lg mb-4 border-b-2 pb-1 inline-block'}`}
                    style={sidebarSectionIds.includes('achievements') ? {} : { color: colorTheme.primary, borderColor: colorTheme.secondary }}
                >
                    {sidebarSectionIds.includes('achievements') && <Star size={16} />}
                    Achievements
                </h2>
                <ul className={`list-disc ${sidebarSectionIds.includes('achievements') ? 'list-inside space-y-1 opacity-95 text-sm' : 'list-outside ml-4 space-y-2 text-slate-700 text-sm'}`}>
                    {achievements.map((achievement, idx) => (
                        <li key={idx} className={`pl-1 leading-relaxed break-inside-avoid ${sidebarSectionIds.includes('achievements') ? '' : ''}`}>
                            {achievement}
                        </li>
                    ))}
                </ul>
            </div>
        ),
        languages: languages && languages.length > 0 && (
            <div className="mb-8">
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
        )
    };

    // Default order if none provided
    const defaultOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'languages'];
    const currentOrder = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    // Filter sections for each column based on current order
    // This allows reordering within columns but keeps sections in their assigned column
    const sidebarSections = currentOrder.filter(id => sidebarSectionIds.includes(id));
    const mainSections = currentOrder.filter(id => mainSectionIds.includes(id));

    // If a section is missing from order (e.g. new section added), append it
    sidebarSectionIds.forEach(id => {
        if (!sidebarSections.includes(id)) sidebarSections.push(id);
    });
    mainSectionIds.forEach(id => {
        if (!mainSections.includes(id)) mainSections.push(id);
    });

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
        <div className={`bg-white shadow-lg ${fontFamily} ${fontSize} mx-auto print:mx-0 flex`} style={{ width: '210mm', minHeight: '297mm' }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={currentOrder}
                    strategy={verticalListSortingStrategy}
                >
                    {/* Left Sidebar */}
                    <div className="w-1/3 p-8 flex flex-col gap-0 text-white" style={{ backgroundColor: colorTheme.primary }}>
                        {/* Profile Header (Fixed) */}
                        <div className="mb-8">
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

                        {/* Sidebar Sections */}
                        {renderColumn(sidebarSections)}
                    </div>

                    {/* Right Content */}
                    <div className="w-2/3 p-10 flex flex-col gap-0">
                        {/* Main Sections */}
                        {renderColumn(mainSections)}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
