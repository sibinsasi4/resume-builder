'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, OnboardingInput } from '@/lib/validations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OnboardingInput>({
        resolver: zodResolver(onboardingSchema),
    });

    const onSubmit = async (data: OnboardingInput) => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/user/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save onboarding data');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Welcome to VISISH!
                    </h1>
                    <p className="text-gray-600">Let's personalize your experience</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="What is your current role?"
                            {...register('currentRole')}
                            error={errors.currentRole?.message}
                            placeholder="e.g., Software Engineer, Student, etc."
                        />

                        <Input
                            label="What is your target role?"
                            {...register('targetRole')}
                            error={errors.targetRole?.message}
                            placeholder="e.g., Senior Software Engineer, Product Manager, etc."
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience Level
                            </label>
                            <select
                                {...register('experienceLevel')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select your experience level</option>
                                <option value="entry">Entry Level (0-2 years)</option>
                                <option value="mid">Mid Level (2-5 years)</option>
                                <option value="senior">Senior Level (5-10 years)</option>
                                <option value="lead">Lead/Principal (10+ years)</option>
                            </select>
                            {errors.experienceLevel && (
                                <p className="mt-1 text-sm text-red-600">{errors.experienceLevel.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Saving...' : 'Continue to Dashboard'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
