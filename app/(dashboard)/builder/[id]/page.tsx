'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BuilderWizard from '@/components/builder/BuilderWizard';

export default function EditBuilderPage() {
    const params = useParams();
    const router = useRouter();
    const { status } = useSession();
    const [resume, setResume] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await fetch(`/api/resumes/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    const fetchedResume = data.resume;

                    let parsedData;
                    try {
                        parsedData = fetchedResume.data ? JSON.parse(fetchedResume.data) : null;
                    } catch {
                        parsedData = null;
                    }

                    if (!parsedData || typeof parsedData !== 'object') {
                        parsedData = {
                            personalInfo: { fullName: '', email: '', phone: '', location: '' },
                            summary: '',
                            experience: [],
                            education: [],
                            skills: [],
                            projects: [],
                            certifications: [],
                            achievements: [],
                            sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'],
                        };
                    }

                    // Ensure all required fields
                    parsedData.personalInfo = parsedData.personalInfo || { fullName: '', email: '', phone: '', location: '' };
                    parsedData.summary = parsedData.summary || '';
                    parsedData.experience = Array.isArray(parsedData.experience) ? parsedData.experience : [];
                    parsedData.education = Array.isArray(parsedData.education) ? parsedData.education : [];
                    parsedData.skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
                    parsedData.projects = Array.isArray(parsedData.projects) ? parsedData.projects : [];
                    parsedData.certifications = Array.isArray(parsedData.certifications) ? parsedData.certifications : [];
                    parsedData.achievements = Array.isArray(parsedData.achievements) ? parsedData.achievements : [];
                    parsedData.sectionOrder = Array.isArray(parsedData.sectionOrder) ? parsedData.sectionOrder : [
                        'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements',
                    ];

                    setResume({ ...fetchedResume, data: parsedData });
                } else {
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Failed to fetch resume:', error);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchResume();
    }, [params.id]);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin" />
                        <div className="absolute inset-2 border-r-2 border-yellow-500 rounded-full animate-spin" />
                        <div className="absolute inset-4 border-b-2 border-purple-500 rounded-full animate-spin" />
                    </div>
                    <p className="mt-6 text-slate-400 animate-pulse font-medium">Loading your resume...</p>
                </div>
            </div>
        );
    }

    if (!resume) return null;

    return (
        <BuilderWizard
            resumeId={params.id as string}
            initialData={resume.data}
            initialTemplate={resume.templateType || 'modern'}
            initialColorTheme={resume.colorTheme || 'blue'}
            initialFontFamily={resume.fontFamily || 'sans'}
            initialFontSize={resume.fontSize || 'medium'}
            initialTitle={resume.title || 'Untitled Resume'}
        />
    );
}
