'use client';

import { useState } from 'react';
import { ResumeData } from '@/lib/types';
import { Plus, Trash2, ChevronDown, ChevronUp, X, ExternalLink } from 'lucide-react';

interface ProjectsStepProps {
    data: ResumeData;
    onChange: (updates: Partial<ResumeData>) => void;
}

export default function ProjectsStep({ data, onChange }: ProjectsStepProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [techInputs, setTechInputs] = useState<Record<string, string>>({});

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const addProject = () => {
        const newProject = {
            id: Date.now().toString(),
            name: '',
            description: '',
            technologies: [],
            link: '',
        };
        onChange({ projects: [...(data.projects || []), newProject] });
        setExpandedIds((prev) => new Set([...prev, newProject.id]));
    };

    const updateProject = (index: number, field: string, value: any) => {
        const updated = [...(data.projects || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ projects: updated });
    };

    const removeProject = (index: number) => {
        const updated = [...(data.projects || [])];
        updated.splice(index, 1);
        onChange({ projects: updated });
    };

    const addTech = (index: number, tech: string) => {
        if (!tech.trim()) return;
        const updated = [...(data.projects || [])];
        if (updated[index].technologies.includes(tech.trim())) return;
        updated[index] = { ...updated[index], technologies: [...updated[index].technologies, tech.trim()] };
        onChange({ projects: updated });
        setTechInputs((prev) => ({ ...prev, [updated[index].id]: '' }));
    };

    const removeTech = (projIndex: number, techIndex: number) => {
        const updated = [...(data.projects || [])];
        const newTech = [...updated[projIndex].technologies];
        newTech.splice(techIndex, 1);
        updated[projIndex] = { ...updated[projIndex], technologies: newTech };
        onChange({ projects: updated });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Projects
                </h2>
                <p className="text-slate-400 mt-2">
                    Highlight your best work and side projects
                </p>
            </div>

            {/* Project cards */}
            <div className="space-y-3">
                {(data.projects || []).map((project, index) => {
                    const isExpanded = expandedIds.has(project.id);
                    return (
                        <div key={project.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all">
                            {/* Header */}
                            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggleExpand(project.id)}>
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-lg flex-shrink-0">
                                    📂
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium text-sm truncate">
                                        {project.name || `Project #${index + 1}`}
                                    </h4>
                                    {project.technologies.length > 0 && (
                                        <p className="text-xs text-slate-500 truncate">{project.technologies.join(' · ')}</p>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeProject(index); }}
                                    className="text-slate-600 hover:text-red-400 p-1 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </div>

                            {/* Expanded form */}
                            {isExpanded && (
                                <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 mb-1 block">Project Name</label>
                                        <input
                                            type="text"
                                            value={project.name || ''}
                                            onChange={(e) => updateProject(index, 'name', e.target.value)}
                                            placeholder="E-commerce Platform"
                                            className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 mb-1 block">Description</label>
                                        <textarea
                                            value={project.description || ''}
                                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                                            placeholder="Built a full-stack e-commerce platform with payment integration..."
                                            rows={3}
                                            className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 mb-1 block">Technologies Used</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {project.technologies.map((tech, techIdx) => (
                                                <span
                                                    key={techIdx}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20"
                                                >
                                                    {tech}
                                                    <button onClick={() => removeTech(index, techIdx)} className="hover:text-red-400">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={techInputs[project.id] || ''}
                                            onChange={(e) => setTechInputs((prev) => ({ ...prev, [project.id]: e.target.value }))}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTech(index, techInputs[project.id] || '');
                                                }
                                            }}
                                            placeholder="Type a technology and press Enter..."
                                            className="w-full px-3 py-2 rounded-lg text-white text-sm bg-slate-950/50 border border-dashed border-white/10 focus:border-purple-500 focus:outline-none placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 mb-1 block">
                                            <ExternalLink className="w-3 h-3 inline mr-1" />
                                            Project Link (optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={project.link || ''}
                                            onChange={(e) => updateProject(index, 'link', e.target.value)}
                                            placeholder="https://github.com/..."
                                            className="w-full px-3 py-2.5 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add button */}
            <button
                onClick={addProject}
                className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
                <Plus className="w-5 h-5" />
                Add Project
            </button>

            {(!data.projects || data.projects.length === 0) && (
                <div className="text-center py-6">
                    <p className="text-slate-500 text-sm">No projects added yet. Projects help showcase your practical skills!</p>
                </div>
            )}
        </div>
    );
}
