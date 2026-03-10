'use client';

import { Check } from 'lucide-react';

interface Step {
    id: number;
    label: string;
    icon: string;
}

const steps: Step[] = [
    { id: 1, label: 'Template', icon: '🎨' },
    { id: 2, label: 'Personal', icon: '👤' },
    { id: 3, label: 'Summary', icon: '📝' },
    { id: 4, label: 'Experience', icon: '💼' },
    { id: 5, label: 'Education', icon: '🎓' },
    { id: 6, label: 'Skills', icon: '🛠️' },
    { id: 7, label: 'Projects', icon: '📂' },
    { id: 8, label: 'Extras', icon: '✨' },
    { id: 9, label: 'Review', icon: '✅' },
];

interface StepIndicatorProps {
    currentStep: number;
    completedSteps: Set<number>;
    onStepClick: (step: number) => void;
}

export default function StepIndicator({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
    return (
        <div className="w-full">
            {/* Desktop view */}
            <div className="hidden md:flex items-center justify-between relative">
                {/* Background line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
                {/* Progress line */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = completedSteps.has(step.id);
                    const isClickable = isCompleted || step.id <= currentStep;

                    return (
                        <button
                            key={step.id}
                            onClick={() => isClickable && onStepClick(step.id)}
                            disabled={!isClickable}
                            className={`relative flex flex-col items-center gap-2 group z-10 transition-all duration-300 ${
                                isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                            }`}
                        >
                            {/* Step circle */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gradient-to-br from-amber-500 to-yellow-400 text-slate-900 scale-110 shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20'
                                        : isCompleted
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                        : 'bg-slate-800 text-slate-500 border border-white/10'
                                } ${isClickable && !isActive ? 'group-hover:scale-105 group-hover:border-amber-500/50' : ''}`}
                            >
                                {isCompleted && !isActive ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span className="text-xs">{step.icon}</span>
                                )}
                            </div>

                            {/* Step label */}
                            <span
                                className={`text-xs font-medium transition-colors duration-300 ${
                                    isActive
                                        ? 'text-amber-400'
                                        : isCompleted
                                        ? 'text-emerald-400'
                                        : 'text-slate-500'
                                }`}
                            >
                                {step.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Mobile view */}
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">
                        Step {currentStep} of {steps.length}
                    </span>
                    <span className="text-sm font-medium text-amber-400">
                        {steps[currentStep - 1]?.icon} {steps[currentStep - 1]?.label}
                    </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                </div>
                {/* Step dots */}
                <div className="flex justify-between mt-2 px-1">
                    {steps.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => (completedSteps.has(step.id) || step.id <= currentStep) && onStepClick(step.id)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                step.id === currentStep
                                    ? 'bg-amber-400 scale-150'
                                    : completedSteps.has(step.id)
                                    ? 'bg-emerald-400'
                                    : 'bg-white/10'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
