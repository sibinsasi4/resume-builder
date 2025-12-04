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

interface BoldTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function BoldTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    sectionOrder = [],
    onReorder
}: BoldTemplateProps) {
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
            <div className="mb-6 p-5 rounded-lg" style={{ backgroundColor: colorTheme.primary + '15' }}>
                <p className="text-gray-800 font-medium leading-relaxed">{summary}</p>
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-6">
                <h2 className="text-2xl font-black mb-4" style={{ color: colorTheme.primary }}>SKILLS</h2>
                {skills.map((skillGroup) => (
                    <div key={skillGroup.id} className="mb-4">
                        <h3 className="font-bold mb-2" style={{ color: colorTheme.secondary }}>{skillGroup.category}</h3>
                        <div className="flex flex-wrap gap-2">
                            {skillGroup.items.map((item, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 rounded-full text-white font-semibold text-sm"
                                    style={{ backgroundColor: colorTheme.primary }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-4">
                <h2 className="text-2xl font-black mb-3" style={{ color: colorTheme.primary }}>EXPERIENCE</h2>
                {experience.map((exp) => (
                    <div key={exp.id} className="mb-4 p-4 rounded-lg border-l-4 break-inside-avoid" style={{ borderColor: colorTheme.accent, backgroundColor: '#f9fafb' }}>
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="font-bold text-xl" style={{ color: colorTheme.secondary }}>{exp.position}</h3>
                            <span className="text-sm font-semibold text-gray-600">{exp.startDate} - {exp.current ? 'PRESENT' : exp.endDate}</span>
                        </div>
                        <p className="font-bold text-gray-700 mb-2">{exp.company} | {exp.location}</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                            {exp.description.map((desc, idx) => (
                                <li key={idx}>{desc}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        ),
        education: education.length > 0 && (
            <div className="mb-6">
                <h2 className="text-2xl font-black mb-4" style={{ color: colorTheme.primary }}>EDUCATION</h2>
                {education.map((edu) => (
                    <div key={edu.id} className="mb-3 p-3 rounded" style={{ backgroundColor: colorTheme.primary + '10' }}>
                        <h3 className="font-bold">{edu.degree}</h3>
                        <p className="text-gray-700 font-semibold">{edu.field}</p>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-600">{edu.endDate}</p>
                    </div>
                ))}
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-6">
                <h2 className="text-2xl font-black mb-4" style={{ color: colorTheme.primary }}>PROJECTS</h2>
                {projects.map((project) => (
                    <div key={project.id} className="mb-3 p-3 rounded" style={{ backgroundColor: colorTheme.accent + '20' }}>
                        <h3 className="font-bold">{project.name}</h3>
                        <p className="text-gray-700 text-sm">{project.description}</p>
                    </div>
                ))}
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div className="mb-6">
                <h2 className="text-2xl font-black mb-4" style={{ color: colorTheme.primary }}>CERTIFICATIONS</h2>
                <div className="flex flex-wrap gap-3">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: colorTheme.secondary }}>
                            {cert.name}
                        </div>
                    ))}
                </div>
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-6">
                <h2 className="text-2xl font-black mb-4" style={{ color: colorTheme.primary }}>ACHIEVEMENTS</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )
    };

    const defaultOrder = ['summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'achievements'];
    const currentOrder = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    return (
        <div className={`bg-white ${fontFamily} ${fontSize} w-full mx-auto`} style={{ minHeight: '11in' }}>
            {/* Bold Header */}
            <div className="p-8" style={{ background: `linear-gradient(135deg, ${colorTheme.primary} 0%, ${colorTheme.secondary} 100%)`, color: 'white' }}>
                <h1 className="text-5xl font-black mb-3">{personalInfo.fullName || 'YOUR NAME'}</h1>
                <div className="flex flex-wrap gap-4 text-lg font-semibold opacity-95">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>•</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span>•</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
            </div>

            <div className="p-8">
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
