'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PriceConfiguration, Product } from '@/types/product';
import clsx from 'clsx';
import { formatPrice } from '@/lib/utils';
import CONFIG from '@/config';
import { Topping } from '@/types/types';
import {
	Cart,
	addToCart,
	makeSelectProductsByProductId,
} from '@/lib/cart/cartSlices';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useToast } from '@/components/ui/toast';
import Toppings from './Toppings';
import PriceBreakdown from './PriceBreakdown';

function parseBase(pc?: Map<string, PriceConfiguration>) {
	const bases: { key: string; price: number }[] = [];
	if (!pc) return bases;

	for (const [key, cfg] of Object.entries(pc)) {
		if (cfg.priceType !== 'base') continue;
		const first = Object.values(cfg.availableOptions ?? {})[0];
		const price = typeof first === 'number' ? first : 0;
		bases.push({ key, price });
	}

	const order = ['small', 'medium', 'large'];
	bases.sort((a, b) => {
		const ia = order.indexOf(a.key);
		const ib = order.indexOf(b.key);
		return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
	});

	return bases;
}


export function ProductDialog({
	open,
	onOpenChange,
	product,
	imgSrc,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	product: Product;
	imgSrc: string;
}) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { toast } = useToast();
	const bases = useMemo(
		() => parseBase(product.priceConfiguration),
		[product.priceConfiguration]
	);
	const defaultBase = bases.find((b) => b.key === 'medium') ??
		bases[0] ?? { key: 'medium', price: 0 };
	const [size, setSize] = useState<string>(defaultBase.key);
	const [addons, setAddons] = useState<(Topping & { checked: boolean })[]>(
		[]
	);

	const basePrice =
		bases.find((b) => b.key === size)?.price ?? defaultBase.price;

	const addonsPrice = addons.reduce(
		(sum, t) => sum + (t.checked ? t.price : 0),
		0
	);

	// URL for toppings from product config
	const toppingsUrl = CONFIG.baseUrl + CONFIG.toppings.url;

	// get allCombinations of addons on this products that are added in the cart
	const selectProductsForThisProduct = useMemo(() => makeSelectProductsByProductId(), []);
	const productsInCart = useAppSelector((state) => selectProductsForThisProduct(state, product._id));
	const handleAddToCart = () => {
		const productId = product._id;
		const base = {
			name: size,
			price: basePrice,
		};
		const toppings = addons
			.filter((t) => t.checked)
			.map((t) => ({
				id: t.id,
				name: t.name,
				price: t.price,
			}));
		const cartItem: Cart = {
			productId,
			quantity: 1,
			base,
			toppings,
			key: '' // will be set later
		};
		// check same coposition is added or not is cart
		const key = makeKey(cartItem);
		// Check whether an identical composition already exists in cart
		let duplicateFound = false;
		for (const pInCart of productsInCart) {
			if (pInCart.key === key) {
				duplicateFound = true;
				// Show an in-app toast with action to view cart
				toast({
					title: 'Item already in cart',
					description: 'This exact item (same size and toppings) is already in your cart.',
					actionText: 'View cart',
					variant: 'warning',
					onAction: () => {
						router.push('/cart');
						onOpenChange(false);
					},
				});
				onOpenChange(false);
				break;
			}
		}
		if (duplicateFound) {
			// Do not add a duplicate item
			return;
		}

		if (!cartItem.key || cartItem.key === '') {
			cartItem.key = key;
		}
		console.log("Final Cart Item :", cartItem)
		// Call API or Server Action to add to cart
		dispatch(addToCart(cartItem));
		onOpenChange(false)

	}
	const makeKey = (cart: Cart) => {
		const toppingIds = cart.toppings.map(t => t.id).sort().join(',');
		return `${cart.productId}|${cart.base.name}|${toppingIds}`;
	}
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[96vw] max-h-screen max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl p-0 overflow-hidden">
				<div className="grid grid-cols-1 md:grid-cols-2">
					{/* Left: Image */}
					<div className="bg-white p-6 md:p-8">
						<div className="relative rounded-xl overflow-hidden bg-gray-50">
							<div className="aspect-[4/3] w-full">
								<Image
									src={imgSrc}
									alt={product.name}
									fill
									className="object-cover h-full w-full"
								/>
							</div>
						</div>
					</div>

					{/* Right: Details */}
					<div className="border-t md:border-t-0 md:border-l p-6 md:p-8 space-y-5 max-h-screen overflow-y-scroll">
						<DialogHeader className="space-y-1">
							<DialogTitle className="text-xl">
								{product.name}
							</DialogTitle>
							<DialogDescription className="text-sm text-gray-600 mask-ellipse">
								{product.description ||
									'Choose a size and extra toppings.'}
							</DialogDescription>
						</DialogHeader>

						{/* Sizes */}
						{bases.length > 0 && (
							<div className="space-y-2">
								<p className="text-sm font-medium">Size</p>
								<RadioGroup
									value={size}
									onValueChange={setSize}
									className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-min"
								>
									{bases.map((b) => (
										<Label
											key={b.key}
											htmlFor={`size-${b.key}`}
											className={clsx(
												'flex items-center justify-between rounded-md border px-3 py-2 cursor-pointer hover:bg-gray-50',
												size === b.key
													? 'border-primary'
													: 'border-gray-300'
											)}
										>
											<RadioGroupItem
												id={`size-${b.key}`}
												value={b.key}
												className="self-center"
											/>
											<div
												className={clsx(
													'h-full border-l mx-1',
													size === b.key
														? 'border-primary/60'
														: 'border-gray-300'
												)}
											/>
											<div className="flex flex-col justify-center flex-grow gap-1">
												<span className="capitalize truncate">
													{b.key}
												</span>
												<span className="text-sm text-gray-700">
													{formatPrice(b.price)}
												</span>
											</div>
										</Label>
									))}
								</RadioGroup>
							</div>
						)}

						{/* Extra toppings */}
						{
							product.isToppingsAvailable &&
							<Toppings
								url={toppingsUrl}
								addons={addons}
								setAddons={setAddons}
							/>

						}

						{/* Footer: total + actions */}
						<div className="flex items-center justify-between pt-2 flex-wrap gap-4 border-t mt-4">
							<PriceBreakdown
								addonsPrice={addonsPrice}
								basePrice={basePrice}
							/>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									onClick={() => onOpenChange(false)}
									className="cursor-pointer"
								>
									Close
								</Button>

								<Button
									onClick={handleAddToCart}
								>
									Add to
								</Button>
								{/* <CartButton
									productInCart={productInCart}
									handleAddonChange={handleAddonChange}
								/> */}
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
