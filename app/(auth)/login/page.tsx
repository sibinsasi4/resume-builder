'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInInput } from '@/lib/validations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Sparkles } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);

    const registered = searchParams.get('registered');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInInput) => {
        try {
            setLoading(true);
            setError('');

            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        try {
            setDemoLoading(true);
            setError('');

            // Use hardcoded demo credentials
            const result = await signIn('credentials', {
                email: 'demo@visish.com',
                password: 'demo123',
                redirect: false,
            });

            if (result?.error) {
                setError('Demo login failed. Please set up the database first.');
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError('Demo login failed. Database may not be configured.');
        } finally {
            setDemoLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            VISISH
                        </h1>
                    </div>
                    <p className="text-gray-400">Welcome back! Sign in to continue</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
                    {registered && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                            Account created successfully! Please sign in.
                        </div>
                    )}

                    {/* Demo Login Button */}
                    <button
                        onClick={handleDemoLogin}
                        disabled={demoLoading}
                        className="w-full mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Sparkles className="w-5 h-5" />
                        {demoLoading ? 'Setting up demo...' : 'Try Demo Account'}
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-900/50 text-gray-400">Or sign in with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            {...register('email')}
                            error={errors.email?.message}
                            placeholder="john@example.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />

                        <Input
                            label="Password"
                            type="password"
                            {...register('password')}
                            error={errors.password?.message}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />

                        <Button
                            type="submit"
                            className="w-full bg-white/10 hover:bg-white/20 border border-white/20"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">
                            Sign Up
                        </Link>
                    </p>
                </div>

                <p className="mt-4 text-center text-xs text-gray-500">
                    Demo account includes sample resume and full access to all features
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
