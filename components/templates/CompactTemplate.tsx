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

interface CompactTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function CompactTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    sectionOrder = [],
    onReorder
}: CompactTemplateProps) {
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
            <div className="mb-4">
                <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Profile</h2>
                <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-4">
                <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Experience</h2>
                {experience.map((exp) => (
                    <div key={exp.id} className="mb-3">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-sm">{exp.position}</h3>
                            <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                        </div>
                        <p className="text-xs text-gray-700 font-semibold">{exp.company} | {exp.location}</p>
                        <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-0.5">
                            {exp.description.map((desc, idx) => (
                                <li key={idx}>{desc}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        ),
        education: education.length > 0 && (
            <div className="mb-4">
                <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Education</h2>
                {education.map((edu) => (
                    <div key={edu.id} className="mb-2 text-xs">
                        <div className="font-bold">{edu.degree}</div>
                        <div className="text-gray-700">{edu.field}</div>
                        <div className="text-gray-600">{edu.institution}</div>
                        <div className="text-gray-500">{edu.endDate}</div>
                    </div>
                ))}
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-4">
                <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Skills</h2>
                {skills.map((skillGroup) => (
                    <div key={skillGroup.id} className="mb-2">
                        <h3 className="font-semibold text-xs">{skillGroup.category}</h3>
                        <div className="text-xs text-gray-700">
                            {skillGroup.items.map((item, idx) => (
                                <div key={idx}>• {item}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-4">
                <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Projects</h2>
                {projects.map((project) => (
                    <div key={project.id} className="mb-2">
                        <h3 className="font-bold text-xs">{project.name}</h3>
                        <p className="text-xs text-gray-700">{project.description}</p>
                        <p className="text-xs text-gray-600">
                            {project.technologies.join(', ')}
                        </p>
                    </div>
                ))}
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div className="mb-4">
                <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Certifications</h2>
                {certifications.map((cert) => (
                    <div key={cert.id} className="mb-2 text-xs">
                        <div className="font-semibold">{cert.name}</div>
                        <div className="text-gray-600">{cert.issuer}</div>
                    </div>
                ))}
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-4">
                <h2 className="text-sm font-bold mb-2 uppercase" style={{ color: colorTheme.primary }}>Achievements</h2>
                <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-0.5">
                    {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )
    };

    // Column definitions
    const leftColumnIds = ['skills', 'education', 'certifications'];
    const rightColumnIds = ['summary', 'experience', 'projects', 'achievements'];

    const defaultOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'];
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
        <div className={`bg-white p-6 ${fontFamily} ${fontSize} w-full mx-auto`} style={{ minHeight: '11in' }}>
            {/* Compact Header */}
            <div className="mb-4 pb-3 border-b-2" style={{ borderColor: colorTheme.primary }}>
                <h1 className="text-3xl font-bold" style={{ color: colorTheme.primary }}>
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-xs text-gray-600 mt-1">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span> | {personalInfo.phone}</span>}
                    {personalInfo.location && <span> | {personalInfo.location}</span>}
                </div>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Left Column - 1/3 */}
                        <div className="space-y-4">
                            {renderColumn(leftSections)}
                        </div>

                        {/* Right Column - 2/3 */}
                        <div className="col-span-2 space-y-4">
                            {renderColumn(rightSections)}
                        </div>
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
