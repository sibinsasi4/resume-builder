'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, MapPin, Clock, Building, ExternalLink, Lock, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PricingModal from '@/components/subscription/PricingModal';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary?: string;
    postedAt: string;
    applyUrl: string;
    description: string;
    source: string;
    isFresher?: boolean;
}

import { Suspense } from 'react';

function JobsContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [location, setLocation] = useState('');

    const searchParams = useSearchParams();
    const resumeId = searchParams.get('resumeId');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchJobs();
        }
    }, [status, router, resumeId]);

    const fetchJobs = async () => {
        try {
            const response = await fetch('/api/jobs/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId }),
            });

            if (response.ok) {
                const data = await response.json();
                setJobs(data.jobs);
                setSearchQuery(data.query);
                setLocation(data.location);
                setIsPremium(true);
            } else if (response.status === 403) {
                setIsPremium(false);
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = () => {
        setShowPricingModal(true);
    };

    if (loading) return <div className="p-8 text-center">Loading jobs...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <DashboardNavbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-blue-600" />
                            Job Matches
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Jobs matching your resume from the last 30 days
                        </p>
                    </div>
                    {isPremium && (
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                            Matching: "{searchQuery}"
                        </div>
                    )}
                </div>

                {!isPremium ? (
                    <div className="relative min-h-[400px] bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center p-8 overflow-hidden">
                        {/* Blurred Background Content */}
                        <div className="absolute inset-0 opacity-20 blur-sm pointer-events-none">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 border-b border-gray-200">
                                    <div className="h-6 w-1/3 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>

                        <div className="relative z-10 max-w-md">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Unlock Premium Job Matches
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Upgrade to Pro to see curated job openings matching your resume skills and experience, filtered for the last 30 days.
                            </p>
                            <Button
                                onClick={handleUpgrade}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl shadow-lg shadow-purple-500/25"
                            >
                                Upgrade to Unlock
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Direct Listings from Aggregated Sources */}
                        {jobs.length > 0 ? (
                            <div className="grid gap-4">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Top Matches from Jooble, RemoteOK & WWR
                                </h3>
                                {jobs.map((job) => (
                                    <Card key={job.id} className="p-6 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                                    {job.isFresher && (
                                                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">
                                                            Fresher Friendly
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 mb-3">
                                                    <Building className="w-4 h-4" />
                                                    <span className="font-medium">{job.company}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{job.location}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                                                        {job.type}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {job.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        Posted {new Date(job.postedAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1 font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                        <Search className="w-3 h-3" />
                                                        {job.source}
                                                    </div>
                                                    {job.salary && (
                                                        <div className="font-medium text-green-600">
                                                            {job.salary}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(job.applyUrl, '_blank')}
                                                className="ml-4 shrink-0"
                                            >
                                                Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No direct listings found via API</h3>
                                <p className="text-gray-500 max-w-md mx-auto mt-2">
                                    We couldn't fetch live jobs from RemoteOK for this query.
                                    Please use the <strong>platform links above</strong> to see all available jobs on LinkedIn, Indeed, etc.
                                </p>
                            </div>
                        )}

                        <PricingModal
                            isOpen={showPricingModal}
                            onClose={() => setShowPricingModal(false)}
                            onSelectPlan={async (plan: string, gateway: 'razorpay', couponCode?: string) => {
                                // Reuse existing payment logic from other pages
                                // For simplicity, redirecting to dashboard to pay
                                // In a real app, we'd duplicate the payment logic here or extract it to a hook
                                router.push('/dashboard');
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <JobsContent />
        </Suspense>
    );
}
