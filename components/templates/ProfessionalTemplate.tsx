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

interface ProfessionalTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    spacing?: 'compact' | 'standard';
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function ProfessionalTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    spacing = 'standard',
    sectionOrder = [],
    onReorder
}: ProfessionalTemplateProps) {
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
                <h2 className="text-sm font-bold uppercase mb-2 border-b pb-1" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>Professional Summary</h2>
                <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase mb-4 border-b pb-1" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>Work History</h2>
                <div className="space-y-5">
                    {experience.map((exp) => (
                        <div key={exp.id}>
                            <h3 className="font-bold text-gray-900">{exp.position}</h3>
                            <div className="flex justify-between items-center text-sm mb-2 mt-0.5">
                                <span className="font-semibold" style={{ color: colorTheme.secondary }}>{exp.company}</span>
                                <span className="text-gray-500 italic">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {exp.description.map((desc, idx) => (
                                    <li key={idx}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        ),
        education: education.length > 0 && (
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase mb-3 border-b pb-1" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>Education</h2>
                {education.map((edu) => (
                    <div key={edu.id} className="mb-3 text-sm">
                        <div className="font-bold">{edu.degree}</div>
                        <div className="text-gray-800">{edu.field}</div>
                        <div className="flex justify-between text-gray-500 italic mt-0.5">
                            <span>{edu.institution}</span>
                            <span>{edu.endDate}</span>
                        </div>
                    </div>
                ))}
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase mb-3 border-b pb-1" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>Skills</h2>
                <div className="space-y-3">
                    {skills.map((group) => (
                        <div key={group.id}>
                            <span className="text-xs font-bold uppercase text-gray-500 block mb-1">{group.category}</span>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-800">
                                {group.items.join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase mb-3 border-b pb-1" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>Key Projects</h2>
                {projects.map((project) => (
                    <div key={project.id} className="mb-3">
                        <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">{project.description}</p>
                        <div className="text-xs text-gray-500">
                            Stack: {project.technologies.join(', ')}
                        </div>
                    </div>
                ))}
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase mb-3 border-b pb-1" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>Certifications</h2>
                {certifications.map((cert) => (
                    <div key={cert.id} className="mb-2 text-sm">
                        <div className="font-semibold">{cert.name}</div>
                        <div className="text-xs text-gray-500">{cert.issuer}, {cert.date}</div>
                    </div>
                ))}
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase mb-3 border-b pb-1" style={{ borderColor: colorTheme.primary, color: colorTheme.primary }}>Achievements</h2>
                <ul className="list-disc list-inside text-sm text-gray-700">
                    {achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )
    };

    const defaultLeftOrder = ['skills', 'education', 'certifications'];
    const defaultRightOrder = ['summary', 'experience', 'projects', 'achievements'];

    // If sectionOrder is provided (single list), we need to split it intelligently or just use defaults for columns if DND across columns is tricky.
    // DND across columns in sortable requires unified list or specific handling. 
    // To allow full drag, we can use a simpler approach: 2 Columns, but items can't cross columns easily without complex logic.
    // For "Professional" standard, let's hardcode the layout columns but allow reordering WITHIN columns.
    // OR just use the standard reorder list and split it? 
    // Let's stick to the "Creative/Compact" approach -> SortableContext wraps everything, but visual layout is grid.

    // Actually, splitting a single reorderable list into 2 visual columns is hard because order determines visual position.
    // 1,2,3 -> Left, 4,5,6 -> Right? No.
    // Let's use the standard "Sidebar Sortable" pattern: Sidebar items are fixed set, Main items are fixed set unless we build a complex multi-container dnd.
    // For simplicity and stability: Split by predefined section IDs.

    const leftColumnIds = ['skills', 'education', 'certifications'];
    const rightColumnIds = ['summary', 'experience', 'projects', 'achievements'];

    const currentOrder = sectionOrder.length > 0 ? sectionOrder : [...leftColumnIds, ...rightColumnIds];
    const leftSections = currentOrder.filter(id => leftColumnIds.includes(id));
    const rightSections = currentOrder.filter(id => rightColumnIds.includes(id));

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
        <div className={`bg-white ${fontFamily} ${fontSize} mx-auto print:mx-0`} style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Header */}
            <div className="px-10 py-8 border-b-2 border-gray-100 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase mb-1">
                        {personalInfo.fullName || 'Your Name'}
                    </h1>
                    <p className="text-sm font-medium text-gray-500 tracking-widest uppercase" style={{ color: colorTheme.primary }}>
                        {personalInfo.targetRole || 'Target Role'}
                    </p>
                </div>
                <div className="text-right text-xs text-gray-600 space-y-1">
                    {personalInfo.email && <div className="font-medium">{personalInfo.email}</div>}
                    {personalInfo.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo.location && <div>{personalInfo.location}</div>}
                    <div className="flex gap-3 justify-end mt-1">
                        {personalInfo.linkedin && (
                            <span className="text-blue-600 font-bold">in</span>
                        )}
                        {personalInfo.website && (
                            <span className="text-blue-600 font-bold">www</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-[30%_70%] min-h-[calc(297mm-130px)]">
                {/* Left Sidebar (White, Border Right) */}
                <div className="p-8 border-r border-gray-100 bg-gray-50/30">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                            {renderColumn(leftSections)}
                        </SortableContext>
                    </DndContext>
                </div>

                {/* Right Content */}
                <div className="p-8">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                            {renderColumn(rightSections)}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </div>
    );
}
