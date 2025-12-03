'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, CheckCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        if (!token) {
            setError('Invalid or missing reset token');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to reset password');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 text-center max-w-md w-full">
                    <div className="text-red-400 mb-4">Invalid Link</div>
                    <p className="text-gray-400 mb-6">This password reset link is invalid or has expired.</p>
                    <Link href="/forgot-password">
                        <Button variant="outline" className="w-full">Request New Link</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6 text-purple-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                        <p className="text-gray-400 text-sm">
                            Enter your new password below.
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center">
                            <div className="flex flex-col items-center justify-center py-6">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
                                <p className="text-gray-400 mb-6">Your password has been successfully updated.</p>
                                <p className="text-sm text-gray-500">Redirecting to login...</p>
                            </div>
                            <Link href="/login">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    Login Now
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <Input
                                label="New Password"
                                type="password"
                                {...register('password')}
                                error={errors.password?.message}
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                {...register('confirmPassword')}
                                error={errors.confirmPassword?.message}
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
