import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';

export interface Cart {
	productId: string;
	productName: string;
	productImg?: string;
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
type CartState = Cart[];

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
        console.error("Error loading cart from localStorage:", error);
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
        console.error("Error saving cart to localStorage:", error);
    }
};

export { loadState }; // Export loadState for use in client components

const initialState: CartState = []; // Initialize state as empty for consistent SSR

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
        setCart(state, action: PayloadAction<CartState>) {
            return action.payload;
        },
		addToCart(state, action: PayloadAction<Cart>) {
			console.log('Adding to cart:', action.payload); 
			state.push(action.payload);
            saveState(state); // Save state after modification
		},
		incrementProductQuantity(state, action: PayloadAction<string>) {
			// i will be getting the key here
			const key = action.payload;
			const existingItem = state.find(
				(item) => item.key === key
			);
			if (existingItem) {
				existingItem.quantity += 1;
                saveState(state); // Save state after modification
			}
		},
		decrementProductQuantity(state, action: PayloadAction<string>) {
						// i will be getting the key here

			const key = action.payload;
			const existingItem = state.find(
				(item) => item.key === key
			);
			console.log(
				'Decrementing product quantity for key:',
				key,
				existingItem
			);
			if (existingItem && existingItem.quantity === 1) {
				const newState = state.filter((item) => item.key !== key);
                saveState(newState); // Save the filtered state
                return newState;
			}
			if (existingItem && existingItem.quantity > 1) {
				existingItem.quantity -= 1;
                saveState(state); // Save state after modification
			}
		},
		removeFromCart(state, action: PayloadAction<number>) {
			state.splice(action.payload, 1);
            saveState(state); // Save state after modification
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		clearCart(state) {
			const newState: CartState = [];
            saveState(newState); // Save the empty state
            return newState;
		},
	},
});

// Basic selectors
export const selectCart = (state: RootState) => state.cart;

// Factory selector: returns a memoized selector instance for a given productId
export const makeSelectProductsByProductId = () =>
	createSelector(
		[selectCart, (_: RootState, productId: string) => productId],
		(cart, productId) => cart.filter((item) => item.productId === productId)
	);


export const {
	addToCart,
	removeFromCart,
	clearCart,
    setCart, // Export the new action
	incrementProductQuantity,
	decrementProductQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
