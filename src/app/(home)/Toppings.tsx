import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
const DUMMY_TOPPINGS = [
	{
		id: 'cheddar',
		name: 'Cheddar',
		price: 70,
		icon: '/Images/placeholder.png',
	},
	{
		id: 'chicken',
		name: 'Chicken',
		price: 90,
		icon: '/Images/placeholder.png',
	},
	{
		id: 'jalapeno',
		name: 'Jalapeno',
		price: 30,
		icon: '/Images/placeholder.png',
	},
	{
		id: 'mushroom',
		name: 'Mushroom',
		price: 80,
		icon: '/Images/placeholder.png',
	},
];
type ToppingsProps = {
	addons: Record<string, boolean>;
	setAddons: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};
const Toppings = ({ addons, setAddons }: ToppingsProps) => {
	const addonsTotal = DUMMY_TOPPINGS.reduce(
		(sum, t) => sum + (addons[t.id] ? t.price : 0),
		0
	);
	return (
		<>
			{DUMMY_TOPPINGS.map((t) => {
				const checked = !!addons[t.id];
				return (
					<Label
						key={t.id}
						htmlFor={`addon-${t.id}`}
						className={`rounded-lg border p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 min-h-[9.5rem] ${checked ? 'border-primary ring-1 ring-primary/30' : ''}`}
					>
						<div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-100">
							<Image
								src={t.icon}
								alt={t.name}
								fill
								className="object-cover"
							/>
						</div>
						<span className="text-xs text-gray-600 text-center line-clamp-1">
							{t.name}
						</span>
						<span className="text-sm font-medium">
							{formatPrice(t.price)}
						</span>
						<Checkbox
							id={`addon-${t.id}`}
							checked={checked}
							onCheckedChange={(v) =>
								setAddons((prev) => ({ ...prev, [t.id]: !!v }))
							}
							className="sr-only"
						/>
					</Label>
				);
			})}
		</>
	);
};

export default Toppings;
