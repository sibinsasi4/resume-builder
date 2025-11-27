import { z } from 'zod';

// Auth Validation Schemas

export const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const onboardingSchema = z.object({
    currentRole: z.string().min(2, 'Please enter your current role'),
    targetRole: z.string().min(2, 'Please enter your target role'),
    experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']),
});

// Resume Validation Schemas

export const personalInfoSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Valid phone number required'),
    location: z.string().min(2, 'Location is required'),
    linkedin: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
});

export const experienceSchema = z.object({
    company: z.string().min(2, 'Company name is required'),
    position: z.string().min(2, 'Position is required'),
    location: z.string().min(2, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.array(z.string()).min(1, 'Add at least one bullet point'),
});

export const educationSchema = z.object({
    institution: z.string().min(2, 'Institution name is required'),
    degree: z.string().min(2, 'Degree is required'),
    field: z.string().min(2, 'Field of study is required'),
    location: z.string().min(2, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    gpa: z.string().optional(),
    achievements: z.array(z.string()).optional(),
});

export const projectSchema = z.object({
    name: z.string().min(2, 'Project name is required'),
    description: z.string().min(10, 'Description is required'),
    technologies: z.array(z.string()).min(1, 'Add at least one technology'),
    link: z.string().url().optional().or(z.literal('')),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export const certificationSchema = z.object({
    name: z.string().min(2, 'Certification name is required'),
    issuer: z.string().min(2, 'Issuer is required'),
    date: z.string().min(1, 'Date is required'),
    expiryDate: z.string().optional(),
    credentialId: z.string().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
