import { Cart } from '@/lib/cart/cartSlices'; // Assuming Cart type is exported from cartSlices

/**
 * Represents a group of cart items belonging to a single tenant.
 */
export interface CartGroup {
	tenantId: string;
	items: Cart[];
}

/**
 * Represents a summary of a single tenant's cart, including calculated totals.
 */
export interface TenantSummary extends CartGroup {
	tenantName: string;
	itemsTotal: number;
	itemsCount: number;
	delivery: number;
	tax: number;
	grandTotal: number;
}
