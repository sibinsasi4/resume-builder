'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save, Eye, EyeOff } from 'lucide-react';
import StepIndicator from './StepIndicator';
import TemplateStep from './steps/TemplateStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import SummaryStep from './steps/SummaryStep';
import ExperienceStep from './steps/ExperienceStep';
import EducationStep from './steps/EducationStep';
import SkillsStep from './steps/SkillsStep';
import ProjectsStep from './steps/ProjectsStep';
import ExtrasStep from './steps/ExtrasStep';
import ReviewStep from './steps/ReviewStep';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import { ResumeData, TemplateType } from '@/lib/types';
import { colorThemes } from '@/lib/constants';

interface BuilderWizardProps {
    resumeId?: string;
    initialData?: ResumeData;
    initialTemplate?: string;
    initialColorTheme?: string;
    initialFontFamily?: string;
    initialFontSize?: string;
    initialTitle?: string;
}

const defaultResumeData: ResumeData = {
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'],
};

export default function BuilderWizard({
    resumeId,
    initialData,
    initialTemplate = 'modern',
    initialColorTheme = 'blue',
    initialFontFamily = 'sans',
    initialFontSize = 'medium',
    initialTitle = 'Untitled Resume',
}: BuilderWizardProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(resumeId ? 9 : 1);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(
        new Set(resumeId ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [])
    );
    const [resumeData, setResumeData] = useState<ResumeData>(initialData || defaultResumeData);
    const [templateType, setTemplateType] = useState<string>(initialTemplate);
    const [colorTheme, setColorTheme] = useState<string>(initialColorTheme);
    const [fontFamily, setFontFamily] = useState<string>(initialFontFamily);
    const [fontSize, setFontSize] = useState<string>(initialFontSize);
    const [title, setTitle] = useState<string>(initialTitle);
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedResumeId, setSavedResumeId] = useState<string | undefined>(resumeId);
    const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isFitToPage, setIsFitToPage] = useState(false);

    // Auto-generate title from personal info
    useEffect(() => {
        if (resumeData.personalInfo.fullName && title === 'Untitled Resume') {
            setTitle(`${resumeData.personalInfo.fullName}'s Resume`);
        }
    }, [resumeData.personalInfo.fullName]);

    // Auto-save debounce
    const triggerAutoSave = useCallback(() => {
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        const timer = setTimeout(() => {
            saveResume(true);
        }, 3000);
        setAutoSaveTimer(timer);
    }, [autoSaveTimer, resumeData, templateType, colorTheme, fontFamily, fontSize, title]);

    const saveResume = async (isAutoSave = false) => {
        if (saving) return;
        try {
            setSaving(true);
            const body = {
                title,
                templateType,
                colorTheme,
                fontFamily,
                fontSize,
                data: JSON.stringify(resumeData),
            };

            if (savedResumeId) {
                // Update existing
                const response = await fetch(`/api/resumes/${savedResumeId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                if (response.ok) {
                    setLastSaved(new Date());
                }
            } else {
                // Create new
                const response = await fetch('/api/resumes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                if (response.ok) {
                    const data = await response.json();
                    setSavedResumeId(data.resume.id);
                    setLastSaved(new Date());
                    // Update URL without full navigation
                    window.history.replaceState({}, '', `/builder/${data.resume.id}`);
                }
            }
        } catch (error) {
            console.error('Failed to save resume:', error);
            if (!isAutoSave) alert('Failed to save resume');
        } finally {
            setSaving(false);
        }
    };

    const updateResumeData = useCallback((updates: Partial<ResumeData>) => {
        setResumeData(prev => ({ ...prev, ...updates }));
        triggerAutoSave();
    }, [triggerAutoSave]);

    const goToStep = (step: number) => {
        // Mark current step as completed
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(step);
    };

    const nextStep = () => {
        if (currentStep < 9) {
            goToStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <TemplateStep
                        selectedTemplate={templateType}
                        onSelectTemplate={setTemplateType}
                        colorTheme={colorTheme}
                        onSelectColorTheme={setColorTheme}
                        fontFamily={fontFamily}
                        onSelectFontFamily={setFontFamily}
                        fontSize={fontSize}
                        onSelectFontSize={setFontSize}
                    />
                );
            case 2:
                return (
                    <PersonalInfoStep
                        data={resumeData}
                        onChange={updateResumeData}
                    />
                );
            case 3:
                return (
                    <SummaryStep
                        data={resumeData}
                        onChange={updateResumeData}
                    />
                );
            case 4:
                return (
                    <ExperienceStep
                        data={resumeData}
                        onChange={updateResumeData}
                    />
                );
            case 5:
                return (
                    <EducationStep
                        data={resumeData}
                        onChange={updateResumeData}
                    />
                );
            case 6:
                return (
                    <SkillsStep
                        data={resumeData}
                        onChange={updateResumeData}
                    />
                );
            case 7:
                return (
                    <ProjectsStep
                        data={resumeData}
                        onChange={updateResumeData}
                    />
                );
            case 8:
                return (
                    <ExtrasStep
                        data={resumeData}
                        onChange={updateResumeData}
                    />
                );
            case 9:
                return (
                    <ReviewStep
                        data={resumeData}
                        templateType={templateType}
                        colorTheme={colorTheme}
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        isFitToPage={isFitToPage}
                        onToggleFitToPage={() => setIsFitToPage(!isFitToPage)}
                        onChangeTemplate={setTemplateType}
                        onChangeColorTheme={setColorTheme}
                        onChangeFontFamily={setFontFamily}
                        onChangeFontSize={setFontSize}
                        onSave={() => saveResume(false)}
                        saving={saving}
                        resumeId={savedResumeId}
                        title={title}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen">
            {/* Top Bar */}
            <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" /> Dashboard
                            </button>
                            <div className="w-px h-6 bg-white/10" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-lg font-semibold bg-transparent text-white border-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded px-2 placeholder:text-slate-500 max-w-[300px]"
                                placeholder="Resume Title"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            {lastSaved && (
                                <span className="text-xs text-slate-500 hidden sm:block">
                                    Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                            {currentStep > 1 && currentStep < 9 && (
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                                >
                                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
                                </button>
                            )}
                            <button
                                onClick={() => saveResume(false)}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-all disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <StepIndicator
                        currentStep={currentStep}
                        completedSteps={completedSteps}
                        onStepClick={goToStep}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className={`${showPreview && currentStep > 1 && currentStep < 9 ? 'grid lg:grid-cols-2 gap-8' : ''}`}>
                    {/* Step Content */}
                    <div className="min-w-0">
                        {/* Step content area with animation */}
                        <div className="animate-in fade-in duration-300">
                            {renderStep()}
                        </div>

                        {/* Navigation */}
                        {currentStep < 9 && (
                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>
                                <div className="flex items-center gap-3">
                                    {currentStep >= 2 && currentStep <= 8 && (
                                        <button
                                            onClick={() => goToStep(9)}
                                            className="px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 transition-all"
                                        >
                                            Skip to Review →
                                        </button>
                                    )}
                                    <button
                                        onClick={nextStep}
                                        className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 hover:scale-[1.02]"
                                    >
                                        Next Step <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Preview Panel */}
                    {showPreview && currentStep > 1 && currentStep < 9 && (
                        <div className="hidden lg:block">
                            <div className="sticky top-36">
                                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-slate-400 mb-3">Live Preview</h3>
                                    <div
                                        className="bg-white rounded-lg overflow-hidden shadow-2xl"
                                        style={{
                                            transform: 'scale(0.55)',
                                            transformOrigin: 'top left',
                                            width: '181.8%',
                                        }}
                                    >
                                        <TemplateRenderer
                                            templateType={templateType as TemplateType}
                                            data={resumeData}
                                            colorThemeId={colorTheme}
                                            fontFamily={fontFamily}
                                            fontSize={fontSize}
                                            spacing={isFitToPage ? 'compact' : 'standard'}
                                            sectionOrder={resumeData.sectionOrder || []}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
