import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';

export interface Cart {
	productId: string;
	productName: string;
	productImg?: string;
	tenantId: string;

	base: {
		name: string;
		price: number;
	};
	toppings: {
		id: string;
		name: string;
		price: number;
	}[];
	quantity: number;
	key?: string;
}

interface TenantCartGroup {
	tenantId: string;
	tenantName?: string;
	items: Cart[];
}

type CartState = TenantCartGroup[]; // Array of tenant groups

// Helper to load state from localStorage (used by client-side initialization)
const loadState = (): CartState => {
	// Check if running on client-side to avoid localStorage access during SSR
	if (typeof window === 'undefined') {
		return [];
	}
	try {
		const serializedState = localStorage.getItem('cart');
		if (serializedState === null) {
			return [];
		}
		return JSON.parse(serializedState);
	} catch (error) {
		console.error('Error loading cart from localStorage:', error);
		return [];
	}
};

// Helper to save state to localStorage
const saveState = (state: CartState) => {
	if (typeof window === 'undefined') {
		return;
	}
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('cart', serializedState);
	} catch (error) {
		console.error('Error saving cart to localStorage:', error);
	}
};

export { loadState }; // Export loadState for use in client components

const initialState: CartState = [];

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCart(state, action: PayloadAction<CartState>) {
			return action.payload;
		},
		addToCart(state, action: PayloadAction<Cart>) {
			const newItem = action.payload;
			console.log('Adding to cart:', newItem);

			// Find existing tenant group or create new one
			let tenantGroup = state.find(
				(group) => group.tenantId === newItem.tenantId
			);

			if (!tenantGroup) {
				// Create new tenant group
				tenantGroup = { tenantId: newItem.tenantId, items: [] };
				state.push(tenantGroup);
			}

			// Add/update item within tenant group
			const existingItem = tenantGroup.items.find(
				(item) => item.key === newItem.key
			);
			if (existingItem) {
				existingItem.quantity += newItem.quantity || 1;
			} else {
				tenantGroup.items.push(newItem);
			}

			saveState(state);
		},
		incrementProductQuantity(state, action: PayloadAction<string>) {
			const key = action.payload;
			for (const group of state) {
				const existingItem = group.items.find(
					(item) => item.key === key
				);
				if (existingItem) {
					existingItem.quantity += 1;
					saveState(state);
					return;
				}
			}
		},
		decrementProductQuantity(state, action: PayloadAction<string>) {
			const key = action.payload;
			for (const group of state) {
				const existingItemIndex = group.items.findIndex(
					(item) => item.key === key
				);
				if (existingItemIndex !== -1) {
					const existingItem = group.items[existingItemIndex];
					if (existingItem.quantity === 1) {
						group.items.splice(existingItemIndex, 1);
						if (group.items.length === 0) {
							// Remove empty tenant group
							const groupIndex = state.indexOf(group);
							state.splice(groupIndex, 1);
						}
					} else {
						existingItem.quantity -= 1;
					}
					saveState(state);
					return;
				}
			}
		},
		removeFromCart(
			state,
			action: PayloadAction<{ tenantId: string; itemIndex: number }>
		) {
			const { tenantId, itemIndex } = action.payload;
			const tenantGroup = state.find(
				(group) => group.tenantId === tenantId
			);
			if (tenantGroup) {
				tenantGroup.items.splice(itemIndex, 1);
				if (tenantGroup.items.length === 0) {
					const groupIndex = state.indexOf(tenantGroup);
					state.splice(groupIndex, 1);
				}
				saveState(state);
			}
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		clearCart(state) {
			const newState: CartState = [];
			saveState(newState);
			return newState;
		},
		clearCartByTenantId(state, action: PayloadAction<string>) {
			const tenantId = action.payload;

			const tenantGroupIndex = state.findIndex(
				(group) => group.tenantId === tenantId
			);

			if (tenantGroupIndex !== -1) {
				state.splice(tenantGroupIndex, 1);
				saveState(state);
			}
		},
	},
});

// Get all tenant groups
export const selectCartGroups = (state: RootState) => state.cart;

// Total items count
export const selectTotalItems = createSelector([selectCartGroups], (groups) =>
	groups.reduce(
		(total, group) =>
			total + group.items.reduce((sum, item) => sum + item.quantity, 0),
		0
	)
);

// Check if multi-tenant
export const selectIsMultiTenant = createSelector(
	[selectCartGroups],
	(groups) => groups.length > 1
);

// Get items by tenantId
export const selectItemsByTenant = createSelector(
	[selectCartGroups, (_: RootState, tenantId: string) => tenantId],
	(groups, tenantId) => {
		const group = groups.find((g) => g.tenantId === tenantId);
		return group ? group.items : [];
	}
);

// export const selectItemByProductId = createSelector(
// 	[selectCartGroups, (_: RootState, productId: string) => productId],
// 	(groups, productId) => {
// 		for (const group of groups) {
// 			const item = group.items.find(i => i.productId === productId);
// 			if (item) {
// 				return item;
// 			}
// 		}
// 		return null;
// 	}
// );

//
export const makeSelectProductsByProductId = () =>
	createSelector(
		[selectCartGroups, (_: RootState, productId: string) => productId],
		(cartGroups, productId) => {
			const allItems = cartGroups.flatMap((group) => group.items);
			return allItems.filter((item) => item.productId === productId);
		}
	);

export const {
	addToCart,
	removeFromCart,
	clearCart,
	setCart,
	incrementProductQuantity,
	decrementProductQuantity,
	clearCartByTenantId,
} = cartSlice.actions;

export default cartSlice.reducer;
