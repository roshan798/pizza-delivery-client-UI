'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface CartSummaryProps {
	itemsTotal: number;
	delivery: number;
	tax: number;
	grandTotal: number;
	isGrouped?: boolean;
	tenantId?: string;
	tenantName?: string;
}

export function CartSummary({
	itemsTotal,
	delivery,
	tax,
	grandTotal,
	isGrouped = false,
	tenantId,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	tenantName,
}: CartSummaryProps) {
	const tenantCheckoutHref = tenantId
		? `/checkout?tenant=${tenantId}`
		: '/checkout';

	return (
		<Card
			className={` p-0 w-full ${isGrouped ? 'lg:max-w-sm self-start' : 'lg:w-80'} shadow-none border-none`}
		>
			<CardHeader className="pb-3">
				<CardTitle>Order Summary</CardTitle>

				<CardDescription>
					{isGrouped
						? 'Review Restraunt order.'
						: 'Review all orders before checkout.'}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-3">
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Items total</span>
					<span className="font-medium">
						₹{formatPrice(itemsTotal)}
					</span>
				</div>

				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Delivery</span>
					<span className="font-medium">
						{delivery ? `₹${formatPrice(delivery)}` : 'Free'}
					</span>
				</div>

				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Tax (5%)</span>
					<span className="font-medium">₹{formatPrice(tax)}</span>
				</div>

				<Separator className="my-4" />

				<div className="flex items-center justify-between text-base">
					<span className="font-semibold">Total</span>
					<span className="text-lg font-bold">
						₹{formatPrice(grandTotal)}
					</span>
				</div>
			</CardContent>

			<CardFooter className="flex flex-col gap-2 pt-4">
				{isGrouped ? (
					// Single tenant checkout
					<Button className="w-full" asChild>
						<Link href={tenantCheckoutHref}>Checkout</Link>
					</Button>
				) : (
					// Overall checkout with multi-tenant info
					<>
						<Button
							className="w-full "
							size="lg"
							asChild
							disabled={itemsTotal !== 0}
						>
							<Link href={tenantCheckoutHref}>
								Place All Orders (
								{itemsTotal > 0 &&
									`₹${formatPrice(grandTotal)}`}
								)
							</Link>
						</Button>
						<Button variant="outline" className="w-full" asChild>
							<Link href="/">Continue shopping</Link>
						</Button>
					</>
				)}
			</CardFooter>
		</Card>
	);
}
