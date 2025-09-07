import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay only if environment variables are available
let razorpay: Razorpay | null = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

export async function POST(request: NextRequest) {
    try {
        // Check if Razorpay is properly configured
        if (!razorpay) {
            return NextResponse.json(
                { error: 'Payment service is not configured. Please contact administrator.' },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { amount, currency, receipt, notes } = body;

        // Validate required fields
        if (!amount || !currency || !receipt) {
            return NextResponse.json(
                { error: 'Missing required fields: amount, currency, receipt' },
                { status: 400 }
            );
        }

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount, // Amount in paise
            currency: currency,
            receipt: receipt,
            notes: notes || {},
        });

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: 'Failed to create payment order' },
            { status: 500 }
        );
    }
}

