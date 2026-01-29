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
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { clearCart } from '@/lib/cart/cartSlices';
import { useAppDispatch } from '@/lib/hooks';

interface CartHeaderProps {
	overallItemsCount: number;
	vendorCount: number;
	isMultiTenant: boolean;
}

export function CartHeader({
	overallItemsCount,
	vendorCount,
	isMultiTenant,
}: CartHeaderProps) {
	const dispatch = useAppDispatch();

	return (
		<CardHeader className="flex flex-row items-center justify-between">
			<div>
				<CardTitle>Shopping Cart</CardTitle>
				<div className="flex items-center gap-2">
					<CardDescription>
						{overallItemsCount} item
						{overallItemsCount !== 1 ? 's' : ''} across{' '}
						{vendorCount} vendor{vendorCount !== 1 ? 's' : ''}
					</CardDescription>
					{isMultiTenant && (
						<Badge
							variant="secondary"
							className="bg-orange-100 text-orange-800"
						>
							Multi-Vendor
						</Badge>
					)}
				</div>
			</div>

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="outline" size="sm">
						Clear All ({vendorCount} vendor
						{vendorCount !== 1 ? 's' : ''})
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Clear entire cart?</AlertDialogTitle>
						<AlertDialogDescription>
							This will remove all items from {vendorCount} vendor
							{vendorCount !== 1 ? 's' : ''}. This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => dispatch(clearCart())}
							className="bg-destructive text-white hover:bg-destructive/90"
						>
							Clear All
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</CardHeader>
	);
}
