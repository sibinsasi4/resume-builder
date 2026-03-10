'use client';

import { templateConfigs, colorThemes } from '@/lib/constants';

interface TemplateStepProps {
    selectedTemplate: string;
    onSelectTemplate: (id: string) => void;
    colorTheme: string;
    onSelectColorTheme: (id: string) => void;
    fontFamily: string;
    onSelectFontFamily: (id: string) => void;
    fontSize: string;
    onSelectFontSize: (id: string) => void;
}

export default function TemplateStep({
    selectedTemplate,
    onSelectTemplate,
    colorTheme,
    onSelectColorTheme,
    fontFamily,
    onSelectFontFamily,
    fontSize,
    onSelectFontSize,
}: TemplateStepProps) {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Choose Your Template
                </h2>
                <p className="text-slate-400 mt-2 text-lg">
                    Pick a design that matches your profession
                </p>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {templateConfigs.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    return (
                        <button
                            key={template.id}
                            onClick={() => onSelectTemplate(template.id)}
                            className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                                isSelected
                                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 scale-[1.02]'
                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:scale-[1.01]'
                            }`}
                        >
                            {/* Template preview placeholder */}
                            <div className={`w-full aspect-[3/4] rounded-lg mb-3 flex items-center justify-center text-4xl ${
                                isSelected ? 'bg-amber-500/20' : 'bg-slate-800'
                            }`}>
                                📄
                            </div>

                            <h3 className={`font-semibold text-sm ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                                {template.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                {template.description}
                            </p>

                            {/* Selected badge */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                                    <span className="text-xs text-slate-900 font-bold">✓</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Customization Row */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Color Theme */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">Color Theme</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {colorThemes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => onSelectColorTheme(theme.id)}
                                className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                                    colorTheme === theme.id
                                        ? 'border-white scale-110 shadow-lg'
                                        : 'border-transparent'
                                }`}
                                style={{ backgroundColor: theme.primary }}
                                title={theme.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Font Family */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">Font Style</h3>
                    <div className="space-y-2">
                        {[
                            { id: 'sans', label: 'Sans Serif', desc: 'Modern & clean' },
                            { id: 'serif', label: 'Serif', desc: 'Traditional & elegant' },
                            { id: 'mono', label: 'Monospace', desc: 'Tech & developer' },
                        ].map((font) => (
                            <button
                                key={font.id}
                                onClick={() => onSelectFontFamily(font.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                                    fontFamily === font.id
                                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                        : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                <span className={`text-sm font-medium ${font.id === 'serif' ? 'font-serif' : font.id === 'mono' ? 'font-mono' : 'font-sans'}`}>
                                    {font.label}
                                </span>
                                <span className="text-xs opacity-60">{font.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Font Size */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">Text Size</h3>
                    <div className="space-y-2">
                        {[
                            { id: 'small', label: 'Small', desc: 'Compact & dense' },
                            { id: 'medium', label: 'Medium', desc: 'Recommended' },
                            { id: 'large', label: 'Large', desc: 'Easy to read' },
                        ].map((size) => (
                            <button
                                key={size.id}
                                onClick={() => onSelectFontSize(size.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                                    fontSize === size.id
                                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                        : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                <span className="text-sm font-medium">{size.label}</span>
                                <span className="text-xs opacity-60">{size.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
