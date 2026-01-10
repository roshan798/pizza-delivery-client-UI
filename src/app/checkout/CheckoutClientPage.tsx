'use client';
import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadState, setCart } from '@/lib/cart/cartSlices';
import { CartLoading } from '../cart/CartLoading';
import { EmptyCart } from '../cart/EmptyCart';
import { CheckoutForm } from './CheckoutForm';
import { useToast } from '@/components/ui/toast';
import { CheckoutSummary } from './CheckoutSummary';

const CheckoutClientPage = () => {
	const cart = useAppSelector((state) => state.cart);
	const dispatch = useAppDispatch();
	const [isLoadedFromLocalStorage, setIsLoadedFromLocalStorage] =
		useState(false);

	const { toast } = useToast();
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		zip: '',
		paymentMethod: 'cashOnDelivery',
		couponCode: '',
	});
	useEffect(() => {
		// This effect runs only on the client side after hydration
		const storedCart = loadState();
		if (storedCart.length > 0) {
			dispatch(setCart(storedCart));
		}
		setIsLoadedFromLocalStorage(true);
	}, [dispatch]);

	const handleFormChange = useCallback((data: typeof formData) => {
		setFormData(data);
	}, []);

	const itemsTotal = cart.reduce(
		(sum, item) =>
			sum +
			(item.base.price + item.toppings.reduce((s, t) => s + t.price, 0)) *
				item.quantity,
		0
	);

	const delivery = cart.length ? 40 : 0; // example
	const discount = 0; // For now, discount is 0. This would come from coupon application.
	const tax = Math.round((itemsTotal - discount) * 0.05); // example 5% of (itemsTotal - discount)
	const grandTotal = itemsTotal + delivery + tax - discount;

	const handlePlaceOrder = useCallback(() => {
		console.log('Placing order with:', formData, 'Totals:', {
			itemsTotal,
			delivery,
			tax,
			discount,
			grandTotal,
		});
		toast({
			title: 'Order Placed!',
			description: 'Your order has been successfully placed. Thank you!',
			variant: 'success',
		});
		// In a real application, you would send formData and totals to your backend
		// dispatch(clearCart()); // Clear cart after successful order
		// router.push('/order-confirmation'); // Redirect to confirmation page
	}, [formData, itemsTotal, delivery, tax, discount, grandTotal, toast]);

	if (!isLoadedFromLocalStorage) {
		return <CartLoading />; // Use the existing CartLoading component
	}

	if (!cart.length) {
		return <EmptyCart />; // Use the existing EmptyCart component
	}

	return (
		<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
			{/* Left: Checkout Form */}
			<CheckoutForm onFormChange={handleFormChange} />

			{/* Right: Order Summary */}
			<CheckoutSummary
				itemsTotal={itemsTotal}
				delivery={delivery}
				tax={tax}
				discount={discount}
				grandTotal={grandTotal}
				onPlaceOrder={handlePlaceOrder}
			/>
		</div>
	);
};

export default CheckoutClientPage;
