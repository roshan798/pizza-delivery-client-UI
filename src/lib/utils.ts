import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function formatPrice(n: number) {
	const whole = Number.isInteger(n) ? n.toString() : n.toFixed(2);
	return `₹${whole}`;
}
