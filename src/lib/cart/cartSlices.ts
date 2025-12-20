import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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
}
type CartState = Cart[];

const initialState = [] as CartState;

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart(state, action: PayloadAction<Cart>) {
			const productId = action.payload.productId;
			const existingItemIndex = state.findIndex(
				(item) => item.productId === productId
			);
			if (existingItemIndex !== -1) {
				state[existingItemIndex].quantity += action.payload.quantity;
				return state;
			}
			state.push(action.payload);
		},
		incrementProductQuantity(state, action: PayloadAction<string>) {
			const productId = action.payload;
			const existingItem = state.find(
				(item) => item.productId === productId
			);
			if (existingItem) {
				existingItem.quantity += 1;
			}
		},
		decrementProductQuantity(state, action: PayloadAction<string>) {
			const productId = action.payload;
			const existingItem = state.find(
				(item) => item.productId === productId
			);
			console.log(
				'Decrementing product quantity for productId:',
				productId,
				existingItem
			);
			if (existingItem && existingItem.quantity === 1) {
				return state.filter((item) => item.productId !== productId);
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

export const {
	addToCart,
	removeFromCart,
	clearCart,
	incrementProductQuantity,
	decrementProductQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
