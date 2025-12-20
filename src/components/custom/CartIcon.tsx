'use client';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
export default function CartIcon() {
	const count = useAppSelector((state) => state.cart.length);

	return (
		<Link href="/cart" className="relative inline-flex items-center">
			{count > 0 && (
				<span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
					{count}
				</span>
			)}

			{/* DEV: quick increment button to test badge updating */}
			<Button
				className="cursor-pointer bg-gray-500 hover:bg-gray-800"
				size="icon"
			>
				<ShoppingCart />
			</Button>
		</Link>
	);
}
