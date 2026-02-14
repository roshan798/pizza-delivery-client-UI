'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type CouponSectionProps = {
	couponCode: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isPending: boolean;
};

export default function CouponSection({
	couponCode,
	onChange,
	isPending,
}: CouponSectionProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="couponCode">Coupon Code</Label>
			<div className="flex gap-2">
				<Input
					id="couponCode"
					placeholder="Enter coupon code"
					value={couponCode}
					onChange={onChange}
					disabled={isPending}
				/>
				<Button type="button" disabled={isPending}>
					Apply
				</Button>
			</div>
		</div>
	);
}
