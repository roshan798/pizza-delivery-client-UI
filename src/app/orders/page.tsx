import { cookies } from 'next/headers';
import { formatPrice } from '@/lib/utils';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { redirect } from 'next/navigation';

import Link from 'next/link';
import CONFIG from '@/config';
import { OrderResponseDto, OrderStatus } from '@/types/order-types';
import { getSession } from '@/lib/session';

async function getCustomerOrders(): Promise<OrderResponseDto[]> {
	const URL = CONFIG.baseUrl + CONFIG.order.url + '/orders';
	const cookieStore = await cookies();
	console.log(cookieStore.get('accessToken'));
	const accessTokenCookie = cookieStore.get('accessToken')?.value;
	try {
		const headers = new Headers();
		if (accessTokenCookie) {
			headers.set('Authorization', `Bearer ${accessTokenCookie}`);
		}

		const response = await fetch(URL, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			console.error(
				`Failed to fetch orders: ${response.status} - ${await response.text()}`
			);
			return [];
		}

		const orders: OrderResponseDto[] = await response.json();
		console.log('Orders fetched successfully', orders);
		return orders;
	} catch (error) {
		console.error('Error in getCustomerOrders:', error);
		return [];
	}
}

export default async function OrdersPage() {
	const session = await getSession();

	if (!session) {
		redirect('/');
	}

	const orders = await getCustomerOrders();

	if (!orders || orders.length === 0) {
		return (
			<div className="container mx-auto py-8">
				<h1 className="text-3xl font-bold mb-6">Your Orders</h1>
				<p className="text-lg text-gray-600">
					You haven&apos;t placed any orders yet.
				</p>
				<Link
					href="/"
					className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
				>
					Start Shopping
				</Link>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 max-w-5xl">
			<h1 className="text-3xl font-bold mb-6">Your Orders</h1>
			<div className="rounded-md border overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="">S.No</TableHead>
							<TableHead className="w-[120px]">
								Order ID
							</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className="text-center">
								Status
							</TableHead>
							<TableHead>Payment Mode</TableHead>
							<TableHead>Payment Status</TableHead>
							<TableHead className="text-right">Total</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order, idx) => (
							<TableRow
								key={order.id}
								className="cursor-pointer hover:bg-gray-50"
							>
								<TableCell className="text-center">
									{idx + 1}
								</TableCell>
								<TableCell className="font-medium">
									<Link href={`/orders/${order.id}`} passHref>
										{order.id.substring(0, 12)}...
									</Link>
								</TableCell>
								<TableCell>
									{new Date(
										order.createdAt
									).toLocaleDateString()}
								</TableCell>
								<TableCell className="text-center">
									<span
										className={`px-2 py-1 text-xs font-semibold rounded-full
                                        ${
											order.orderStatus ===
											OrderStatus.DELIVERED
												? 'bg-green-100 text-green-800'
												: order.orderStatus ===
													  OrderStatus.CANCELLED
													? 'bg-red-100 text-red-800'
													: 'bg-blue-100 text-blue-800'
										}`}
									>
										{order.orderStatus.toUpperCase()}
									</span>
								</TableCell>
								<TableCell>{order.paymentMode}</TableCell>
								<TableCell>{order.paymentStatus}</TableCell>
								<TableCell className="text-right">
									₹{formatPrice(order.amounts.grandTotal)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
