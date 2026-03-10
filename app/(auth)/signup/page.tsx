'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpInput } from '@/lib/validations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FeatureShowcase from '@/components/auth/FeatureShowcase';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpInput) => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to sign up');
            }

            // Redirect to login after successful signup
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 flex-col">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-slate-400">
                            Join thousands of professionals landing their dream jobs
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-2xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Full Name"
                                {...register('name')}
                                error={errors.name?.message}
                                placeholder="John Doe"
                                className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 transition-colors h-11"
                            />

                            <Input
                                label="Email"
                                type="email"
                                {...register('email')}
                                error={errors.email?.message}
                                placeholder="name@company.com"
                                className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 transition-colors h-11"
                            />

                            <Input
                                label="Password"
                                type="password"
                                {...register('password')}
                                error={errors.password?.message}
                                placeholder="••••••••"
                                className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 transition-colors h-11"
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                {...register('confirmPassword')}
                                error={errors.confirmPassword?.message}
                                placeholder="••••••••"
                                className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 transition-colors h-11"
                            />

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold h-11 shadow-lg shadow-amber-900/20 border-none mt-2"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </Button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-slate-900/50 backdrop-blur text-slate-500">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                                className="w-full p-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-slate-200"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Sign up with Google
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 group">
                                Sign In
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Mobile Footer */}
                <div className="mt-8 text-center text-xs text-slate-600 lg:hidden">
                    &copy; 2024 Visish. All rights reserved.
                </div>
            </div>

            {/* Right Side - Feature Showcase */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden items-center justify-center p-12">
                <FeatureShowcase />
            </div>
        </div>
    );
}
