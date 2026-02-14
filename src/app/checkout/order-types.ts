export interface CreateOrderRequest {
	customerId: string;
	tenantId: string;
	address: string;
	phone: string;
	paymentMode: 'CASH' | 'CARD';
	couponCode?: string;
	subTotal: number;
	tax: number;
	deliveryCharge: number;
	delivery: number;
	discount: number;
	grandTotal: number;

	items: OrderItemRequest[];
}

export interface OrderItemRequest {
	productId: string;
	productName: string;
	quantity: number;
	base: {
		name: string;
		price: number;
	};
	toppings: ToppingRequest[];
	key: string;
}

export interface ToppingRequest {
	id: string;
	name: string;
	price: number;
}
