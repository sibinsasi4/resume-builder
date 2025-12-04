'use client';

import { ResumeData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Trash2, Plus, GripVertical } from 'lucide-react';
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
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProjectsEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

interface SortableProjectItemProps {
    project: any;
    index: number;
    updateProject: (index: number, field: string, value: any) => void;
    removeProject: (index: number) => void;
    updateTechnologies: (index: number, value: string) => void;
}

function SortableProjectItem({
    project,
    index,
    updateProject,
    removeProject,
    updateTechnologies
}: SortableProjectItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border rounded-lg p-4 space-y-3 bg-gray-50 relative group"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-move text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200"
                    >
                        <GripVertical className="w-4 h-4" />
                    </button>
                    <h4 className="font-medium text-sm text-gray-700">Project #{index + 1}</h4>
                </div>
                <button
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-800"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium text-gray-600">Project Name</label>
                    <input
                        type="text"
                        value={project.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="E-commerce Platform"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-600">Link (optional)</label>
                    <input
                        type="text"
                        value={project.link || ''}
                        onChange={(e) => updateProject(index, 'link', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="https://github.com/..."
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-600">Description</label>
                <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={3}
                    placeholder="Describe the project and your role..."
                />
            </div>

            <div>
                <label className="text-xs font-medium text-gray-600">Technologies (comma-separated)</label>
                <input
                    type="text"
                    value={(project.technologies || []).join(', ')}
                    onChange={(e) => updateTechnologies(index, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="React, Node.js, MongoDB, AWS"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Separate technologies with commas
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium text-gray-600">Start Date (optional)</label>
                    <input
                        type="text"
                        value={project.startDate || ''}
                        onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="2023-01"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-600">End Date (optional)</label>
                    <input
                        type="text"
                        value={project.endDate || ''}
                        onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="2023-06"
                    />
                </div>
            </div>
        </div>
    );
}

export default function ProjectsEditor({ data, onChange }: ProjectsEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addProject = () => {
        const newProject = {
            id: Date.now().toString(),
            name: '',
            description: '',
            technologies: [],
            link: '',
            startDate: '',
            endDate: ''
        };

        onChange({
            ...data,
            projects: [...(data.projects || []), newProject]
        });
    };

    const updateProject = (index: number, field: string, value: any) => {
        const updated = [...(data.projects || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, projects: updated });
    };

    const removeProject = (index: number) => {
        const updated = [...(data.projects || [])];
        updated.splice(index, 1);
        onChange({ ...data, projects: updated });
    };

    const updateTechnologies = (index: number, value: string) => {
        const updated = [...(data.projects || [])];
        updated[index] = {
            ...updated[index],
            technologies: value.split(',').map(t => t.trim()).filter(Boolean)
        };
        onChange({ ...data, projects: updated });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = (data.projects || []).findIndex((item) => item.id === active.id);
            const newIndex = (data.projects || []).findIndex((item) => item.id === over.id);

            onChange({
                ...data,
                projects: arrayMove(data.projects || [], oldIndex, newIndex)
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Projects</h3>
                <Button size="sm" onClick={addProject}>
                    <Plus className="w-4 h-4 mr-1" /> Add Project
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={(data.projects || []).map(proj => proj.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {(data.projects || []).map((project, index) => (
                            <SortableProjectItem
                                key={project.id}
                                project={project}
                                index={index}
                                updateProject={updateProject}
                                removeProject={removeProject}
                                updateTechnologies={updateTechnologies}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {(!data.projects || data.projects.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    <p>No projects added yet.</p>
                    <p className="text-sm">Click "Add Project" to get started.</p>
                </div>
            )}
        </div>
    );
}
