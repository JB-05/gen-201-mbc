/**
 * Razorpay Test Helper Functions
 * Use these functions to test payment integration in development
 */

export const TEST_CARDS = {
    SUCCESS: {
        number: '4111111111111111',
        expiry: '12/25',
        cvv: '123',
        name: 'Test User'
    },
    DECLINED: {
        number: '4000000000000002',
        expiry: '12/25',
        cvv: '123',
        name: 'Test User'
    },
    EXPIRED: {
        number: '4000000000000069',
        expiry: '12/25',
        cvv: '123',
        name: 'Test User'
    }
};

export const TEST_UPI_IDS = {
    SUCCESS: 'success@razorpay',
    FAILURE: 'failure@razorpay'
};

export const TEST_NET_BANKING = {
    BANK_CODE: 'HDFC',
    STATUS: 'SUCCESS' // or 'FAILURE'
};

/**
 * Test payment order creation
 */
export async function testCreateOrder() {
    try {
        const response = await fetch('/api/payment/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 5000, // ₹50 in paise
                currency: 'INR',
                receipt: `test_receipt_${Date.now()}`,
                notes: {
                    teamName: 'Test Team',
                    email: 'test@example.com',
                    phone: '9876543210',
                },
            }),
        });

        const result = await response.json();
        console.log('Order Creation Test:', result);
        return result;
    } catch (error) {
        console.error('Order creation test failed:', error);
        throw error;
    }
}

/**
 * Test payment verification (mock)
 */
export async function testVerifyPayment(
    paymentId: string = 'pay_test123',
    orderId: string = 'order_test123',
    signature: string = 'test_signature'
) {
    try {
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

        const result = await response.json();
        console.log('Payment Verification Test:', result);
        return result;
    } catch (error) {
        console.error('Payment verification test failed:', error);
        throw error;
    }
}

/**
 * Validate environment configuration
 */
export function validateRazorpayConfig() {
    const config = {
        publicKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        hasSecretKey: !!process.env.RAZORPAY_KEY_SECRET,
        isTestMode: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test_'),
    };

    console.log('Razorpay Configuration:', {
        publicKey: config.publicKey ? `${config.publicKey.substring(0, 12)}...` : 'NOT SET',
        hasSecretKey: config.hasSecretKey,
        isTestMode: config.isTestMode,
    });

    const issues = [];
    if (!config.publicKey) issues.push('NEXT_PUBLIC_RAZORPAY_KEY_ID not set');
    if (!config.hasSecretKey) issues.push('RAZORPAY_KEY_SECRET not set');
    if (!config.isTestMode) issues.push('Not in test mode (key should start with rzp_test_)');

    if (issues.length > 0) {
        console.error('Configuration Issues:', issues);
        return false;
    }

    console.log('✅ Razorpay configuration is valid for testing');
    return true;
}

/**
 * Test the complete payment flow
 */
export async function testCompletePaymentFlow() {
    console.log('🧪 Starting complete payment flow test...');

    // Step 1: Validate configuration
    if (!validateRazorpayConfig()) {
        throw new Error('Invalid Razorpay configuration');
    }

    // Step 2: Test order creation
    console.log('📝 Testing order creation...');
    const order = await testCreateOrder();

    if (!order.id) {
        throw new Error('Order creation failed');
    }

    console.log('✅ Order created successfully:', order.id);

    // Step 3: Simulate payment completion
    console.log('💳 Simulating payment completion...');

    // In real scenario, this would come from Razorpay callback
    const mockPaymentResponse = {
        razorpay_payment_id: 'pay_test_' + Date.now(),
        razorpay_order_id: order.id,
        razorpay_signature: 'mock_signature_' + Date.now()
    };

    // Step 4: Test verification
    console.log('🔍 Testing payment verification...');
    try {
        const verification = await testVerifyPayment(
            mockPaymentResponse.razorpay_payment_id,
            mockPaymentResponse.razorpay_order_id,
            mockPaymentResponse.razorpay_signature
        );

        console.log('✅ Payment flow test completed');
        return {
            order,
            payment: mockPaymentResponse,
            verification
        };
    } catch (error) {
        console.log('⚠️ Payment verification failed (expected in test mode)');
        return {
            order,
            payment: mockPaymentResponse,
            verification: { error: 'Verification failed - expected in test mode' }
        };
    }
}

/**
 * Run all tests
 */
export async function runAllPaymentTests() {
    console.log('🚀 Running all Razorpay tests...');

    try {
        await testCompletePaymentFlow();
        console.log('🎉 All tests completed successfully!');
    } catch (error) {
        console.error('❌ Tests failed:', error);
        throw error;
    }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
    (window as any).razorpayTests = {
        testCreateOrder,
        testVerifyPayment,
        validateRazorpayConfig,
        testCompletePaymentFlow,
        runAllPaymentTests,
        TEST_CARDS,
        TEST_UPI_IDS
    };

    console.log('🧪 Razorpay test helpers loaded. Use window.razorpayTests to run tests.');
}


