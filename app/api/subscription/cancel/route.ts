import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cancelSubscription as cancelSub } from '@/lib/payments/subscription';
// Cancel on payment gateway
if (user.subscription.razorpaySubscriptionId) {
    await cancelRazorpaySubscription(user.subscription.razorpaySubscriptionId);
}

// Update local subscription
await cancelSub(user.id);

return NextResponse.json({
    success: true,
    message: 'Subscription cancelled. You will have access until the end of your billing period.',
});
    } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
    );
}
}
