'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type CouponSectionProps = {
	couponCode: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CouponSection({
	couponCode,
	onChange,
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
					disabled
				/>
				<Button type="button" disabled>
					Apply
				</Button>
			</div>
		</div>
	);
}
