'use client';

import {
	Card,
	CardContent,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { setCart } from '@/lib/cart/cartSlices';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect, useState, useMemo } from 'react';
import { loadState } from '@/lib/cart/cartSlices';
import { CartLoading } from './CartLoading';
import { EmptyCart } from './EmptyCart';
import { selectIsMultiTenant } from '@/lib/cart/cartSlices';
import { TenantSummary } from '@/types/cart'; // Import new types
import { CartHeader } from './CartHeader'; // Import new component
import { CartGroupItem } from './CartGroupItem'; // Import new component
import { CartSummarySection } from './CartSummarySection'; // Import new component

const CartPage = () => {
	const [isLoadedFromLocalStorage, setIsLoadedFromLocalStorage] = useState(false);
	const cartGroups = useAppSelector((state) => state.cart);
	const isMultiTenant = useAppSelector(selectIsMultiTenant);
	const dispatch = useAppDispatch();
	useEffect(() => {
		const storedCart = loadState();
		if (storedCart.length > 0) {
			dispatch(setCart(storedCart));
		}
		setIsLoadedFromLocalStorage(true);
	}, [dispatch]);

	const tenantEntities = useAppSelector((state) => state.tenants.tenants);

	// Calculate totals per tenant group, ensuring tenantName is included
	const tenantSummaries: TenantSummary[] = useMemo(() =>
		cartGroups.map(group => {
			const tenant = tenantEntities.find(t => t.id.toString() === group.tenantId.toString());
			const tenantName = tenant ? tenant.name : group.tenantId;
			const itemsTotal = group.items.reduce((sum, item) => {
				const itemTotal = item.base.price +
					item.toppings.reduce((s, t) => s + t.price, 0);
				return sum + (itemTotal * item.quantity);
			}, 0);

			const itemsCount = group.items.reduce((sum, item) => sum + item.quantity, 0);
			const delivery = group.items.length ? 40 : 0;
			const tax = Math.round(itemsTotal * 0.05);
			const grandTotal = itemsTotal + delivery + tax;

			return {
				...group,
				tenantId: group.tenantId, // Ensure tenantId is explicitly included for TenantSummary type
				tenantName,
				itemsTotal,
				itemsCount,
				delivery,
				tax,
				grandTotal
			};
		}), [cartGroups, tenantEntities]
	);

	if (!isLoadedFromLocalStorage) {
		return <CartLoading />;
	}

	const overallTotal = tenantSummaries.reduce((sum, summary) => sum + summary.grandTotal, 0);
	const overallItemsCount = tenantSummaries.reduce((sum, summary) => sum + summary.itemsCount, 0);

	if (!cartGroups.length) {
		return <EmptyCart />;
	}
	return (
		<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
			{/* Left: Multi-tenant cart items */}
			<Card className="flex-1">
				{/* CartHeader component handles the top section */}
				<CartHeader overallItemsCount={overallItemsCount} vendorCount={cartGroups.length} isMultiTenant={isMultiTenant} />

				<Separator className="my-4" />

				<CardContent className="p-0">
					<div className="px-4 py-2">
						{cartGroups.map((group, groupIndex) => (
							<CartGroupItem key={group.tenantId} group={group} summary={tenantSummaries[groupIndex]} />
						))}
					</div>
				</CardContent>
			</Card>

			{/* Right: Multi-tenant summary */}
			{/* CartSummarySection component handles the right-hand summary */}
			<CartSummarySection tenantSummaries={tenantSummaries} isMultiTenant={isMultiTenant} overallTotal={overallTotal} vendorCount={cartGroups.length} />
		</div>
	);
};

export default CartPage;
