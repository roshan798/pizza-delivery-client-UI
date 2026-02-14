'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CONFIG from '@/config';
import { OrderResponseDto } from '@/types/order-types';

interface Topping {
	id: string;
	price: number;
}

interface Base {
	name: string;
	price: number;
}

interface Item {
	productId: string;
	productName: string;
	quantity: number;
	base: Base;
	toppings: Topping[];
	itemTotal: number;
}

interface Amounts {
	subTotal: number;
	tax: number;
	deliveryCharge: number;
	discount: number;
	grandTotal: number;
}
export enum PaymentStatus {
	PAID = 'PAID',
	UNPAID = 'UNPAID',
	NO_PAYMENT_REQUIRED = 'NO_PAYMENT_REQUIRED',
	PENDING = 'PENDING',
}

interface OrderData {
	_id: string;
	customerId: string;
	address: string;
	phone: string;
	paymentMode: 'CASH' | 'CARD';
	paymentStatus: PaymentStatus;
	couponCode?: string;
	amounts: Amounts;
	items: Item[];
	orderStatus: string;
	tenantId: string;
	createdAt: string;
	updatedAt: string;
}
// Paymnet succes and d failure page

async function getOrderById(orderId: string): Promise<OrderData | null> {
	// In a client component, direct access to 'cookies()' is not possible.
	// We will fetch from a Next.js API route that acts as a proxy to handle authentication.
	const URL = CONFIG.baseUrl + CONFIG.order.url + `/orders/${orderId}`; // New client-side API route
	console.log(URL);
	try {
		const response = await fetch(URL, {
			method: 'GET',
			credentials: 'include',
		});

		if (!response.ok) {
			if (response.status === 404) {
				console.warn(`Order with ID ${orderId} not found.`);
				return null;
			}
			console.error(
				`Failed to fetch order ${orderId}: ${response.status} - ${await response.text()}`
			);
			return null;
		}

		const order = await response.json();
		console.log(`Order ${orderId} fetched successfully`, order);
		console.log({ order });
		return order;
	} catch (error) {
		console.error(`Error in getOrderById for ID ${orderId}:`, error);
		console.error(error);
		return null;
	}
}

const PaymentStatusPage = () => {
	const searchParams = useSearchParams();
	const isSuccess = searchParams.get('success') === 'true';
	// const sessionId = searchParams.get('session_id');
	const orderId = searchParams.get('order_id');

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [orderData, setOrderData] = useState<OrderData | null>(null);

	useEffect(() => {
		const fetchOrder = async () => {
			setLoading(true);
			try {
				if (orderId) {
					const fetchedOrder = await getOrderById(orderId);
					console.log(fetchedOrder);
					if (!fetchedOrder) {
						setError('Order not found');
						return;
					}
					setOrderData(fetchedOrder);
				}
			} catch (error) {
				setError('Failed to fetch order');
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchOrder();
	}, [orderId]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<p className="text-lg text-gray-700">
					Loading order details...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 p-4">
				<p className="text-lg">Error: {error}</p>
			</div>
		);
	}

	if (!orderData) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<p className="text-lg text-gray-700">No order data found.</p>
			</div>
		);
	}

	// Render success or failure page based on isSuccess
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
				{isSuccess ? (
					<div className="text-center">
						<h1 className="text-4xl font-bold text-green-600 mb-4">
							Payment Successful!
						</h1>
						<p className="text-lg text-gray-700 mb-6">
							Your order has been placed successfully.
						</p>
						<div className="border-t border-gray-200 pt-4 text-left">
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								Order Details
							</h2>
							<p className="text-gray-600 mb-2">
								<strong>Order ID:</strong> {orderData._id}
							</p>
							<p className="text-gray-600 mb-2">
								<strong>Order Status:</strong>{' '}
								<span className="font-medium text-blue-600">
									{orderData.orderStatus.toUpperCase()}
								</span>
							</p>
							<p className="text-gray-600 mb-2">
								<strong>Total Amount:</strong> ₹
								{orderData.amounts.grandTotal.toFixed(2)}
							</p>
							<p className="text-gray-600 mb-2">
								<strong>Payment Mode:</strong>{' '}
								{orderData.paymentMode}
							</p>
							<p className="text-gray-600 mb-2">
								<strong>Payment Status:</strong>{' '}
								<span className="font-medium text-blue-600">
									{orderData.paymentStatus.toUpperCase()}
								</span>
							</p>
							<p className="text-gray-600 mb-2">
								<strong>Delivery Address:</strong>{' '}
								{orderData.address}
							</p>

							<h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
								Items:
							</h3>
							<ul className="list-disc list-inside pl-4">
								{orderData.items.map((item, index) => (
									<li
										key={index}
										className="text-gray-600 mb-1"
									>
										{item.productName} (x{item.quantity}) -
										₹{item.itemTotal.toFixed(2)}
										{item.toppings.length > 0 && (
											<span className="text-sm text-gray-500 ml-2">
												(Toppings:{' '}
												{item.toppings
													.map((t) => t.id)
													.join(', ')}
												)
											</span>
										)}
									</li>
								))}
							</ul>

							<div className="mt-8">
								<Link
									href="/"
									className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
								>
									Go to Home
								</Link>
							</div>
						</div>
					</div>
				) : (
					<div className="text-center">
						<h1 className="text-4xl font-bold text-red-600 mb-4">
							Payment Failed or Cancelled
						</h1>
						<p className="text-lg text-gray-700 mb-6">
							There was an issue processing your payment, or you
							cancelled the transaction.
						</p>
						<div className="border-t border-gray-200 pt-4 text-left">
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								Order Information
							</h2>
							<p className="text-gray-600 mb-2">
								<strong>Order ID:</strong> {orderData._id}
							</p>
							<p className="text-gray-600 mb-2">
								<strong>Status:</strong>{' '}
								<span className="font-medium text-red-600">
									{orderData.orderStatus.toUpperCase()}
								</span>
							</p>
							<p className="text-gray-600 mb-2">
								<strong>Total Amount:</strong> ₹
								{orderData.amounts.grandTotal.toFixed(2)}
							</p>
							<p className="text-gray-600 mb-2">
								<strong>Payment Mode:</strong>{' '}
								{orderData.paymentMode}
							</p>
							<p className="text-gray-600 mb-2">
								<strong>Delivery Address:</strong>{' '}
								{orderData.address}
							</p>
							<p className="text-gray-600 mb-2">
								Please try again or contact support if the issue
								persists.
							</p>

							<div className="mt-8">
								<Link
									href="/cart"
									className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 mr-4"
								>
									Review Cart
								</Link>
								<Link
									href="/"
									className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
								>
									Go to Home
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PaymentStatusPage;
