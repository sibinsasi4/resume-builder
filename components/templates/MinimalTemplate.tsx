import { ResumeData, ColorTheme } from '@/lib/types';
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

interface MinimalTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    spacing?: 'compact' | 'standard';
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function MinimalTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    spacing = 'standard',
    sectionOrder = [],
    onReorder
}: MinimalTemplateProps) {
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements } = data;

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
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">About</span>
                <p className="text-gray-800 leading-relaxed text-sm max-w-2xl">{summary}</p>
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">Experience</span>
                <div className="space-y-6">
                    {experience.map((exp) => (
                        <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-4">
                            <div className="text-xs text-gray-500 font-medium pt-1">
                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                <div className="text-gray-600 text-sm mb-2">{exp.company}, {exp.location}</div>
                                <ul className="list-none space-y-1 text-sm text-gray-700">
                                    {exp.description.map((desc, idx) => (
                                        <li key={idx} className="relative pl-3">
                                            <span className="absolute left-0 top-1.5 w-1 h-1 bg-gray-300 rounded-full"></span>
                                            {desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        education: education.length > 0 && (
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">Education</span>
                {education.map((edu) => (
                    <div key={edu.id} className="grid grid-cols-[120px_1fr] gap-4 mb-4">
                        <div className="text-xs text-gray-500 font-medium pt-1">
                            {edu.startDate} — {edu.endDate}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                            <div className="text-sm text-gray-600">{edu.field}</div>
                            <div className="text-sm text-gray-500 italic">{edu.institution}</div>
                        </div>
                    </div>
                ))}
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">Skills</span>
                <div className="grid grid-cols-[120px_1fr] gap-4">
                    <div className="text-xs text-gray-500 pt-1">Expertise</div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {skills.map((group) => (
                            <div key={group.id}>
                                <span className="font-semibold text-xs uppercase text-gray-500 block mb-1">{group.category}</span>
                                <span className="text-sm text-gray-800">{group.items.join(', ')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">Projects</span>
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div key={project.id} className="grid grid-cols-[120px_1fr] gap-4">
                            <div className="text-xs text-gray-500 pt-1">Featured</div>
                            <div>
                                <h3 className="font-bold text-gray-900 inline-block mr-2">{project.name}</h3>
                                <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                                <div className="text-xs text-gray-500 font-mono">
                                    {project.technologies.join(' / ')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">Certifications</span>
                {certifications.map((cert) => (
                    <div key={cert.id} className="grid grid-cols-[120px_1fr] gap-4 mb-2">
                        <div className="text-xs text-gray-500 pt-1">{cert.date}</div>
                        <div>
                            <h3 className="font-semibold text-sm">{cert.name}</h3>
                            <div className="text-xs text-gray-500">{cert.issuer}</div>
                        </div>
                    </div>
                ))}
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">Achievements</span>
                <ul className="list-none space-y-2 text-sm text-gray-700 pl-[136px]">
                    {achievements.map((achievement, idx) => (
                        <li key={idx} className="relative">
                            <span className="absolute -left-4 top-2 w-1.5 h-px bg-gray-400"></span>
                            {achievement}
                        </li>
                    ))}
                </ul>
            </div>
        )
    };

    const defaultOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'];
    const currentOrder = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    return (
        <div className={`bg-white ${fontFamily} ${fontSize} mx-auto print:mx-0`} style={{ width: '210mm', minHeight: '297mm' }}>
            <div className="p-16">
                {/* Minimal Header */}
                <div className="mb-16">
                    <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
                        {personalInfo.fullName || 'Your Name'}
                    </h1>
                    <p className="text-sm tracking-widest uppercase text-gray-500 mb-6">
                        {personalInfo.targetRole || 'Professional Role'}
                    </p>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600 font-medium">
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                        {personalInfo.linkedin && (
                            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                                LinkedIn
                            </a>
                        )}
                        {personalInfo.website && (
                            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                                Portfolio
                            </a>
                        )}
                    </div>
                </div>

                {onReorder ? (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                            {currentOrder.map((sectionId) => {
                                const content = sections[sectionId];
                                if (!content) return null;
                                const isMovable = ['skills', 'certifications', 'achievements'].includes(sectionId);
                                return (
                                    <SortableSection key={sectionId} id={sectionId} enabled={isMovable}>
                                        {content}
                                    </SortableSection>
                                );
                            })}
                        </SortableContext>
                    </DndContext>
                ) : (
                    currentOrder.map((sectionId) => sections[sectionId])
                )}
            </div>
        </div>
    );
}
