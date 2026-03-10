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

interface DesignerTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    spacing?: 'compact' | 'standard';
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function DesignerTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    spacing = 'standard',
    sectionOrder = [],
    onReorder
}: DesignerTemplateProps) {
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
        skills: skills.length > 0 && (
            <div className="mb-6">
                <h3 className="font-bold mb-3 text-sm">SKILLS</h3>
                {skills.map((skillGroup) => (
                    <div key={skillGroup.id} className="mb-3">
                        <h4 className="font-semibold text-xs mb-1">{skillGroup.category}</h4>
                        <div className="text-xs opacity-90 space-y-1">
                            {skillGroup.items.map((item, idx) => (
                                <div key={idx}>• {item}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ),
        education: education.length > 0 && (
            <div>
                <h3 className="font-bold mb-3 text-sm">EDUCATION</h3>
                {education.map((edu) => (
                    <div key={edu.id} className="mb-3 text-xs">
                        <div className="font-bold">{edu.degree}</div>
                        <div className="opacity-90">{edu.field}</div>
                        <div className="opacity-75">{edu.institution}</div>
                        <div className="opacity-75">{edu.endDate}</div>
                    </div>
                ))}
            </div>
        ),
        summary: summary && (
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3" style={{ color: colorTheme.primary }}>About</h2>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: colorTheme.primary }}>Portfolio</h2>
                <div className="grid grid-cols-2 gap-4">
                    {projects.map((project) => (
                        <div key={project.id} className="border-2 p-4 rounded-lg" style={{ borderColor: colorTheme.accent }}>
                            <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                            <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {project.technologies.map((tech, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colorTheme.primary + '20', color: colorTheme.primary }}>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: colorTheme.primary }}>Experience</h2>
                {experience.map((exp) => (
                    <div key={exp.id} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="font-bold text-lg">{exp.position}</h3>
                            <span className="text-sm text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <p className="font-semibold text-gray-700 mb-2">{exp.company}</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                            {exp.description.map((desc, idx) => (
                                <li key={idx}>{desc}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: colorTheme.primary }}>Certifications</h2>
                <div className="grid grid-cols-2 gap-3">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="text-sm">
                            <h3 className="font-semibold">{cert.name}</h3>
                            <p className="text-gray-700">{cert.issuer}</p>
                        </div>
                    ))}
                </div>
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3" style={{ color: colorTheme.primary }}>Achievements</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )
    };

    // Column definitions
    const leftColumnIds = ['skills', 'education'];
    const rightColumnIds = ['summary', 'projects', 'experience', 'certifications', 'achievements'];

    const defaultOrder = ['summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements'];
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
        <div className={`bg-white ${fontFamily} ${fontSize} mx-auto print:mx-0 flex`} style={{ width: '210mm', minHeight: '297mm' }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                    {/* Left Column - Narrow */}
                    <div className="w-1/4 p-6" style={{ backgroundColor: colorTheme.primary, color: 'white' }}>
                        <div className="mb-6">
                            <div className="w-20 h-20 rounded-full bg-white/20 mb-4 flex items-center justify-center text-3xl font-bold">
                                {personalInfo.fullName?.charAt(0) || 'Y'}
                            </div>
                            <h1 className="text-2xl font-bold mb-1">{personalInfo.fullName || 'Your Name'}</h1>
                        </div>

                        {/* Contact */}
                        <div className="mb-6 text-sm space-y-2 opacity-90">
                            {personalInfo.email && <div className="break-all">{personalInfo.email}</div>}
                            {personalInfo.phone && <div>{personalInfo.phone}</div>}
                            {personalInfo.location && <div>{personalInfo.location}</div>}
                        </div>

                        {/* Links */}
                        {(personalInfo.linkedin || personalInfo.website) && (
                            <div className="mb-6 text-sm space-y-1">
                                <h3 className="font-bold mb-2">LINKS</h3>
                                {personalInfo.linkedin && <div className="opacity-90">LinkedIn</div>}
                                {personalInfo.website && <div className="opacity-90">Portfolio</div>}
                            </div>
                        )}

                        {renderColumn(leftSections)}
                    </div>

                    {/* Right Column - Wide */}
                    <div className="w-3/4 p-8">
                        {renderColumn(rightSections)}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
