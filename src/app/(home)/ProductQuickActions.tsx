'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { ProductDialog } from './ProductDialog';
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from '@/components/ui/tooltip';
import { Product } from '@/types/product';
import { useAppSelector } from '@/lib/hooks';
import CartButton from './CartButton';

export function ProductQuickActions({
	product,
	imgSrc,
}: {
	product: Product;
	imgSrc: string;
}) {
	const [open, setOpen] = useState(false);
	const productInCart = useAppSelector((state) => {
		return state.cart.find((item) => item.productId === product._id);
	});

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="icon"
							className="md:size-auto md:px-3 md:py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition [&_svg]:size-5"
							aria-label="Add to Cart"
							onClick={() => setOpen(true)}
						>
							<ShoppingCart className="shrink-0" />
							<span className="hidden md:inline ml-2">
								Add to Cart
							</span>
						</Button>
						{/* <CartButton productInCart={productInCart} handleAddonChange={() => {
                            
                        }}/> */}
					</TooltipTrigger>
					<TooltipContent side="top" className="md:hidden">
						<p>Add to Cart</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<ProductDialog
				open={open}
				onOpenChange={setOpen}
				product={product}
				imgSrc={imgSrc}
				productInCart={productInCart}
			/>
		</>
	);
}
