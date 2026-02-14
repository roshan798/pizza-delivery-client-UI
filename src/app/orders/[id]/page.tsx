'use client';
import { formatPrice } from '@/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import CONFIG from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderResponseDto, OrderStatus } from '@/types/order-types'; // Assuming these types are client-side safe
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter for potential redirects
import { Button } from '@/components/ui/button';
// interface OrderDetailsPageProps {
//     params: {
//         id: string;
//     };
// }

async function getOrderById(
	orderId: string
): Promise<OrderResponseDto | null | 'unauthorized'> {
	// In a client component, direct access to 'cookies()' is not possible.
	// We will fetch from a Next.js API route that acts as a proxy to handle authentication.
	const URL = CONFIG.baseUrl + CONFIG.order.url + `/orders/${orderId}`; // New client-side API route
	console.log(URL);
	try {
		const response = await fetch(URL, {
			method: 'GET',
			credentials: 'include',
		});

		if (response.status === 401 || response.status === 403) {
			console.warn(
				`Access denied for order ${orderId}. Status: ${response.status}`
			);
			return 'unauthorized';
		}

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

		const order: OrderResponseDto = await response.json();
		console.log(`Order ${orderId} fetched successfully`, order);
		console.log({ order });
		return order;
	} catch (error) {
		console.error(`Error in getOrderById for ID ${orderId}:`, error);
		console.error(error);
		return null;
	}
}

export default function OrderDetailsPage() {
	const { id } = useParams();
	const [order, setOrder] = useState<OrderResponseDto | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter(); // Initialize useRouter

	useEffect(() => {
		const fetchOrder = async () => {
			setLoading(true);
			const fetchedOrderResult = await getOrderById(id as string);
			if (fetchedOrderResult === 'unauthorized') {
				router.push('/');
				return;
			}
			setOrder(fetchedOrderResult);
			setLoading(false);
		};
		fetchOrder();
	}, [id, router]); // Re-fetch if ID changes, include router in dependencies

	if (loading) {
		return (
			<div className="container mx-auto py-8">
				<h1 className="text-3xl font-bold mb-6">Order Details</h1>
				<Card className="shadow-lg">
					<CardHeader>
						<Skeleton className="h-8 w-3/4 mb-2" />
						<Skeleton className="h-4 w-1/2" />
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Skeleton className="h-5 w-40 mb-2" />
								<Skeleton className="h-4 w-full mb-1" />
								<Skeleton className="h-4 w-3/4 mb-1" />
								<Skeleton className="h-4 w-1/2" />
							</div>
							<div>
								<Skeleton className="h-5 w-40 mb-2" />
								<Skeleton className="h-4 w-full mb-1" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>
						<Separator />
						<div>
							<Skeleton className="h-5 w-24 mb-3" />
							<ul className="space-y-2">
								<li className="flex justify-between">
									<Skeleton className="h-4 w-2/3" />
									<Skeleton className="h-4 w-1/4" />
								</li>
								<li className="flex justify-between">
									<Skeleton className="h-4 w-2/3" />
									<Skeleton className="h-4 w-1/4" />
								</li>
								<li className="flex justify-between">
									<Skeleton className="h-4 w-2/3" />
									<Skeleton className="h-4 w-1/4" />
								</li>
							</ul>
						</div>
						<Separator />
						<div className="space-y-1 text-sm">
							<div className="flex justify-between">
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-4 w-1/4" />
							</div>
							<div className="flex justify-between">
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-4 w-1/4" />
							</div>
							<div className="flex justify-between">
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-4 w-1/4" />
							</div>
							<div className="flex justify-between mt-2">
								<Skeleton className="h-6 w-1/2" />
								<Skeleton className="h-6 w-1/3" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="container mx-auto py-8 text-center">
				<Card className="p-8 shadow-lg">
					<CardTitle className="text-3xl font-bold mb-4">
						Order Not Found
					</CardTitle>
					<CardDescription className="text-lg text-gray-600 mb-6">
						The order you are looking for does not exist or you do
						not have permission to view it.
					</CardDescription>
				</Card>
				<Link
					href="/orders"
					className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
				>
					View All Orders
				</Link>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">Order Details</h1>
				<Link href="/orders">
					<Button variant="outline">Back to Orders</Button>
				</Link>
			</div>

			<div className="space-y-6">
				<Card className="shadow-lg">
					<CardHeader className="pb-4">
						<CardTitle className="flex justify-between items-center text-2xl">
							Order #
							<span className="font-mono text-xl">
								{order.id}
							</span>
							<span
								className={`text-sm font-medium px-3 py-1 rounded-full
                                ${
									order.orderStatus === OrderStatus.DELIVERED
										? 'bg-green-100 text-green-800'
										: order.orderStatus ===
											  OrderStatus.CANCELLED
											? 'bg-red-100 text-red-800'
											: 'bg-blue-100 text-blue-800'
								}`}
							>
								{order.orderStatus.toUpperCase()}
							</span>
						</CardTitle>
						<CardDescription className="text-sm text-gray-500">
							Placed on{' '}
							{new Date(order.createdAt).toLocaleDateString()} at{' '}
							{new Date(order.createdAt).toLocaleTimeString()}
						</CardDescription>
					</CardHeader>
				</Card>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card className="shadow-md">
						<CardHeader className="pb-3">
							<CardTitle className="text-xl">
								Delivery Details
							</CardTitle>
						</CardHeader>
						<CardContent className="text-sm space-y-1">
							<p>
								<strong>Address:</strong> {order.address}
							</p>
							<p>
								<strong>Phone:</strong> {order.phone}
							</p>
							<p>
								<strong>Tenant:</strong> {order.tenantId}
							</p>
						</CardContent>
					</Card>

					<Card className="shadow-md">
						<CardHeader className="pb-3">
							<CardTitle className="text-xl">
								Payment Details
							</CardTitle>
						</CardHeader>
						<CardContent className="text-sm space-y-1">
							<p>
								<strong>Method:</strong> {order.paymentMode}
							</p>
							<p>
								<strong>Status:</strong> {order.paymentStatus}
							</p>
							{order.couponCode && (
								<p>
									<strong>Coupon:</strong> {order.couponCode}
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				<Card className="shadow-md">
					<CardHeader className="pb-3">
						<CardTitle className="text-xl">
							Items ({order.items.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{order.items.map((item, index) => (
								<li
									key={index}
									className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0 last:pb-0"
								>
									<span className="font-medium">
										{item.quantity} x {item.productName} (
										{item.base.name})
									</span>
									<span>₹{formatPrice(item.itemTotal)}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card className="shadow-md">
					<CardHeader className="pb-3">
						<CardTitle className="text-xl">
							Amount Summary
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-1 text-sm">
						<div className="flex justify-between">
							<span>Subtotal:</span>
							<span>₹{formatPrice(order.amounts.subTotal)}</span>
						</div>
						<div className="flex justify-between">
							<span>Tax:</span>
							<span>₹{formatPrice(order.amounts.tax)}</span>
						</div>
						<div className="flex justify-between">
							<span>Delivery Charge:</span>
							<span>
								₹{formatPrice(order.amounts.deliveryCharge)}
							</span>
						</div>
						{order.amounts.discount > 0 && (
							<div className="flex justify-between text-green-600">
								<span>Discount:</span>
								<span>
									- ₹{formatPrice(order.amounts.discount)}
								</span>
							</div>
						)}
						<Separator className="my-2" />
						<div className="flex justify-between font-bold text-lg">
							<span>Grand Total:</span>
							<span>
								₹{formatPrice(order.amounts.grandTotal)}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
