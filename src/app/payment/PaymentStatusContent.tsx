'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CONFIG from '@/config';
import PaymentErrorPage from './PaymentErrorPage';


async function getOrderById(orderId: string): Promise<OrderData | null> {
    const URL = CONFIG.baseUrl + CONFIG.order.url + `/orders/${orderId}`;
    console.log(URL);
    try {
        const response = await fetch(URL, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Order with ID ${orderId} not found.`);
                return null;
            }
            console.error(`Failed to fetch order ${orderId}: ${response.status}`);
            return null;
        }

        const order = await response.json();
        console.log(`Order ${orderId} fetched successfully`, order);
        return order;
    } catch (error) {
        console.error(`Error in getOrderById for ID ${orderId}:`, error);
        return null;
    }
}

const PaymentStatusContent = () => {
    const searchParams = useSearchParams();
    // const isSuccess = searchParams.get(' success') === 'true';
    const orderId = searchParams.get('order_id');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<OrderData | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                if (orderId) {
                    const fetchedOrder = await getOrderById(orderId);
                    if (!fetchedOrder) {
                        setError('Failed to fetch order');
                        return;
                    }
                    setOrderData(fetchedOrder);
                }
            } catch (err) {
                const errorMsg = (err as Error).message || 'Failed to fetch order';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) return <div>Loading order details...</div>;
    if (error) return <PaymentErrorPage message={error} />;
    if (!orderData) return <div>No order data found.</div>;

    // ... (keep ALL your JSX return statement exactly the same)
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {/* Your existing JSX unchanged */}
        </div>
    );
};

export default PaymentStatusContent;


interface Topping {
	id: string;
	price: number;
}

interface Base {
	name: string;
	price: number;
}

interface Item {
	productId: string;
	productName: string;
	quantity: number;
	base: Base;
	toppings: Topping[];
	itemTotal: number;
}

interface Amounts {
	subTotal: number;
	tax: number;
	deliveryCharge: number;
	discount: number;
	grandTotal: number;
}
export enum PaymentStatus {
	PAID = 'PAID',
	UNPAID = 'UNPAID',
	NO_PAYMENT_REQUIRED = 'NO_PAYMENT_REQUIRED',
	PENDING = 'PENDING',
}

interface OrderData {
	_id: string;
	customerId: string;
	address: string;
	phone: string;
	paymentMode: 'CASH' | 'CARD';
	paymentStatus: PaymentStatus;
	couponCode?: string;
	amounts: Amounts;
	items: Item[];
	orderStatus: string;
	tenantId: string;
	createdAt: string;
	updatedAt: string;
}