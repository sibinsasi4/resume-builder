'use client';

import { ResumeData } from '@/lib/types';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface PersonalInfoStepProps {
    data: ResumeData;
    onChange: (updates: Partial<ResumeData>) => void;
}

export default function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
    const updateField = (field: string, value: string) => {
        onChange({
            personalInfo: {
                ...data.personalInfo,
                [field]: value,
            },
        });
    };

    const fields = [
        { key: 'fullName', label: 'Full Name', icon: User, placeholder: 'John Doe', type: 'text', required: true, colSpan: 2 },
        { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'john@example.com', type: 'email', required: true },
        { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+1 (555) 123-4567', type: 'tel', required: true },
        { key: 'location', label: 'Location', icon: MapPin, placeholder: 'San Francisco, CA', type: 'text', required: true },
        { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/johndoe', type: 'text' },
        { key: 'github', label: 'GitHub', icon: Github, placeholder: 'github.com/johndoe', type: 'text' },
        { key: 'website', label: 'Portfolio / Website', icon: Globe, placeholder: 'johndoe.dev', type: 'text', colSpan: 2 },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Personal Information
                </h2>
                <p className="text-slate-400 mt-2">
                    Let&apos;s start with your contact details
                </p>
            </div>

            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {fields.map((field) => {
                        const Icon = field.icon;
                        const value = (data.personalInfo as any)?.[field.key] || '';
                        return (
                            <div
                                key={field.key}
                                className={field.colSpan === 2 ? 'md:col-span-2' : ''}
                            >
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Icon className="w-4 h-4 text-slate-500" />
                                    {field.label}
                                    {field.required && <span className="text-amber-400">*</span>}
                                </label>
                                <input
                                    type={field.type}
                                    value={value}
                                    onChange={(e) => updateField(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className={`w-full px-4 py-3 rounded-xl text-white text-sm transition-all duration-200
                                        bg-slate-950 border focus:outline-none focus:ring-2 focus:ring-amber-500/50
                                        placeholder:text-slate-600
                                        ${field.required && !value
                                            ? 'border-white/10 hover:border-white/20'
                                            : value
                                            ? 'border-emerald-500/30 bg-emerald-500/5'
                                            : 'border-white/10 hover:border-white/20'
                                        }`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-300 text-sm">
                    💡 <strong>Tip:</strong> Make sure your email and phone are professional and up-to-date. 
                    Adding LinkedIn and GitHub can boost your profile for tech roles.
                </p>
            </div>
        </div>
    );
}
