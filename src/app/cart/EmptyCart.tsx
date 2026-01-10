'use client';

import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function EmptyCart() {
	return (
		<div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
				<ShoppingBag className="h-6 w-6 text-muted-foreground" />
			</div>
			<h1 className="text-xl font-semibold">Your cart is empty</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Add some items to your cart to see them here.
			</p>
			<Button className="mt-4" asChild>
				<Link href="/">Continue shopping</Link>
			</Button>
		</div>
	);
}
