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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CONFIG from '@/config';
import { OrderResponseDto, OrderStatus } from '@/types/order-types';
import { getSession } from '@/lib/session';
import {
	Package,
	ShoppingBag,
	Calendar,
	CreditCard,
	CheckCircle2,
	XCircle,
	Clock,
	Truck,
	ChevronRight,
	Receipt,
} from 'lucide-react';

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

const getStatusConfig = (status: OrderStatus) => {
	const configs = {
		[OrderStatus.DELIVERED]: {
			icon: CheckCircle2,
			color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
			label: 'Delivered',
		},
		[OrderStatus.CANCELLED]: {
			icon: XCircle,
			color: 'bg-rose-50 text-rose-700 border-rose-200',
			label: 'Cancelled',
		},
		[OrderStatus.PENDING]: {
			icon: Clock,
			color: 'bg-amber-50 text-amber-700 border-amber-200',
			label: 'Pending',
		},
		[OrderStatus.VERIFIED]: {
			icon: CheckCircle2,
			color: 'bg-blue-50 text-blue-700 border-blue-200',
			label: 'Verified'
		},
		[OrderStatus.CONFIRMED]: {
			icon: CheckCircle2,
			color: 'bg-purple-50 text-purple-700 border-purple-200',
			label: 'Confirmed',
		},
		[OrderStatus.PREPARING]: {
			icon: Package,
			color: 'bg-orange-50 text-orange-700 border-orange-200',
			label: 'Preparing'
		},
		[OrderStatus.OUT_FOR_DELIVERY]: {
			icon: Truck,
			color: 'bg-blue-50 text-blue-700 border-blue-200',
			label: 'Out for delivery',
		},
	};
	return configs[status] || configs[OrderStatus.PENDING];
};

