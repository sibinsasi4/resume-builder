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

interface SimpleTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    spacing?: 'compact' | 'standard';
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function SimpleTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    spacing = 'standard',
    sectionOrder = [],
    onReorder
}: SimpleTemplateProps) {
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
                <p className="text-gray-700 leading-relaxed text-lg">{summary}</p>
            </div>
        ),
        experience: experience.length > 0 && (
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
        ),
        education: education.length > 0 && (
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
        ),
        skills: skills.length > 0 && (
            <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Skills</h2>
                {skills.map((skillGroup) => (
                    <div key={skillGroup.id} className="mb-2">
                        <span className="font-semibold">{skillGroup.category}: </span>
                        <span className="text-gray-700">{skillGroup.items.join(', ')}</span>
                    </div>
                ))}
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Projects</h2>
                {projects.map((project) => (
                    <div key={project.id} className="mb-4">
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-gray-700">{project.description}</p>
                    </div>
                ))}
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Certifications</h2>
                {certifications.map((cert) => (
                    <div key={cert.id} className="mb-2">
                        <span className="font-semibold">{cert.name}</span>
                        <span className="text-gray-600"> — {cert.issuer}</span>
                    </div>
                ))}
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Achievements</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )
    };

    const defaultOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'];
    const currentOrder = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    return (
        <div className={`bg-white p-12 ${fontFamily} ${fontSize} mx-auto print:mx-0`} style={{ width: '210mm', minHeight: '297mm' }}>
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
    );
}
