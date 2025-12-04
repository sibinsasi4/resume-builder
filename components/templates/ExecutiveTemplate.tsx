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

interface ExecutiveTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function ExecutiveTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    sectionOrder = [],
    onReorder
}: ExecutiveTemplateProps) {
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
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                    EXECUTIVE SUMMARY
                </h2>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                    PROFESSIONAL EXPERIENCE
                </h2>
                {experience.map((exp) => (
                    <div key={exp.id} className="mb-5">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-lg">{exp.position}</h3>
                            <span className="text-sm text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <p className="font-semibold text-gray-700 mb-2">{exp.company} | {exp.location}</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
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
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                    EDUCATION
                </h2>
                {education.map((edu) => (
                    <div key={edu.id} className="mb-3">
                        <div className="flex justify-between items-baseline">
                            <div>
                                <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                                <p className="text-gray-700">{edu.institution}</p>
                            </div>
                            <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                        </div>
                    </div>
                ))}
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                    CORE COMPETENCIES
                </h2>
                {skills.map((skillGroup) => (
                    <div key={skillGroup.id} className="mb-2">
                        <span className="font-semibold">{skillGroup.category}: </span>
                        <span className="text-gray-700">{skillGroup.items.join(', ')}</span>
                    </div>
                ))}
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                    CERTIFICATIONS
                </h2>
                {certifications.map((cert) => (
                    <div key={cert.id} className="mb-2">
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-gray-700">{cert.issuer}</p>
                    </div>
                ))}
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                    PROJECTS
                </h2>
                {projects.map((project) => (
                    <div key={project.id} className="mb-3">
                        <h3 className="font-bold">{project.name}</h3>
                        <p className="text-gray-700">{project.description}</p>
                    </div>
                ))}
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>
                    ACHIEVEMENTS
                </h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )
    };

    const defaultOrder = ['summary', 'experience', 'education', 'skills', 'certifications', 'projects', 'achievements'];
    const currentOrder = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    return (
        <div className={`bg-white ${fontFamily} ${fontSize} w-full mx-auto`} style={{ minHeight: '11in' }}>
            {/* Header with accent bar */}
            <div className="relative">
                <div className="h-3" style={{ backgroundColor: colorTheme.primary }} />
                <div className="px-8 py-6">
                    <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                        {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                        {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                    </div>
                    {(personalInfo.linkedin || personalInfo.website) && (
                        <div className="flex gap-4 text-sm">
                            {personalInfo.linkedin && <span className="text-blue-600">LinkedIn</span>}
                            {personalInfo.website && <span className="text-blue-600">Website</span>}
                        </div>
                    )}
                </div>
            </div>

            <div className="px-8 pb-8">
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
