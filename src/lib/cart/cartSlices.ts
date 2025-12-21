import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';

export interface Cart {
	productId: string;
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

const initialState = [] as CartState;

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart(state, action: PayloadAction<Cart>) {
			console.log('Adding to cart:', action.payload); 
			state.push(action.payload);
		},
		incrementProductQuantity(state, action: PayloadAction<string>) {
			// i will be getting the key here
			const key = action.payload;
			const existingItem = state.find(
				(item) => item.key === key
			);
			if (existingItem) {
				existingItem.quantity += 1;
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
				return state.filter((item) => item.key !== key);
			}
			if (existingItem && existingItem.quantity > 1) {
				existingItem.quantity -= 1;
			}
		},
		removeFromCart(state, action: PayloadAction<number>) {
			state.splice(action.payload, 1);
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		clearCart(state) {
			return [];
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
	incrementProductQuantity,
	decrementProductQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
