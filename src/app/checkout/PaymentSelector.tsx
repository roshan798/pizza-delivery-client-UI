'use client';

import { Label } from '@/components/ui/label';

type PaymentSelectorProps = {
	paymentMethod: 'CASH' | 'CARD';
	onChange: (method: 'CASH' | 'CARD') => void;
	isPending: boolean;
};

export default function PaymentSelector({
	paymentMethod,
	onChange,
	isPending,
}: PaymentSelectorProps) {
	return (
		<div className="space-y-2">
			<Label>Payment Method</Label>
			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-2">
					<input
						type="radio"
						id="cashOnDelivery"
						name="paymentMethod"
						value="CASH"
						checked={paymentMethod === 'CASH'}
						onChange={(e) =>
							!isPending &&
							onChange(e.target.value as 'CASH' | 'CARD')
						}
						className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
					/>
					<Label htmlFor="cashOnDelivery">Cash on Delivery</Label>
				</div>
				<div className="flex items-center space-x-2">
					<input
						type="radio"
						id="cardPayment"
						name="paymentMethod"
						value="CARD"
						checked={paymentMethod === 'CARD'}
						onChange={(e) =>
							!isPending &&
							onChange(e.target.value as 'CASH' | 'CARD')
						}
						className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
					/>
					<Label htmlFor="cardPayment">Card Payment</Label>
				</div>
			</div>
		</div>
	);
}
