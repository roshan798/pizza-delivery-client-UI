'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductDialog } from './(productDialogue)/ProductDialog';
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from '@/components/ui/tooltip';
import { Product } from '@/types/product';

export function ProductQuickActions({
	product,
	imgSrc,
}: {
	product: Product;
	imgSrc: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="sm"
							variant="outline"
							className="rounded-full text-primary border-primary/50 hover:text-primary"
							aria-label="Choose"
							onClick={() => setOpen(true)}
						>
							{/* <Settings className="shrink-0" /> */}
							<span className="ml-2">
								Choose
							</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" className="md:hidden">
						<p>Choose</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>



			<ProductDialog
				open={open}
				onOpenChange={setOpen}
				product={product}
				imgSrc={imgSrc}
			/>
		</>
	);
}
