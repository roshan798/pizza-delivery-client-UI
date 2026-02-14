import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const authHeader = request.headers.get('Authorization');

		if (!authHeader) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			);
		}

		// Use an environment variable for the order service URL
		const orderServiceBaseUrl = process.env.ORDER_SERVICE_URL;

		if (!orderServiceBaseUrl) {
			console.error('ORDER_SERVICE_URL environment variable is not set.');
			return NextResponse.json(
				{ message: 'Server configuration error' },
				{ status: 500 }
			);
		}

		const orderServiceUrl = `${orderServiceBaseUrl}/order`; // Assuming order-service exposes /order endpoint for customer orders

		const response = await fetch(orderServiceUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: authHeader,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json(errorData, { status: response.status });
		}

		const orders = await response.json();
		return NextResponse.json(orders);
	} catch (error) {
		console.error('Error fetching customer orders:', error);
		return NextResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
