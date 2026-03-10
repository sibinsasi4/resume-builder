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

interface CreativeTemplateProps {
    data: ResumeData;
    colorTheme: ColorTheme;
    fontFamily: string;
    fontSize: string;
    spacing?: 'compact' | 'standard';
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function CreativeTemplate({
    data,
    colorTheme,
    fontFamily,
    fontSize,
    spacing = 'standard',
    sectionOrder = [],
    onReorder
}: CreativeTemplateProps) {
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
                <h2 className="text-xl font-black mb-3 lowercase tracking-wide" style={{ color: colorTheme.primary }}>.profile</h2>
                <div className="p-4 rounded-br-2xl border-l-4" style={{ backgroundColor: colorTheme.secondary + '10', borderColor: colorTheme.secondary }}>
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                </div>
            </div>
        ),
        experience: experience.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-black mb-4 lowercase tracking-wide" style={{ color: colorTheme.primary }}>.experience</h2>
                {experience.map((exp) => (
                    <div key={exp.id} className="mb-6 relative pl-6 border-l-2 border-dashed border-gray-300">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorTheme.primary }}></div>
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-lg">{exp.position}</h3>
                            <span className="text-sm font-bold opacity-70" style={{ color: colorTheme.secondary }}>
                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                            </span>
                        </div>
                        <p className="font-semibold text-gray-700 mb-2">{exp.company}</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
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
                <h2 className="text-xl font-black mb-4 lowercase tracking-wide" style={{ color: colorTheme.primary }}>.education</h2>
                {education.map((edu) => (
                    <div key={edu.id} className="mb-4 bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="font-bold">{edu.degree}</h3>
                                <p className="text-gray-600 text-sm">{edu.field}</p>
                                <p className="text-gray-500 text-xs mt-1">{edu.institution}</p>
                            </div>
                            <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm text-gray-500">
                                {edu.startDate} - {edu.endDate}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        ),
        skills: skills.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-black mb-4 lowercase tracking-wide" style={{ color: colorTheme.primary }}>.skills</h2>
                <div className="flex flex-wrap gap-3">
                    {skills.flatMap(group => group.items).map((skill, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all hover:scale-105"
                            style={{ borderColor: colorTheme.secondary, color: colorTheme.primary }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        ),
        projects: projects.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-black mb-4 lowercase tracking-wide" style={{ color: colorTheme.primary }}>.projects</h2>
                <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                        <div key={project.id} className="border-2 rounded-xl p-4 border-gray-100 hover:border-gray-200 transition-colors">
                            <h3 className="font-bold text-lg mb-1">{project.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {project.technologies.map((tech, idx) => (
                                    <span key={idx} className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        #{tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        certifications: certifications.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-black mb-4 lowercase tracking-wide" style={{ color: colorTheme.primary }}>.certifications</h2>
                {certifications.map((cert) => (
                    <div key={cert.id} className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorTheme.secondary }}></div>
                        <div>
                            <span className="font-bold text-sm block">{cert.name}</span>
                            <span className="text-xs text-gray-500">{cert.issuer}</span>
                        </div>
                    </div>
                ))}
            </div>
        ),
        achievements: achievements.length > 0 && (
            <div className="mb-6">
                <h2 className="text-xl font-black mb-4 lowercase tracking-wide" style={{ color: colorTheme.primary }}>.achievements</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                    {achievements.map((achievement, idx) => (
                        <li key={idx} className="p-3 bg-gray-50 rounded-lg italic">
                            "{achievement}"
                        </li>
                    ))}
                </ul>
            </div>
        )
    };

    const defaultOrder = ['summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'achievements'];
    const currentOrder = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    return (
        <div className={`bg-white ${fontFamily} ${fontSize} mx-auto print:mx-0`} style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Creative Header: Large Initials + Details */}
            <div className="p-8 pb-4 flex justify-between items-start">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter mb-2" style={{ color: colorTheme.primary }}>
                        {personalInfo.fullName ? personalInfo.fullName.split(' ')[0] : 'Your'}
                        <span style={{ color: colorTheme.secondary }}>{personalInfo.fullName ? personalInfo.fullName.split(' ').slice(1).join(' ') : 'Name'}</span>
                    </h1>
                    <p className="text-xl font-medium tracking-widest uppercase text-gray-400">
                        {personalInfo.targetRole || 'Creative Director'}
                    </p>
                </div>
                <div className="text-right text-xs font-bold space-y-1" style={{ color: colorTheme.secondary }}>
                    {personalInfo.email && <div className="border-b pb-1 border-gray-100">{personalInfo.email}</div>}
                    {personalInfo.phone && <div className="border-b pb-1 border-gray-100">{personalInfo.phone}</div>}
                    {personalInfo.location && <div className="border-b pb-1 border-gray-100">{personalInfo.location}</div>}
                    {personalInfo.website && <div>{personalInfo.website}</div>}
                </div>
            </div>

            {/* Decorative Bar */}
            <div className="h-4 w-full mb-8 relative overflow-hidden">
                <div className="absolute inset-0 transform -skew-x-12 origin-left scale-110" style={{ backgroundColor: colorTheme.primary }}></div>
                <div className="absolute inset-0 transform skew-x-12 origin-right scale-110 opacity-50" style={{ backgroundColor: colorTheme.secondary }}></div>
            </div>

            <div className="px-8 pb-8">
                {onReorder ? (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                            <div className="grid grid-cols-12 gap-8">
                                {/* Split Layout: 4 cols left, 8 cols right */}
                                <div className="col-span-12 md:col-span-4 space-y-2">
                                    {/* Render sidebar items */}
                                    {currentOrder.filter(id => ['skills', 'education', 'certifications', 'contact'].includes(id)).map(id => (
                                        <SortableSection key={id} id={id} enabled={true}>
                                            {sections[id]}
                                        </SortableSection>
                                    ))}
                                    {/* Catch-all for missing sidebar items if not in list */}
                                    {/* Simplified for creativity: we just render specifics here or let user drag? 
                                         Standard logic: render list mapping. Let's start with single column if simplifying, 
                                         OR stick to the column logic. 
                                         Let's stick to a Column Map for true creative layout.
                                      */}
                                </div>
                                <div className="col-span-12 md:col-span-8 space-y-4">
                                    {currentOrder.filter(id => !['skills', 'education', 'certifications', 'contact'].includes(id)).map(id => (
                                        <SortableSection key={id} id={id} enabled={true}>
                                            {sections[id]}
                                        </SortableSection>
                                    ))}
                                </div>
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-4 space-y-2">
                            {['skills', 'education', 'certifications'].map(id => sections[id])}
                        </div>
                        <div className="col-span-8 space-y-4">
                            {['summary', 'experience', 'projects', 'achievements'].map(id => sections[id])}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
