// components/products/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from '@/components/ui/tooltip';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';

export function AddToCartButton({ product }: { product: Product }) {
	const [open, setOpen] = useState(false);

	const ButtonInner = (
		<Button
			size="icon"
			className="md:size-auto md:px-3 md:py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition [&_svg]:size-5"
			aria-label="Add to Cart"
			onClick={() => setOpen(true)}
		>
			<ShoppingCart className="shrink-0" />
			<span className="hidden md:inline ml-2">Add to Cart</span>
		</Button>
	);

	return (
		<TooltipProvider>
			<Dialog open={open} onOpenChange={setOpen}>
				{/* Tooltip for small screens */}
				<Tooltip>
					<TooltipTrigger asChild>{ButtonInner}</TooltipTrigger>
					<TooltipContent side="top" className="md:hidden">
						<p>Add to Cart</p>
					</TooltipContent>
				</Tooltip>

				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>{product.name}</DialogTitle>
						<DialogDescription>
							{product.description ||
								'Select options and add to cart.'}
						</DialogDescription>
					</DialogHeader>

					{/* Put your size/add-ons UI here, e.g., RadioGroup + Checkbox */}
					{/* ... */}

					<DialogFooter>
						<Button onClick={() => setOpen(false)}>Close</Button>
						<Button className="bg-primary text-white hover:bg-primary/90">
							Add
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</TooltipProvider>
	);
}
