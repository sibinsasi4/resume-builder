'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeData, TemplateType } from '@/lib/types';
import { templateConfigs, colorThemes } from '@/lib/constants';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import QualityScore from '@/components/editor/QualityScore';
import PricingModal from '@/components/subscription/PricingModal';
import { Download, Save, Sparkles, PartyPopper, CheckCircle2 } from 'lucide-react';

interface ReviewStepProps {
    data: ResumeData;
    templateType: string;
    colorTheme: string;
    fontFamily: string;
    fontSize: string;
    isFitToPage: boolean;
    onToggleFitToPage: () => void;
    onChangeTemplate: (id: string) => void;
    onChangeColorTheme: (id: string) => void;
    onChangeFontFamily: (id: string) => void;
    onChangeFontSize: (id: string) => void;
    onSave: () => void;
    saving: boolean;
    resumeId?: string;
    title: string;
}

export default function ReviewStep({
    data,
    templateType,
    colorTheme,
    fontFamily,
    fontSize,
    isFitToPage,
    onToggleFitToPage,
    onChangeTemplate,
    onChangeColorTheme,
    onChangeFontFamily,
    onChangeFontSize,
    onSave,
    saving,
    resumeId,
    title,
}: ReviewStepProps) {
    const router = useRouter();
    const [showPricingModal, setShowPricingModal] = useState(false);

    const checkDownloadAccess = async (): Promise<boolean> => {
        try {
            const response = await fetch('/api/user/subscription');
            if (!response.ok) return false;
            const { subscription, usage } = await response.json();
            if (!subscription || subscription.plan === 'free') return false;
            if (subscription.status !== 'active' && subscription.status !== 'trialing') return false;
            if (subscription.plan === 'payperuse' && usage?.downloadsUsed >= usage?.downloadsLimit) return false;
            if ((subscription.plan === 'pro' || subscription.plan === 'premium') && usage?.downloadsUsed >= usage?.downloadsLimit) return false;
            return true;
        } catch {
            return false;
        }
    };

    const handleDownload = async () => {
        const canDownload = await checkDownloadAccess();
        if (canDownload) {
            await onSave();
            // Track download
            if (resumeId) {
                try {
                    await fetch('/api/downloads/track', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ resumeId, templateType }),
                    });
                } catch (e) { console.error(e); }
            }
            const originalTitle = document.title;
            document.title = title || 'Resume';
            window.print();
            document.title = originalTitle;
        } else {
            setShowPricingModal(true);
        }
    };

    // Calculate completion
    const sections = [
        { name: 'Personal Info', filled: !!data.personalInfo?.fullName && !!data.personalInfo?.email },
        { name: 'Summary', filled: (data.summary?.length || 0) > 20 },
        { name: 'Experience', filled: (data.experience?.length || 0) > 0 },
        { name: 'Education', filled: (data.education?.length || 0) > 0 },
        { name: 'Skills', filled: (data.skills?.length || 0) > 0 },
    ];
    const filledCount = sections.filter(s => s.filled).length;
    const completionPct = Math.round((filledCount / sections.length) * 100);

    return (
        <div className="space-y-8">
            {/* Congrats header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
                    <PartyPopper className="w-4 h-4" /> Almost Done!
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Review Your Resume
                </h2>
                <p className="text-slate-400 mt-2">
                    Fine-tune the design and download when ready
                </p>
            </div>

            {/* Completion checklist */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">Completion: {completionPct}%</h3>
                    <span className={`text-xs font-medium ${completionPct === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {filledCount}/{sections.length} sections
                    </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 mb-3">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${completionPct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-yellow-400'}`}
                        style={{ width: `${completionPct}%` }}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {sections.map((s) => (
                        <span key={s.name} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${s.filled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                            {s.filled ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-slate-600 inline-block" />}
                            {s.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Quick Design Controls */}
            <div className="grid md:grid-cols-4 gap-4">
                {/* Template quick switcher */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Template</h4>
                    <select
                        value={templateType}
                        onChange={(e) => onChangeTemplate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none"
                    >
                        {templateConfigs.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>

                {/* Color theme */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Color</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {colorThemes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => onChangeColorTheme(t.id)}
                                className={`w-7 h-7 rounded-md border-2 transition-all ${colorTheme === t.id ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                                style={{ backgroundColor: t.primary }}
                            />
                        ))}
                    </div>
                </div>

                {/* Font */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Font</h4>
                    <select
                        value={fontFamily}
                        onChange={(e) => onChangeFontFamily(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-white text-sm bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none"
                    >
                        <option value="sans">Sans Serif</option>
                        <option value="serif">Serif</option>
                        <option value="mono">Monospace</option>
                    </select>
                </div>

                {/* Smart Fit */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Smart Fit</h4>
                    <button
                        onClick={onToggleFitToPage}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isFitToPage
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 shadow-lg shadow-amber-500/20'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                        }`}
                    >
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        {isFitToPage ? 'Active' : '1-Page Fit'}
                    </button>
                </div>
            </div>

            {/* Quality Score */}
            <QualityScore data={data} />

            {/* Full Preview */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-white">Full Preview</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={onSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/20 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                </div>
                <div
                    id="resume-preview"
                    className="bg-white rounded-lg overflow-hidden shadow-2xl mx-auto"
                    style={{
                        transform: 'scale(0.65)',
                        transformOrigin: 'top center',
                        width: '153.8%',
                        marginLeft: '-26.9%',
                    }}
                >
                    <TemplateRenderer
                        templateType={templateType as TemplateType}
                        data={data}
                        colorThemeId={colorTheme}
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        spacing={isFitToPage ? 'compact' : 'standard'}
                        sectionOrder={data.sectionOrder || []}
                    />
                </div>
            </div>

            {/* Pricing Modal */}
            <PricingModal
                isOpen={showPricingModal}
                onClose={() => setShowPricingModal(false)}
                onSelectPlan={async (plan: string, gateway: 'razorpay', couponCode?: string) => {
                    try {
                        const response = await fetch('/api/payments/razorpay/create-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ plan, couponCode }),
                        });
                        const { orderId, amount, currency, keyId } = await response.json();
                        const script = document.createElement('script');
                        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                        script.async = true;
                        document.body.appendChild(script);
                        script.onload = () => {
                            const options = {
                                key: keyId,
                                amount,
                                currency,
                                order_id: orderId,
                                name: 'VISISH',
                                description: `${plan} Plan`,
                                handler: async (response: any) => {
                                    await fetch('/api/payments/razorpay/verify', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ ...response, plan, billingCycle: 'monthly' }),
                                    });
                                    setShowPricingModal(false);
                                    alert('Payment successful! You can now download your resume.');
                                },
                            };
                            const razorpay = new (window as any).Razorpay(options);
                            razorpay.open();
                        };
                    } catch (error) {
                        console.error('Payment error:', error);
                        alert('Payment failed. Please try again.');
                    }
                }}
            />
        </div>
    );
}
