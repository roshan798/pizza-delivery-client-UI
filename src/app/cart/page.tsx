'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { clearCart, setCart } from '@/lib/cart/cartSlices';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { loadState } from '@/lib/cart/cartSlices';
import { Separator } from '@/components/ui/separator';
import { CartLoading } from './CartLoading';
import { EmptyCart } from './EmptyCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

const CartPage = () => {
	const cart = useAppSelector((state) => state.cart);
	const dispatch = useAppDispatch();
	const [isLoadedFromLocalStorage, setIsLoadedFromLocalStorage] =
		useState(false);

	useEffect(() => {
		// This effect runs only on the client side after hydration
		const storedCart = loadState();
		if (storedCart.length > 0) {
			dispatch(setCart(storedCart));
		}
		setIsLoadedFromLocalStorage(true);
	}, [dispatch]);

	if (!isLoadedFromLocalStorage) {
		return <CartLoading />;
	}

	const itemsTotal = cart.reduce(
		(sum, item) =>
			sum +
			(item.base.price + item.toppings.reduce((s, t) => s + t.price, 0)) *
				item.quantity,
		0
	);

	const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

	const delivery = cart.length ? 40 : 0; // example
	const tax = Math.round(itemsTotal * 0.05); // example 5%
	const grandTotal = itemsTotal + delivery + tax;

	if (!cart.length) {
		return <EmptyCart />;
	}

	return (
		<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
			{/* Left: items */}
			<Card className="flex-1">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Shopping Cart</CardTitle>
						<CardDescription>
							{itemsCount} item{itemsCount > 1 && 's'} in your
							cart
						</CardDescription>
					</div>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="outline" size="sm">
								Clear cart
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Clear cart?</AlertDialogTitle>
								<AlertDialogDescription>
									This will remove all items from your cart.
									You cannot undo this action.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => dispatch(clearCart())}
									className="bg-destructive text-white hover:bg-destructive/90"
								>
									Clear
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardHeader>

				<Separator className="my-4" />

				<CardContent className="p-0">
					<ScrollArea className=" px-4 py-2">
						<ul className="space-y-4">
							{cart.map((item, index) => (
								<CartItem
									key={item.key || index}
									item={item}
									index={index}
								/>
							))}
						</ul>
					</ScrollArea>
				</CardContent>
			</Card>

			{/* Right: summary */}
			<CartSummary
				itemsTotal={itemsTotal}
				delivery={delivery}
				tax={tax}
				grandTotal={grandTotal}
			/>
		</div>
	);
};

export default CartPage;
