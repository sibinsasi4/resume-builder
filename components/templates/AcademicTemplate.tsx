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

interface AcademicTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    spacing?: 'compact' | 'standard';
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function AcademicTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    spacing = 'standard',
    sectionOrder = [],
    onReorder
}: AcademicTemplateProps) {
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
                <h2 className="text-lg font-bold mb-2 uppercase tracking-wide">Research Interests</h2>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
        ),
        education: education.length > 0 && (
            <div className="mb-6">
                <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Education</h2>
                {education.map((edu) => (
                    <div key={edu.id} className="mb-3">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                                <p className="text-gray-700 italic">{edu.institution}, {edu.location}</p>
                                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                            </div>
                            <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                        </div>
                    </div>
                ))}
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-6">
                <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Academic Experience</h2>
                {experience.map((exp) => (
                    <div key={exp.id} className="mb-4">
                        <div className="flex justify-between mb-1">
                            <div>
                                <h3 className="font-bold">{exp.position}</h3>
                                <p className="text-gray-700 italic">{exp.company}, {exp.location}</p>
                            </div>
                            <span className="text-sm text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                            {exp.description.map((desc, idx) => (
                                <li key={idx}>{desc}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-6">
                <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Publications & Research</h2>
                {projects.map((project, index) => (
                    <div key={project.id} className="mb-3">
                        <p className="text-gray-700">
                            <span className="font-semibold">{project.name}.</span> {project.description}
                        </p>
                        {project.technologies.length > 0 && (
                            <p className="text-sm text-gray-600 italic ml-4">
                                Keywords: {project.technologies.join(', ')}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-6">
                <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Research Methods & Skills</h2>
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
                <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Awards & Certifications</h2>
                {certifications.map((cert) => (
                    <div key={cert.id} className="mb-2">
                        <p className="text-gray-700">
                            <span className="font-semibold">{cert.name}</span>, {cert.issuer}
                            {cert.date && <span> ({cert.date})</span>}
                        </p>
                    </div>
                ))}
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-6">
                <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Achievements</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )
    };

    const defaultOrder = ['summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements'];
    const currentOrder = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    return (
        <div className={`bg-white p-8 ${fontFamily} ${fontSize} font-serif mx-auto print:mx-0`} style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
                <div className="text-sm text-gray-700">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.email && personalInfo.phone && <span className="mx-2">|</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span className="mx-2">|</span>}
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
