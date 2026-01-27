'use client';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CartSummary } from './CartSummary';
import { TenantSummary } from '@/types/cart';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface CartSummarySectionProps {
	tenantSummaries: TenantSummary[];
	isMultiTenant: boolean;
	overallTotal: number;
	vendorCount: number;
}

export function CartSummarySection({ tenantSummaries, isMultiTenant, overallTotal, vendorCount }: CartSummarySectionProps) {
	return (
		<div className="lg:w-80 space-y-4">
			{tenantSummaries.map((summary) => (
				<Card key={summary.tenantId}>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">
								{summary.tenantName}
							</h3>
							<Badge>{summary.itemsCount} items</Badge>
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<CartSummary
							key={`summary-${summary.tenantId}`}
							itemsTotal={summary.itemsTotal}
							delivery={summary.delivery}
							tax={summary.tax}
							grandTotal={summary.grandTotal}
							isGrouped={true}
                            tenantId={summary.tenantId}
                            tenantName={summary.tenantName}
						/>
					</CardContent>
				</Card>
			))}

			{isMultiTenant && (
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-xl">Total Order</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-primary">
							₹{formatPrice(overallTotal)}
						</div>
						<p className="text-sm text-muted-foreground mt-1">
							{vendorCount} separate order{vendorCount !== 1 ? 's' : ''}
						</p>
						<Button className="w-full mt-4" size="lg" asChild disabled={true} hidden>
							<Link href="/checkout">
								Place All Orders
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}