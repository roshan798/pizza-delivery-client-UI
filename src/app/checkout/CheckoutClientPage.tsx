'use client';
import React, { useCallback, useMemo, useRef } from 'react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { clearCartByTenantId, loadState, setCart } from '@/lib/cart/cartSlices';
import { CartLoading } from '../cart/CartLoading';
import { CheckoutForm } from './CheckoutForm';
import { useToast } from '@/components/ui/toast';
import { CheckoutSummary } from './CheckoutSummary';
import * as uuid from 'uuid';
import { OrderItemRequest, CreateOrderRequest } from './order-types';
import { FormData as CheckoutFormData } from './useCheckoutForm';

interface CheckoutClientPageProps {
	tenantId: string;
}

const CheckoutClientPage = ({ tenantId }: CheckoutClientPageProps) => {
	const cartGroups = useAppSelector((state) => state.cart);
	const dispatch = useAppDispatch();
	const [isLoadedFromLocalStorage, setIsLoadedFromLocalStorage] =
		useState(false);
	const { toast } = useToast();
	const idempotancyKeyRef = useRef('');

	const [formData, setFormData] = useState({
		customerId: '',
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		zip: '',
		paymentMethod: 'CASH' as 'CASH' | 'CARD',
		couponCode: '',
	} as CheckoutFormData);
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		const storedCart = loadState();
		if (storedCart.length > 0) {
			dispatch(setCart(storedCart));
		}
		setIsLoadedFromLocalStorage(true);
	}, [dispatch]);

	// Filter ONLY for specific tenantId
	const tenantGroup = useMemo(
		() => cartGroups.find((group) => group.tenantId === tenantId),
		[cartGroups, tenantId]
	);

	const handleFormChange = useCallback((data: CheckoutFormData) => {
		setFormData(data);
	}, []);

	// Calculate totals for THIS tenant only
	const { itemsTotal, grandTotal, itemsCount } = useMemo(() => {
		if (!tenantGroup) {
			return { itemsTotal: 0, grandTotal: 0, itemsCount: 0 };
		}

		const total = tenantGroup.items.reduce((sum, item) => {
			const itemTotal =
				item.base.price +
				item.toppings.reduce((s, t) => s + t.price, 0);
			return sum + itemTotal * item.quantity;
		}, 0);

		const itemsCount = tenantGroup.items.reduce(
			(sum, item) => sum + item.quantity,
			0
		);
		const delivery = tenantGroup.items.length ? 40 : 0;
		const discount = 0;
		const tax = Math.round((total - discount) * 0.05);
		const grandTotal = total + delivery + tax - discount;

		return { itemsTotal: total, grandTotal, itemsCount };
	}, [tenantGroup]);

	const handlePlaceOrder = useCallback(async () => {
		if (!tenantGroup || !tenantGroup.items.length) {
			toast({
				title: 'No Items',
				description: `No items found for ${tenantId}`,
				variant: 'error',
			});
			return;
		}

		// console.log(`Placing order for tenant: ${tenantId}`, {
		// 	formData,
		// 	itemsTotal,
		// 	grandTotal,
		// });

		const items: OrderItemRequest[] = tenantGroup.items.map((item) => ({
			productId: item.productId,
			productName: item.productName,
			quantity: item.quantity,
			base: {
				name: item.base.name,
				price: item.base.price,
			},
			toppings: item.toppings.map((t) => ({
				id: t.id,
				name: t.name,
				price: t.price,
			})),
			key: item.key!,
		}));
		if (idempotancyKeyRef.current === '') {
			idempotancyKeyRef.current = uuid.v4() + formData.customerId;
		}

		const orderData: CreateOrderRequest = {
			customerId: formData.customerId,
			tenantId: tenantId,
			address: `${formData.address}, ${formData.city}, ${formData.zip}`,
			phone: formData.phone,
			paymentMode: formData.paymentMethod,
			subTotal: itemsTotal,
			tax: Math.round(itemsTotal * 0.05),
			deliveryCharge: 40,
			delivery: 40,
			discount: 0,
			grandTotal: grandTotal,
			couponCode: formData.couponCode || '',
			items,
		};

		try {
			setIsPending(true);
			// Make a fetch call to the Next.js API route
			const res = await fetch('/api/order/create-order', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'idempotency-key': idempotancyKeyRef.current, // Pass idempotency key in headers
				},
				body: JSON.stringify(orderData),
			});

			if (!res.ok)
				throw new Error(
					`Order failed: ${res.status} - ${await res.text()}`
				);
			const result: { paymentUrl?: string } = await res.json();
			toast({
				title: 'Order Placed!',
				description: `Your order has been placed successfully!`,
				variant: 'success',
			});

			console.log('Order created:', result);
			if (result.paymentUrl) {
				window.location.href = result.paymentUrl;
			} else {
				window.location.href = '/';
			}
			dispatch(clearCartByTenantId(tenantId));
			// The API route now guarantees paymentUrl is always a string (either Stripe URL or default confirmation URL)
			//
		} catch (error) {
			toast({
				title: 'Order Failed',
				description: 'Please try again.',
				variant: 'error',
			});
			console.error('Order error:', error);
		} finally {
			setIsPending(false);
		}
	}, [
		dispatch,
		formData,
		grandTotal,
		itemsTotal,
		tenantGroup,
		tenantId,
		toast,
	]);

	if (!isLoadedFromLocalStorage) {
		return <CartLoading />;
	}

	if (!tenantGroup || !tenantGroup.items.length) {
		return <NoItemsFound tenantId={tenantId} />;
	}

	return (
		<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
			{/* Left: Checkout Form */}
			<CheckoutForm
				onFormChange={handleFormChange}
				isPending={isPending}
			/>

			{/* Right: Order Summary */}
			<CheckoutSummary
				itemsTotal={itemsTotal}
				delivery={40}
				tax={Math.round(itemsTotal * 0.05)}
				discount={0}
				grandTotal={grandTotal}
				itemsCount={itemsCount}
				isPending={isPending}
				tenantName={tenantGroup.tenantName || tenantId}
				onPlaceOrder={handlePlaceOrder}
			/>
		</div>
	);
};

export default CheckoutClientPage;

const NoItemsFound = ({ tenantId }: { tenantId: string }) => {
	return (
		<div className="mx-auto max-w-2xl py-12 px-4">
			<div className="text-center">
				<h1 className="text-2xl font-bold text-gray-900 mb-4">
					No Items Found
				</h1>
				<p className="text-muted-foreground mb-8 max-w-md mx-auto">
					No items found for vendor {tenantId}. Please check your cart
					and try again.
				</p>
				<a
					href="/cart"
					className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
				>
					← Back to Cart
				</a>
			</div>
		</div>
	);
};
