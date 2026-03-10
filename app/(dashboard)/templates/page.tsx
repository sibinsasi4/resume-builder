'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { resumeTemplates } from '@/lib/resumeTemplates';
import { Briefcase, TrendingUp, BarChart3, Palette, DollarSign, Check, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

const categoryIcons = {
    Technology: Briefcase,
    Marketing: TrendingUp,
    Business: BarChart3,
    Design: Palette,
    Sales: DollarSign,
};

const colorGradients: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    pink: 'from-pink-500 to-pink-600',
    orange: 'from-orange-500 to-orange-600',
    slate: 'from-slate-600 to-slate-700',
    indigo: 'from-indigo-500 to-indigo-600',
    teal: 'from-teal-500 to-teal-600',
    red: 'from-red-500 to-red-600',
};

import ResumeImportModal from '@/components/dashboard/ResumeImportModal';

export default function TemplateSelectionPage() {
    const router = useRouter();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Modal State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [targetTemplate, setTargetTemplate] = useState<{ id: string, name: string } | null>(null);

    // Filter templates based on search and category
    const filteredTemplates = useMemo(() => {
        return resumeTemplates.filter(template => {
            const matchesSearch = searchQuery === '' ||
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const categories = ['All', ...Array.from(new Set(resumeTemplates.map(t => t.category)))];

    // Triggered when user clicks "Use This Template"
    const handleTemplateClick = (templateId: string, templateName: string) => {
        setTargetTemplate({ id: templateId, name: templateName });
        setIsImportModalOpen(true);
    };

    // Called if user chooses "Start Blank" in the modal
    const handleStartBlank = async () => {
        if (!targetTemplate) return;

        try {
            setCreating(true);
            const template = resumeTemplates.find(t => t.id === targetTemplate.id);
            if (!template) return;

            // Create resume with template sample data
            const response = await fetch('/api/resumes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: `${template.name} Resume`,
                    templateType: template.id,
                    colorTheme: template.color,
                    data: template.data,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                router.push(`/editor/${data.resume.id}`);
            }
        } catch (error) {
            console.error('Failed to create resume:', error);
        } finally {
            setCreating(false);
            setIsImportModalOpen(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 relative z-10">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Choose Your Template
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Select a pre-filled template and customize it to your needs
                        </p>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search templates by role, skills, or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 overflow-x-auto">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mt-3 text-sm text-gray-500">
                        Showing {filteredTemplates.length} of {resumeTemplates.length} templates
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="mb-12">
                {filteredTemplates.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/20">
                        <p className="text-gray-400 text-lg">No templates found matching your search.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-4 text-blue-400 hover:text-blue-300 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => {
                            const Icon = categoryIcons[template.category as keyof typeof categoryIcons];
                            const isSelected = selectedTemplate === template.id;

                            return (
                                <div
                                    key={template.id}
                                    className={`bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/20 hover:transform hover:scale-[1.02] ${isSelected ? 'ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''
                                        }`}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    {/* Template Header */}
                                    <div className={`p-6 bg-gradient-to-br ${colorGradients[template.color] || 'from-blue-500 to-blue-600'} text-white`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon className="w-5 h-5" />
                                                    <span className="text-sm font-medium opacity-90">
                                                        {template.category}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-bold mb-2">
                                                    {template.name}
                                                </h3>
                                                <p className="text-sm opacity-90">
                                                    {template.description}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="bg-white text-blue-600 rounded-full p-1">
                                                    <Check className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Template Preview Info */}
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Complete profile information</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>{template.data.experience.length}+ years of experience</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>{template.data.skills.length}+ skill categories</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Professional summary included</span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTemplateClick(template.id, template.name);
                                            }}
                                            disabled={creating}
                                            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white border-0"
                                        >
                                            {creating && targetTemplate?.id === template.id
                                                ? 'Creating...'
                                                : 'Use This Template'}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-12 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-xl">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                        💡 How it works
                    </h3>
                    <ul className="space-y-2 text-blue-200/80">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 font-bold">1.</span>
                            <span>Choose a template that matches your profession</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 font-bold">2.</span>
                            <span>Either <strong>upload your existing resume</strong> or start from scratch</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 font-bold">3.</span>
                            <span>Our AI picks the relevant info and auto-fills your template</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 font-bold">4.</span>
                            <span>Review, edit, and download in minutes!</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Smart Import Modal */}
            <ResumeImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                templateId={targetTemplate?.id || 'modern'}
                templateName={targetTemplate?.name || 'Selected Template'}
                onSkip={handleStartBlank}
            />
        </div>
    );
}
