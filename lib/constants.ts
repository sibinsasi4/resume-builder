import { ColorTheme, FontConfig, TemplateConfig } from './types';

export const colorThemes: ColorTheme[] = [
    {
        id: 'blue',
        name: 'Professional Blue',
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#38bdf8',
    },
    {
        id: 'purple',
        name: 'Creative Purple',
        primary: '#a855f7',
        secondary: '#9333ea',
        accent: '#c084fc',
    },
    {
        id: 'green',
        name: 'Fresh Green',
        primary: '#10b981',
        secondary: '#059669',
        accent: '#34d399',
    },
    {
        id: 'orange',
        name: 'Energetic Orange',
        primary: '#f97316',
        secondary: '#ea580c',
        accent: '#fb923c',
    },
    {
        id: 'red',
        name: 'Bold Red',
        primary: '#ef4444',
        secondary: '#dc2626',
        accent: '#f87171',
    },
    {
        id: 'teal',
        name: 'Modern Teal',
        primary: '#14b8a6',
        secondary: '#0d9488',
        accent: '#2dd4bf',
    },
    {
        id: 'indigo',
        name: 'Deep Indigo',
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#818cf8',
    },
    {
        id: 'slate',
        name: 'Classic Slate',
        primary: '#64748b',
        secondary: '#475569',
        accent: '#94a3b8',
    },
];

export const fontConfigs: FontConfig[] = [
    {
        id: 'sans',
        name: 'Sans Serif (Modern)',
        className: 'font-sans',
    },
    {
        id: 'serif',
        name: 'Serif (Traditional)',
        className: 'font-serif',
    },
    {
        id: 'mono',
        name: 'Monospace (Tech)',
        className: 'font-mono',
    },
];

export const templateConfigs: TemplateConfig[] = [
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional single-column layout, perfect for corporate roles',
        preview: '/templates/classic.png',
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Two-column design with sidebar, great for tech positions',
        preview: '/templates/modern.png',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Bold design with color blocks, ideal for creative fields',
        preview: '/templates/creative.png',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and simple, focuses on content',
        preview: '/templates/minimal.png',
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Polished corporate template for executive roles',
        preview: '/templates/professional.png',
    },
];
