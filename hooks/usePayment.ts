import { useState } from 'react';

export function usePayment() {
    const [loading, setLoading] = useState(false);

    const handleSelectPlan = async (plan: string, gateway: 'razorpay', couponCode?: string) => {
        setLoading(true);
        try {
            // Create Razorpay order
            const response = await fetch('/api/payments/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan, couponCode }),
            });

            const { orderId, amount, currency, keyId } = await response.json();

            // Load Razorpay script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            return new Promise<void>((resolve, reject) => {
                script.onload = () => {
                    const options = {
                        key: keyId,
                        amount,
                        currency,
                        order_id: orderId,
                        name: 'VISISH',
                        description: `${plan} Plan`,
                        handler: async (response: any) => {
                            try {
                                // Verify payment
                                await fetch('/api/payments/razorpay/verify', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        ...response,
                                        plan,
                                        billingCycle: 'monthly',
                                        couponCode,
                                    }),
                                });
                                resolve();
                                window.location.reload();
                            } catch (err) {
                                reject(err);
                            }
                        },
                        modal: {
                            ondismiss: () => {
                                setLoading(false);
                            }
                        }
                    };
                    const razorpay = new (window as any).Razorpay(options);
                    razorpay.open();
                };
                script.onerror = () => {
                    setLoading(false);
                    reject(new Error('Razorpay SDK failed to load'));
                };
            });
        } catch (error) {
            console.error('Payment error:', error);
            setLoading(false);
            throw error;
        }
    };

    return { handleSelectPlan, loading };
}
