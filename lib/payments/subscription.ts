import { prisma } from '@/lib/prisma';

export type PlanType = 'free' | 'pro' | 'premium' | 'payperuse';

export interface PlanLimits {
    downloads: number; // 0 = unlimited
    analyses: number; // 0 = unlimited
    templates: string[]; // empty array = all templates
    features: string[];
}

// Plan definitions
export const PLANS: Record<PlanType, PlanLimits> = {
    free: {
        downloads: 1,
        analyses: 3,
        templates: ['classic'], // Only basic template
        features: ['basic_templates', 'watermark'],
    },
    payperuse: {
        downloads: 1, // Per purchase
        analyses: 3,
        templates: [], // All templates
        features: [
            'all_templates',
            'no_watermark',
            'ai_analysis',
            'cover_letter',
            'linkedin_optimization',
            'interview_prep',
        ],
    },
    pro: {
        downloads: 30, // Per month
        analyses: 0, // Unlimited
        templates: [], // All templates
        features: [
            'all_templates',
            'no_watermark',
            'unlimited_ai',
            'priority_support',
            'version_history',
            'docx_export',
            'cover_letter',
            'linkedin_optimization',
            'interview_prep',
        ],
    },
    premium: {
        downloads: 0, // Unlimited
        analyses: 0, // Unlimited
        templates: [], // All templates
        features: [
            'all_templates',
            'no_watermark',
            'unlimited_ai',
            'priority_support',
            'version_history',
            'docx_export',
            'cover_letter',
            'linkedin_optimization',
            'interview_prep',
            'expert_review',
        ],
    },
};

/**
 * Get user's current subscription and plan
 */
export async function getUserSubscription(userId: string) {
    // Check if user is admin
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });

    if (user?.role === 'admin') {
        return {
            plan: 'premium' as PlanType,
            status: 'active',
            limits: PLANS.premium,
            subscription: null,
        };
    }

    const subscription = await prisma.subscription.findUnique({
        where: { userId },
    });

    // Default to free plan if no subscription
    if (!subscription) {
        return {
            plan: 'free' as PlanType,
            status: 'active',
            limits: PLANS.free,
            subscription: null,
        };
    }

    // Check for expiry (specifically for payperuse 24h access)
    if (subscription.plan === 'payperuse' && subscription.currentPeriodEnd && new Date() > subscription.currentPeriodEnd) {
        return {
            plan: 'free' as PlanType,
            status: 'expired',
            limits: PLANS.free,
            subscription,
        };
    }

    // Merge static plan limits with dynamic subscription limits
    const staticLimits = PLANS[subscription.plan as PlanType];
    const limits = {
        ...staticLimits,
        // Use DB limit if available, otherwise fallback to static plan limit
        downloads: subscription.downloadsLimit ?? staticLimits.downloads,
        analyses: subscription.analysesLimit ?? staticLimits.analyses,
    };

    return {
        plan: subscription.plan as PlanType,
        status: subscription.status,
        limits,
        subscription,
    };
}

/**
 * Check if user can access a feature
 */
export async function canAccessFeature(
    userId: string,
    feature: string
): Promise<boolean> {
    const { limits } = await getUserSubscription(userId);
    return limits.features.includes(feature);
}

/**
 * Check if user can download a resume
 */
export async function canDownloadResume(userId: string): Promise<{
    allowed: boolean;
    remaining: number;
    reason?: string;
}> {
    const { plan, limits, subscription } = await getUserSubscription(userId);

    // Unlimited downloads
    if (limits.downloads === 0) {
        return { allowed: true, remaining: -1 }; // -1 indicates unlimited
    }

    // Count downloads this period
    const periodStart = subscription?.currentPeriodStart || new Date();
    const downloadCount = await prisma.usageRecord.count({
        where: {
            userId,
            type: 'download',
            createdAt: {
                gte: periodStart,
            },
        },
    });

    const remaining = limits.downloads - downloadCount;

    if (remaining <= 0) {
        return {
            allowed: false,
            remaining: 0,
            reason: `You've reached your ${plan} plan limit of ${limits.downloads} downloads this period. Upgrade to continue.`,
        };
    }

    return { allowed: true, remaining };
}

/**
 * Check if user can run AI analysis
 */
