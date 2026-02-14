import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import CONFIG from '@/config';

interface OrderItemRequest {
	productId: string;
	productName: string;
	quantity: number;
	base: {
		name: string;
		price: number;
	};
	toppings: Array<{
		id: string;
		name: string;
		price: number;
	}>;
	key: string;
}

interface CreateOrderRequest {
	customerId: string;
	tenantId: string;
	address: string;
	phone: string;
	paymentMode: 'CASH' | 'CARD';
	subTotal: number;
	tax: number;
	deliveryCharge: number;
	delivery: number;
	discount: number;
	grandTotal: number;
	couponCode: string;
	items: OrderItemRequest[];
}

interface OrderResponse {
	orderId?: string;
	paymentUrl?: string; // Optional, for card payments
}

export async function POST(req: NextRequest) {
	const idempotencyKey = req.headers.get('idempotency-key');
	const accessToken = (await cookies()).get('accessToken')?.value;

	if (!accessToken) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	if (!idempotencyKey) {
		return NextResponse.json(
			{ message: 'Idempotency-Key header is required' },
			{ status: 400 }
		);
	}

	try {
		const orderData: CreateOrderRequest = await req.json();

		const headers = new Headers({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
			'Idempotency-Key': idempotencyKey,
		});

		const backendApiUrl = `${CONFIG.baseUrl + CONFIG.order.url}/orders`;

		const response = await fetch(backendApiUrl, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(orderData),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`Backend order creation failed: ${response.status} - ${errorText}`
			);
			return NextResponse.json(
				{ message: 'Failed to create order', details: errorText },
				{ status: response.status }
			);
		}
		const res = (await response.json()) as OrderResponse;
		return NextResponse.json(
			{
				paymentUrl: res.paymentUrl,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error in /api/order/create-order:', error);
		return NextResponse.json(
			{
				message: 'Internal server error',
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}