export default async function OrdersPage() {
	const session = await getSession();

	if (!session) {
		redirect('/');
	}

	const orders = await getCustomerOrders();

	if (!orders || orders.length === 0) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
				<div className="container mx-auto px-4 py-16 max-w-3xl">
					<Card className="border-2 shadow-lg">
						<CardContent className="p-16 text-center">
							<div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
								<ShoppingBag className="w-12 h-12 text-slate-400" />
							</div>
							<h1 className="text-4xl font-bold mb-4 text-slate-900">
								No Orders Yet
							</h1>
							<p className="text-slate-600 mb-8 text-lg leading-relaxed">
								You haven&apos;t placed any orders yet. Start exploring our
								products and create your first order!
							</p>
							<Link href="/">
								<Button size="lg" className="gap-2 text-base px-8">
									<ShoppingBag className="w-5 h-5" />
									Start Shopping
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-3 rounded-xl bg-blue-100">
							<Receipt className="w-7 h-7 text-blue-600" />
						</div>
						<h1 className="text-4xl font-bold text-slate-900">
							Your Orders
						</h1>
					</div>
					<p className="text-slate-600 text-lg">
						Track and manage all your orders in one place
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<Card className="border-2 hover:border-blue-200 transition-colors">
						<CardContent className="p-5">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-slate-500 mb-1">
										Total Orders
									</p>
									<p className="text-3xl font-bold text-slate-900">
										{orders.length}
									</p>
								</div>
								<div className="p-3 rounded-lg bg-blue-50">
									<Package className="w-6 h-6 text-blue-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-2 hover:border-emerald-200 transition-colors">
						<CardContent className="p-5">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-slate-500 mb-1">
										Delivered
									</p>
									<p className="text-3xl font-bold text-slate-900">
										{
											orders.filter(
												(o) =>
													o.orderStatus ===
													OrderStatus.DELIVERED
											).length
										}
									</p>
								</div>
								<div className="p-3 rounded-lg bg-emerald-50">
									<CheckCircle2 className="w-6 h-6 text-emerald-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-2 hover:border-purple-200 transition-colors">
						<CardContent className="p-5">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-slate-500 mb-1">
										Total Spent
									</p>
									<p className="text-3xl font-bold text-slate-900">
										₹
										{formatPrice(
											orders.reduce(
												(sum, order) =>
													sum +
													order.amounts.grandTotal,
												0
											)
										)}
									</p>
								</div>
								<div className="p-3 rounded-lg bg-purple-50">
									<CreditCard className="w-6 h-6 text-purple-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Orders List - Desktop Table View */}
				<div className="hidden lg:block">
					<Card className="border-2 shadow-md">
						<div className="rounded-md overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow className="bg-slate-50 hover:bg-slate-50">
										<TableHead className="font-semibold">
											#
										</TableHead>
										<TableHead className="font-semibold">
											Order ID
										</TableHead>
										<TableHead className="font-semibold">
											Date
										</TableHead>
										<TableHead className="font-semibold text-center">
											Status
										</TableHead>
										<TableHead className="font-semibold">
											Payment
										</TableHead>
										<TableHead className="font-semibold text-right">
											Total
										</TableHead>
										<TableHead className="font-semibold text-right">
											Action
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orders.map((order, idx) => {
										const statusConfig = getStatusConfig(
											order.orderStatus
										);
										const StatusIcon = statusConfig.icon;

										return (
											<TableRow
												key={order.id}
												className="hover:bg-slate-50/50 transition-colors"
											>
												<TableCell className="font-medium text-slate-600">
													{idx + 1}
												</TableCell>
												<TableCell>
													<Link
														href={`/orders/${order.id}`}
														className="font-mono text-sm text-blue-600 hover:text-blue-700 hover:underline"
													>
														{order.id.substring(
															0,
															12
														)}
														...
													</Link>
												</TableCell>
												<TableCell className="text-slate-700">
													<div className="flex items-center gap-2">
														<Calendar className="w-4 h-4 text-slate-400" />
														{new Date(
															order.createdAt
														).toLocaleDateString(
															'en-US',
															{
																month: 'short',
																day: 'numeric',
																year: 'numeric',
															}
														)}
													</div>
												</TableCell>
												<TableCell className="text-center">
													<Badge
														className={`${statusConfig.color} border px-3 py-1 text-xs font-semibold flex items-center gap-1.5 w-fit mx-auto`}
													>
														<StatusIcon className="w-3.5 h-3.5" />
														{statusConfig.label}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="space-y-1">
														<p className="text-sm font-medium text-slate-900">
															{order.paymentMode}
														</p>
														<p className="text-xs text-slate-500">
															{order.paymentStatus}
														</p>
													</div>
												</TableCell>
												<TableCell className="text-right font-bold text-slate-900">
													₹
													{formatPrice(
														order.amounts
															.grandTotal
													)}
												</TableCell>
												<TableCell className="text-right">
													<Link
														href={`/orders/${order.id}`}
													>
														<Button
															variant="ghost"
															size="sm"
															className="gap-1 hover:gap-2 transition-all"
														>
															View
															<ChevronRight className="w-4 h-4" />
														</Button>
													</Link>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</Card>
				</div>

				{/* Orders List - Mobile Card View */}
				<div className="lg:hidden space-y-4">
					{orders.map((order, idx) => {
						const statusConfig = getStatusConfig(order.orderStatus);
						const StatusIcon = statusConfig.icon;

						return (
							<Card
								key={order.id}
								className="border-2 hover:border-slate-300 transition-all shadow-md"
							>
								<CardContent className="p-5">
									<div className="flex justify-between items-start mb-4">
										<div>
											<p className="text-xs font-medium text-slate-500 mb-1">
												Order #{idx + 1}
											</p>
											<Link
												href={`/orders/${order.id}`}
												className="font-mono text-sm text-blue-600 hover:underline"
											>
												{order.id.substring(0, 16)}...
											</Link>
										</div>
										<Badge
											className={`${statusConfig.color} border px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5`}
										>
											<StatusIcon className="w-3.5 h-3.5" />
											{statusConfig.label}
										</Badge>
									</div>

									<div className="space-y-2 mb-4 text-sm">
										<div className="flex items-center gap-2 text-slate-600">
											<Calendar className="w-4 h-4" />
											<span>
												{new Date(
													order.createdAt
												).toLocaleDateString('en-US', {
													month: 'short',
													day: 'numeric',
													year: 'numeric',
												})}
											</span>
										</div>
										<div className="flex items-center gap-2 text-slate-600">
											<CreditCard className="w-4 h-4" />
											<span>
												{order.paymentMode} •{' '}
												{order.paymentStatus}
											</span>
										</div>
									</div>

									<div className="flex justify-between items-center pt-4 border-t">
										<div>
											<p className="text-xs text-slate-500 mb-1">
												Total Amount
											</p>
											<p className="text-xl font-bold text-slate-900">
												₹
												{formatPrice(
													order.amounts.grandTotal
												)}
											</p>
										</div>
										<Link href={`/orders/${order.id}`}>
											<Button className="gap-2">
												View Details
												<ChevronRight className="w-4 h-4" />
											</Button>
										</Link>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</div>
	);
}