export async function canRunAnalysis(userId: string): Promise<{
    allowed: boolean;
    remaining: number;
    reason?: string;
}> {
    const { plan, limits, subscription } = await getUserSubscription(userId);

    // Unlimited analyses
    if (limits.analyses === 0) {
        return { allowed: true, remaining: -1 };
    }

    // Count analyses this period
    const periodStart = subscription?.currentPeriodStart || new Date();
    const analysisCount = await prisma.usageRecord.count({
        where: {
            userId,
            type: 'analysis',
            createdAt: {
                gte: periodStart,
            },
        },
    });

    const remaining = limits.analyses - analysisCount;

    if (remaining <= 0) {
        return {
            allowed: false,
            remaining: 0,
            reason: `You've reached your ${plan} plan limit of ${limits.analyses} AI analyses this period. Upgrade for unlimited analyses.`,
        };
    }

    return { allowed: true, remaining };
}

/**
 * Track usage (download or analysis)
 */
export async function trackUsage(
    userId: string,
    type: 'download' | 'analysis' | 'template_access',
    resourceId?: string,
    metadata?: Record<string, any>
) {
    await prisma.usageRecord.create({
        data: {
            userId,
            type,
            resourceId,
            metadata: metadata ? JSON.stringify(metadata) : '{}',
        },
    });
}

/**
 * Get usage statistics for current period
 */
export async function getUsageStats(userId: string) {
    const { subscription, limits } = await getUserSubscription(userId);
    const periodStart = subscription?.currentPeriodStart || new Date();

    const [downloadCount, analysisCount] = await Promise.all([
        prisma.usageRecord.count({
            where: {
                userId,
                type: 'download',
                createdAt: { gte: periodStart },
            },
        }),
        prisma.usageRecord.count({
            where: {
                userId,
                type: 'analysis',
                createdAt: { gte: periodStart },
            },
        }),
    ]);

    return {
        downloads: {
            used: downloadCount,
            limit: limits.downloads,
            remaining: limits.downloads === 0 ? -1 : limits.downloads - downloadCount,
        },
        analyses: {
            used: analysisCount,
            limit: limits.analyses,
            remaining: limits.analyses === 0 ? -1 : limits.analyses - analysisCount,
        },
        periodStart,
        periodEnd: subscription?.currentPeriodEnd,
    };
}

/**
 * Create or update subscription
 */
export async function createSubscription(
    userId: string,
    plan: PlanType,
    billingCycle?: 'monthly' | 'yearly',
    gatewaySubscriptionId?: string,
    gateway?: 'stripe' | 'razorpay',
    bonusDownloads: number = 0,
    bonusDays: number = 0
) {
    const now = new Date();
    const periodEnd = new Date(now);

    if (billingCycle === 'yearly') {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else if (plan === 'payperuse') {
        periodEnd.setHours(periodEnd.getHours() + 24); // 24 hours access
    } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    // Apply bonus days
    if (bonusDays > 0) {
        periodEnd.setDate(periodEnd.getDate() + bonusDays);
    }

    const limits = PLANS[plan];
    const downloadsLimit = limits.downloads === 0 ? 0 : limits.downloads + bonusDownloads;

    return await prisma.subscription.upsert({
        where: { userId },
        create: {
            userId,
            plan,
            status: 'active',
            billingCycle,
            amount: 0, // Set based on plan
            currency: 'INR',
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            downloadsLimit: downloadsLimit,
            analysesLimit: limits.analyses,
            ...(gateway === 'stripe' && { stripeSubscriptionId: gatewaySubscriptionId }),
            ...(gateway === 'razorpay' && { razorpaySubscriptionId: gatewaySubscriptionId }),
        },
        update: {
            plan,
            status: 'active',
            billingCycle,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            downloadsLimit: downloadsLimit,
            analysesLimit: limits.analyses,
            ...(gateway === 'stripe' && { stripeSubscriptionId: gatewaySubscriptionId }),
            ...(gateway === 'razorpay' && { razorpaySubscriptionId: gatewaySubscriptionId }),
        },
    });
}

/**
 * Cancel subscription (keeps access until period end)
 */
export async function cancelSubscription(userId: string) {
    return await prisma.subscription.update({
        where: { userId },
        data: {
            cancelAtPeriodEnd: true,
        },
    });
}
