import { loadScript } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const REGISTRATION_FEE = 50; // ₹50 per team

interface PaymentOptions {
    teamName: string;
    email: string;
    phone: string;
}

export async function initializePayment(options: PaymentOptions): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
        // Load Razorpay script
        await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        // Call your backend API to create a Razorpay order
        const response = await fetch('/api/payment/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: REGISTRATION_FEE * 100, // Amount in paise
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                notes: {
                    teamName: options.teamName,
                    email: options.email,
                    phone: options.phone,
                },
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create payment order');
        }

        const orderData = await response.json();

        return {
            success: true,
            orderId: orderData.id,
        };
    } catch (error) {
        console.error('Payment initialization error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to initialize payment',
        };
    }
}

export function createRazorpayInstance(
    orderId: string,
    options: PaymentOptions,
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void
) {
    if (!RAZORPAY_KEY) {
        throw new Error('Razorpay key not found');
    }

    const razorpay = new window.Razorpay({
        key: RAZORPAY_KEY,
        amount: REGISTRATION_FEE * 100, // Amount in paise
        currency: 'INR',
        name: 'GEN 201',
        description: 'Team Registration Fee',
        order_id: orderId,
        prefill: {
            name: options.teamName,
            email: options.email,
            contact: options.phone,
        },
        theme: {
            color: '#7303c0',
        },
        modal: {
            ondismiss: () => {
                onFailure({ message: 'Payment cancelled by user' });
            },
        },
        handler: (response: any) => {
            onSuccess(response);
        },
    });

    return razorpay;
}

export async function verifyPayment(paymentId: string, orderId: string, signature: string) {
    try {
        // Call your backend API to verify the payment
        const response = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_id: paymentId,
                order_id: orderId,
                signature: signature,
            }),
        });

        if (!response.ok) {
            throw new Error('Payment verification failed');
        }

        const verificationResult = await response.json();
        return { success: verificationResult.verified };
    } catch (error) {
        console.error('Payment verification error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Payment verification failed'
        };
    }
}

// Create payment record in database
export async function createPaymentRecord(
    teamId: string,
    orderId: string,
    paymentId?: string,
    signature?: string,
    status: 'pending' | 'completed' | 'failed' = 'pending'
) {
    try {
        const { data, error } = await (supabase as any)
            .from('payments')
            .insert([{
                team_id: teamId,
                order_id: orderId,
                payment_id: paymentId,
                signature: signature,
                amount: REGISTRATION_FEE * 100, // Amount in paise
                currency: 'INR',
                payment_status: status,
                razorpay_order_id: orderId
            }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return { success: true, payment: data };
    } catch (error) {
        console.error('Error creating payment record:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create payment record'
        };
    }
}

// Update payment status
export async function updatePaymentStatus(
    orderId: string,
    paymentId: string,
    signature: string,
    status: 'completed' | 'failed',
    failureReason?: string
) {
    try {
        const updateData: any = {
            payment_id: paymentId,
            signature: signature,
            payment_status: status,
        };

        if (failureReason) {
            updateData.failure_reason = failureReason;
        }

        const { data, error } = await (supabase as any)
            .from('payments')
            .update(updateData)
            .eq('order_id', orderId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return { success: true, payment: data };
    } catch (error) {
        console.error('Error updating payment status:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update payment status'
        };
    }
}
