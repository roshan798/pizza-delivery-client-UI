'use client';

import { Separator } from '@/components/ui/separator';
import { CartItem } from './CartItem';
import { CartGroup, TenantSummary } from '@/types/cart';
import { formatPrice } from '@/lib/utils';

interface CartGroupItemProps {
	group: CartGroup;
	summary: TenantSummary;
}

export function CartGroupItem({ group, summary }: CartGroupItemProps) {
	return (
		<div key={group.tenantId} className="mb-8 last:mb-0">
			{/* Tenant Group Header */}
			<div className="mb-6 flex items-center justify-between pb-4 border-b">
				<div className="flex items-center gap-3">
					{/* <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
						<span className="text-white font-semibold text-sm">
							{group.tenantId.slice(-4).toUpperCase()}
						</span>
					</div> */}
					<div>
						<h3 className="font-semibold text-lg">
							{summary.tenantName}
						</h3>
						<p className="text-sm text-muted-foreground">
							{summary.itemsCount} item
							{summary.itemsCount !== 1 ? 's' : ''}
						</p>
					</div>
				</div>
				<div className="text-right">
					<p className="font-semibold">
						₹{formatPrice(summary.grandTotal)}
					</p>
					<p className="text-xs text-muted-foreground">
						+₹{formatPrice(summary.delivery)} delivery
					</p>
				</div>
			</div>

			{/* Tenant Items */}
			<ul className="space-y-4 mb-6">
				{group.items.map((item, itemIndex) => (
					<CartItem
						key={item.key || itemIndex}
						item={item}
						tenantId={group.tenantId}
						itemIndex={itemIndex}
					/>
				))}
			</ul>
			<Separator />
		</div>
	);
}
