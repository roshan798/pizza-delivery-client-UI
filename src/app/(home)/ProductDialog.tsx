'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PriceConfiguration, Product } from '@/types/product';
import clsx from 'clsx';
import { formatPrice } from '@/lib/utils';
import CONFIG from '@/config';
import { Topping } from '@/types/types';
import {
	Cart,
	addToCart,
	incrementProductQuantity,
	decrementProductQuantity,
} from '@/lib/cart/cartSlices';
import { useAppDispatch } from '@/lib/hooks';
import CartButton from './CartButton';

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

// ToppingsFetcher component fetching toppings from given URL (no caching)
function ToppingsFetcher({
	url,
	addons,
	setAddons,
}: {
	url: string;
	addons: (Topping & { checked: boolean })[];
	setAddons: React.Dispatch<
		React.SetStateAction<
			(Topping & {
				checked: boolean;
			})[]
		>
	>;
}) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// Fetch toppings on mount or URL change
	useEffect(() => {
		async function fetchToppings() {
			try {
				const response = await fetch(url);
				const json = await response.json();
				if (json.success && Array.isArray(json.data)) {
					setAddons(
						(json.data as Topping[]).map((t) => ({
							checked: false,
							...t,
						}))
					);
				} else {
					setError('Invalid response data');
				}
			} catch {
				setError('Failed to fetch toppings');
			} finally {
				setLoading(false);
			}
		}
		fetchToppings();
	}, [url, setAddons]);

	if (loading) return <div>Loading toppings...</div>;
	if (error) return <div className="text-red-500">{error}</div>;
	const handleOnCheckChange = (id: string) => {
		setAddons((prev) => {
			return prev.map((t) =>
				t.id === id ? { ...t, checked: !t.checked } : t
			);
		});
	};
	return (
		<div className="space-y-3">
			<p className="text-sm font-medium">Extra toppings</p>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 auto-rows-fr">
				{addons.map((t) => {
					const checked = t.checked;
					return (
						<Label
							key={t.id}
							htmlFor={`addon-${t.id}`}
							className={clsx(
								'rounded-lg border p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 min-h-[9.5rem]',
								checked &&
									'border-primary ring-1 ring-primary/30'
							)}
						>
							<div className="relative w-30 h-20 rounded-md overflow-hidden bg-gray-100">
								<Image
									src={t.image}
									alt={t.name}
									fill
									className="object-cover"
								/>
							</div>
							<span className="text-xs text-gray-600 text-center line-clamp-1">
								{t.name}
							</span>
							<span className="text-sm font-medium">
								{formatPrice(t.price)}
							</span>
							<Checkbox
								id={`addon-${t.id}`}
								checked={checked}
								onCheckedChange={() =>
									handleOnCheckChange(t.id)
								}
								className="sr-only"
							/>
						</Label>
					);
				})}
			</div>
		</div>
	);
}

export function ProductDialog({
	open,
	onOpenChange,
	product,
	imgSrc,
	productInCart,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	product: Product;
	imgSrc: string;
	productInCart: Cart | undefined;
}) {
	const dispatch = useAppDispatch();
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
	const handleAddonChange = (type?: string) => {
		if (!productInCart) {
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
			};
			// Call API or Server Action to add to cart
			dispatch(addToCart(cartItem));
		} else if (type === 'increment') {
			dispatch(incrementProductQuantity(productInCart.productId));
		} else {
			dispatch(decrementProductQuantity(productInCart.productId));
		}

		// console.log('Add to cart:', cartItem);
	};
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

						<ToppingsFetcher
							url={toppingsUrl}
							addons={addons}
							setAddons={setAddons}
						/>

						{/* Footer: total + actions */}
						<div className="flex items-center justify-between pt-2 flex-wrap gap-4 border-t mt-4">
							<PriceBreakdown
								addonsPrice={addonsPrice}
								basePrice={basePrice}
								quantity={productInCart?.quantity}
							/>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									onClick={() => onOpenChange(false)}
									className="cursor-pointer"
								>
									Close
								</Button>

								<CartButton
									productInCart={productInCart}
									handleAddonChange={handleAddonChange}
								/>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface PriceBreakdownProps {
	basePrice: number;
	addonsPrice: number;
	quantity: number | undefined;
}
function PriceBreakdown({
	basePrice,
	addonsPrice,
	quantity = 1,
}: PriceBreakdownProps) {
	const total = Math.max(0, basePrice + addonsPrice);
	const totalPrice = total * quantity;

	return (
		<div className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
			<span>{formatPrice(basePrice)}</span>
			<span className="text-primaryfont-bold">+</span>
			<span>{formatPrice(addonsPrice)}</span>
			<span className="text-primary font-bold">=</span>
			<span>{formatPrice(total)}</span>

			{quantity > 1 && (
				<>
					<span className="text-gray-600">×</span>
					<span className="font-medium">{quantity}</span>
					<span className="text-primary font-bold">=</span>
					<span className="text-primary text-base font-bold">
						{formatPrice(totalPrice)}
					</span>
				</>
			)}
		</div>
	);
}
