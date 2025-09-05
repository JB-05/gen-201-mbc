import { loadScript } from '@/lib/utils';

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

        // In a real app, you would make an API call to your backend to create an order
        // For demo, we'll create a mock order ID
        const mockOrderId = 'order_' + Math.random().toString(36).substr(2, 9);

        return {
            success: true,
            orderId: mockOrderId,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to initialize payment',
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
                onFailure('Payment cancelled by user');
            },
        },
        handler: (response: any) => {
            onSuccess(response);
        },
    });

    return razorpay;
}

export async function verifyPayment(paymentId: string, orderId: string, signature: string) {
    // In a real app, you would verify the payment with your backend
    // For demo, we'll simulate a successful verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
}
