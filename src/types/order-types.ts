export interface IAmount {
	subTotal: number;
	tax: number;
	deliveryCharge: number;
	discount: number;
	grandTotal: number;
}

export interface IItem {
	productId: string;
	productName?: string;
	quantity: number;
	base: {
		name: string;
		price: number;
	};
	toppings: Array<{
		id: string;
		price: number;
	}>;
	itemTotal: number;
}

export enum PaymentMode {
	CASH = 'CASH',
	CARD = 'CARD',
}

export enum PaymentStatus {
	PAID = 'PAID',
	UNPAID = 'UNPAID',
	NO_PAYMENT_REQUIRED = 'NO_PAYMENT_REQUIRED',
	PENDING = 'PENDING',
}

export enum OrderStatus {
	PENDING = 'pending',
	VERIFIED = 'verified',
	CONFIRMED = 'confirmed',
	PREPARING = 'preparing',
	OUT_FOR_DELIVERY = 'out-for-delivery',
	DELIVERED = 'delivered',
	CANCELLED = 'cancelled',
}

export interface OrderResponseDto {
	id: string;
	customerId: string;
	address: string;
	phone: string;
	paymentMode: PaymentMode;
	paymentStatus: PaymentStatus;
	couponCode?: string;
	amounts: IAmount;
	items: IItem[];
	orderStatus: OrderStatus;
	tenantId: string;
	createdAt: string;
	updatedAt: string;
}
