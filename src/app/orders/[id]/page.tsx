'use client';
import CONFIG from '@/config';
import { OrderResponseDto,  } from '@/types/order-types';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import OrderStepper from './OrderStepper';
import OrderDeliveryDetailsCard from './OrderDeliveryDetailsCard';
import OrderHeader from './OrderHeader';
import OrderItemsListCard from './OrderItemsListCard';
import OrderLoadingSkeleton from './OrderLoadingSkeleton';
import OrderNotFound from './OrderNotFound';
import OrderPaymentDetailsCard from './OrderPaymentDetailsCard';
import OrderStatusOverviewCard from './OrderStatusOverviewCard';
import OrderSummaryTotalsCard from './OrderSummaryTotalsCard';

async function getOrderById(orderId: string): Promise<OrderResponseDto | null> {
	const URL = CONFIG.baseUrl + CONFIG.order.url + `/orders/${orderId}`;
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
			console.error(`Failed to fetch order ${orderId}: ${response.status} - ${await response.text()}`);
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
};

export default function OrderDetailsPage() {
	const { id } = useParams();
	const [order, setOrder] = useState<OrderResponseDto | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrder = async () => {
			setLoading(true);
			const fetchedOrder = await getOrderById(id as string);
			setOrder(fetchedOrder);
			setLoading(false);
		};
		fetchOrder();
	}, [id]);

	if (loading) {
		return <OrderLoadingSkeleton />;
	}

	if (!order) {
		return <OrderNotFound />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
			<div className="container mx-auto px-4 py-8 max-w-5xl">
				<OrderHeader createdAt={order.createdAt} />

				{/* Order Stepper */}
				<OrderStepper status={order.orderStatus} />

				<OrderStatusOverviewCard orderId={order.id} orderStatus={order.orderStatus} />

				{/* Rest of the components remain the same */}
				{/* Details Grid */}
				<div className="grid md:grid-cols-2 gap-6 mb-6">
					{/* Delivery Details */}
					<OrderDeliveryDetailsCard address={order.address} phone={order.phone} tenantId={order.tenantId} />

					{/* Payment Details */}
					<OrderPaymentDetailsCard
						paymentMode={order.paymentMode}
						paymentStatus={order.paymentStatus}
						couponCode={order.couponCode}
					/>
				</div>

				{/* Order Items */}
				<OrderItemsListCard items={order.items} />

				{/* Order Summary */}
				<OrderSummaryTotalsCard amounts={order.amounts} />
			</div>
		</div>
	);
}
