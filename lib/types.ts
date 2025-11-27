// Resume Data Types

export interface ResumeData {
    personalInfo: PersonalInfo;
    summary?: string;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
    achievements: string[];
    languages?: Language[];
    hobbies?: string[];
}

export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
    portfolio?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    achievements?: string[];
}

export interface Skill {
    id: string;
    category: string;
    items: string[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    startDate?: string;
    endDate?: string;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
}

export interface Language {
    id: string;
    name: string;
    proficiency: string;
}

// Template Types

export type TemplateType = 'classic' | 'modern' | 'creative' | 'minimal' | 'professional';

export interface TemplateConfig {
    id: TemplateType;
    name: string;
    description: string;
    preview: string;
}

// Color Theme Types

export interface ColorTheme {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    accent: string;
}

// Font Types

export type FontFamily = 'sans' | 'serif' | 'mono';

export interface FontConfig {
    id: FontFamily;
    name: string;
    className: string;
}

// Analysis Types

export interface JobAnalysisResult {
    atsScore: number;
    matchScore: number;
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    swotAnalysis: SwotAnalysis;
    suggestions: ResumeSuggestion[];
    recommendation: Recommendation;
}

export interface SwotAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
}

export interface ResumeSuggestion {
    section: string;
    type: 'add' | 'modify' | 'remove';
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
}

export interface Recommendation {
    decision: 'strongly-apply' | 'apply-with-improvements' | 'upskill-first';
    reasoning: string;
    confidence: number;
}

// Job Description Types

export interface ParsedJobDescription {
    title: string;
    requiredSkills: string[];
    preferredSkills: string[];
    experienceLevel: string;
    keywords: string[];
    tools: string[];
    education: string[];
}

// Canvas Editor Types

export type ElementType = 'text' | 'header' | 'image' | 'bar' | 'icon' | 'shape' | 'list';

export interface CanvasElement {
    id: string;
    type: ElementType;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    properties: ElementProperties;
    zIndex: number;
    rotation?: number;
    locked?: boolean;
}

export interface ElementProperties {
    // Text properties
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold' | 'semibold';
    color?: string;
    backgroundColor?: string;
    alignment?: 'left' | 'center' | 'right' | 'justify';

    // Border properties
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    borderRadius?: number;

    // Image properties
    imageUrl?: string;
    objectFit?: 'cover' | 'contain' | 'fill';

    // Icon properties
    iconName?: string;
    iconSize?: number;

    // Bar properties
    barThickness?: number;
    barStyle?: 'solid' | 'dashed' | 'dotted' | 'gradient';

    // Shape properties
    shapeType?: 'rectangle' | 'circle' | 'line';
    fillColor?: string;

    // List properties
    listType?: 'bullet' | 'numbered';
    listItems?: string[];

    // Shadow
    shadow?: boolean;
    shadowColor?: string;
    shadowBlur?: number;

    // Opacity
    opacity?: number;
}

export interface CanvasData {
    elements: CanvasElement[];
    canvasSize: {
        width: number;
        height: number;
    };
    backgroundColor: string;
    gridEnabled: boolean;
    gridSize: number;
    zoom: number;
}

export interface EditorMode {
    mode: 'form' | 'canvas';
    formData?: ResumeData;
    canvasData?: CanvasData;
}
