'use client';

import { ResumeData } from '@/lib/types';
import { Progress } from '@/components/ui/Progress';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

interface QualityScoreProps {
    data: ResumeData;
}

export default function QualityScore({ data }: QualityScoreProps) {
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string[]>([]);

    useEffect(() => {
        calculateScore();
    }, [data]);

    const calculateScore = () => {
        let newScore = 0;
        const newFeedback: string[] = [];

        // 1. Personal Info (20 points)
        if (data.personalInfo.fullName) newScore += 5;
        if (data.personalInfo.email) newScore += 5;
        if (data.personalInfo.phone) newScore += 5;
        if (data.personalInfo.location) newScore += 5;
        else newFeedback.push("Add your location to personal info.");

        // 2. Summary (15 points)
        if (data.summary && data.summary.length > 50) {
            newScore += 15;
        } else if (data.summary) {
            newScore += 5;
            newFeedback.push("Summary is too short. Aim for 2-3 sentences.");
        } else {
            newFeedback.push("Add a professional summary.");
        }

        // 3. Experience (25 points)
        if (data.experience && data.experience.length > 0) {
            newScore += 15;
            const hasDescriptions = data.experience.every(exp => exp.description && exp.description.length > 0);
            if (hasDescriptions) newScore += 10;
            else newFeedback.push("Add bullet points to your experience descriptions.");
        } else {
            newFeedback.push("Add at least one work experience.");
        }

        // 4. Education (15 points)
        if (data.education && data.education.length > 0) {
            newScore += 15;
        } else {
            newFeedback.push("Add your education details.");
        }

        // 5. Skills (15 points)
        if (data.skills && data.skills.length > 0) {
            newScore += 10;
            const skillCount = data.skills.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
            if (skillCount >= 5) newScore += 5;
            else newFeedback.push("Add more skills (aim for 5+).");
        } else {
            newFeedback.push("Add a skills section.");
        }

        // 6. Projects/Certifications (10 points)
        if ((data.projects && data.projects.length > 0) || (data.certifications && data.certifications.length > 0)) {
            newScore += 10;
        } else {
            newFeedback.push("Add projects or certifications to stand out.");
        }

        setScore(newScore);
        setFeedback(newFeedback);
    };

    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-green-600';
        if (s >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressColor = (s: number) => {
        if (s >= 80) return 'bg-green-600';
        if (s >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    Resume Strength
                </h3>
                <span className={`font-bold text-lg ${getScoreColor(score)}`}>{score}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(score)}`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>

            {feedback.length > 0 ? (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase">Improvements needed:</p>
                    {feedback.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                        </div>
                    ))}
                    {feedback.length > 3 && (
                        <p className="text-xs text-gray-400 pl-5">And {feedback.length - 3} more...</p>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Great job! Your resume looks strong.</span>
                </div>
            )}
        </div>
    );
}
