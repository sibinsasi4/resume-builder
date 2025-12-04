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

interface TechTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function TechTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    sectionOrder = [],
    onReorder
}: TechTemplateProps) {
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
            <div className="mb-6 p-4 bg-gray-50 border-l-4" style={{ borderColor: colorTheme.primary }}>
                <p className="text-gray-700">{summary}</p>
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 font-mono" style={{ color: colorTheme.primary }}>
                    // TECHNICAL SKILLS
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    {skills.map((skillGroup) => (
                        <div key={skillGroup.id} className="bg-gray-50 p-3 rounded">
                            <h3 className="font-semibold text-sm mb-1" style={{ color: colorTheme.primary }}>{skillGroup.category}</h3>
                            <div className="flex flex-wrap gap-2">
                                {skillGroup.items.map((item, idx) => (
                                    <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">{item}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 font-mono" style={{ color: colorTheme.primary }}>
                    // PROJECTS
                </h2>
                {projects.map((project) => (
                    <div key={project.id} className="mb-4 p-4 border-l-4 bg-gray-50" style={{ borderColor: colorTheme.accent }}>
                        <h3 className="font-bold text-lg">{project.name}</h3>
                        <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, idx) => (
                                <span key={idx} className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">{tech}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 font-mono" style={{ color: colorTheme.primary }}>
                    // EXPERIENCE
                </h2>
                {experience.map((exp) => (
                    <div key={exp.id} className="mb-4">
                        <div className="flex justify-between items-baseline mb-1">
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
        education: education.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 font-mono" style={{ color: colorTheme.primary }}>
                    // EDUCATION
                </h2>
                {education.map((edu) => (
                    <div key={edu.id} className="mb-2">
                        <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                        <p className="text-gray-700 text-sm">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 font-mono" style={{ color: colorTheme.primary }}>
                    // CERTIFICATIONS
                </h2>
                {certifications.map((cert) => (
                    <div key={cert.id} className="mb-2">
                        <h3 className="font-bold">{cert.name}</h3>
                        <p className="text-gray-700 text-sm">{cert.issuer}</p>
                    </div>
                ))}
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 font-mono" style={{ color: colorTheme.primary }}>
                    // ACHIEVEMENTS
                </h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )
    };

    const defaultOrder = ['summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'achievements'];
    const currentOrder = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    return (
        <div className={`bg-gray-50 ${fontFamily} ${fontSize} w-full mx-auto`} style={{ minHeight: '11in' }}>
            {/* Header */}
            <div className="bg-gray-900 text-white px-8 py-6">
                <h1 className="text-4xl font-bold mb-2 font-mono">{personalInfo.fullName || 'Your Name'}</h1>
                <div className="flex flex-wrap gap-4 text-sm opacity-90">
                    {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                    {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                    {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                </div>
                {(personalInfo.github || personalInfo.linkedin || personalInfo.website) && (
                    <div className="flex gap-4 text-sm mt-2" style={{ color: colorTheme.accent }}>
                        {personalInfo.github && (
                            <a
                                href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline"
                            >
                                <span>💻</span> GitHub
                            </a>
                        )}
                        {personalInfo.linkedin && (
                            <a
                                href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline"
                            >
                                <span>🔗</span> LinkedIn
                            </a>
                        )}
                        {personalInfo.website && (
                            <a
                                href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline"
                            >
                                <span>🌐</span> Portfolio
                            </a>
                        )}
                    </div>
                )}
            </div>

            <div className="px-8 py-6 bg-white">
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
