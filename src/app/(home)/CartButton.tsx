import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import React from 'react';

interface CartButtonProps {
	productInCart: { quantity: number } | null | undefined;
	handleAddonChange: (action?: 'increment' | 'decrement') => void;
}

export default function CartButton({
	productInCart,
	handleAddonChange,
}: CartButtonProps) {
	return !productInCart ? (
		<button
			className="bg-primary text-white hover:bg-primary/90 cursor-pointer px-4 py-2 rounded"
			onClick={() => handleAddonChange()}
		>
			Add
		</button>
	) : (
		<div className="flex items-center space-x-2">
			<Button
				size="icon"
				className="bg-primary text-white hover:bg-primary/90 cursor-pointer px-2 rounded"
				onClick={() => handleAddonChange('decrement')}
			>
				<Minus />
			</Button>
			<span className="font-semibold">{productInCart.quantity}</span>
			<Button
				size="icon"
				className="bg-primary text-white hover:bg-primary/90 cursor-pointer px-2 rounded"
				onClick={() => handleAddonChange('increment')}
			>
				<Plus />
			</Button>
		</div>
	);
}
