"use client";

import { loadState, setCart } from '@/lib/cart/cartSlices';
import { useAppDispatch } from '@/lib/hooks';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const CartIcon = dynamic(() => import('./CartIcon'), { ssr: false });

export default function ClientCartIconWrapper() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const storedCart = loadState();
        if (storedCart.length > 0) {
            dispatch(setCart(storedCart));
        }
    }, [dispatch]);
    return <CartIcon />;
}
