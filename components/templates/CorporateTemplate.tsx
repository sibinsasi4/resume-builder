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

interface CorporateTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function CorporateTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    sectionOrder = [],
    onReorder
}: CorporateTemplateProps) {
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
                <h2 className="text-xl font-bold mb-3 text-blue-900">PROFESSIONAL PROFILE</h2>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-blue-900">PROFESSIONAL EXPERIENCE</h2>
                {experience.map((exp) => (
                    <div key={exp.id} className="mb-5 pb-4 border-b border-gray-200 last:border-0">
                        <div className="flex justify-between items-baseline mb-2">
                            <div>
                                <h3 className="font-bold text-lg text-blue-900">{exp.position}</h3>
                                <p className="text-gray-700 font-semibold">{exp.company} | {exp.location}</p>
                            </div>
                            <span className="text-sm text-gray-600 whitespace-nowrap">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
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
                <h2 className="text-xl font-bold mb-3 text-blue-900">EDUCATION</h2>
                {education.map((edu) => (
                    <div key={edu.id} className="mb-3">
                        <h3 className="font-bold">{edu.degree}</h3>
                        <p className="text-gray-700">{edu.field}</p>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-blue-900">CORE SKILLS</h2>
                {skills.map((skillGroup) => (
                    <div key={skillGroup.id} className="mb-3">
                        <h3 className="font-semibold text-sm text-blue-900">{skillGroup.category}</h3>
                        <p className="text-gray-700 text-sm">{skillGroup.items.join(' • ')}</p>
                    </div>
                ))}
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-blue-900">KEY PROJECTS</h2>
                {projects.map((project) => (
                    <div key={project.id} className="mb-3">
                        <h3 className="font-bold">{project.name}</h3>
                        <p className="text-gray-700 text-sm">{project.description}</p>
                    </div>
                ))}
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div>
                <h2 className="text-xl font-bold mb-3 text-blue-900">CERTIFICATIONS</h2>
                <div className="grid grid-cols-2 gap-2">
                    {certifications.map((cert) => (
                        <div key={cert.id}>
                            <p className="font-semibold text-sm">{cert.name}</p>
                            <p className="text-xs text-gray-600">{cert.issuer}</p>
                        </div>
                    ))}
                </div>
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-blue-900">ACHIEVEMENTS</h2>
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
        <div className={`bg-white ${fontFamily} ${fontSize} w-full mx-auto`} style={{ minHeight: '11in' }}>
            {/* Header with Blue Background */}
            <div className="px-8 py-6" style={{ backgroundColor: '#1e40af', color: 'white' }}>
                <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
                <div className="flex flex-wrap gap-4 text-sm opacity-90">
                    {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                    {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                    {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                </div>
            </div>

            <div className="px-8 py-6">
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
