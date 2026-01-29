'use client';

import { Label } from '@/components/ui/label';

type PaymentSelectorProps = {
	paymentMethod: 'CASH' | 'CARD';
	onChange: (method: 'CASH' | 'CARD') => void;
};

export default function PaymentSelector({
	paymentMethod,
	onChange,
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
						value="cardPayment"
						checked={paymentMethod === 'CARD'}
						onChange={(e) =>
							onChange(e.target.value as 'CASH' | 'CARD')
						}
						className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
						disabled
					/>
					<Label
						htmlFor="cardPayment"
						className={
							paymentMethod === 'CARD' ? '' : 'text-gray-400'
						}
					>
						Card Payment (Coming Soon)
					</Label>
				</div>
			</div>
		</div>
	);
}
