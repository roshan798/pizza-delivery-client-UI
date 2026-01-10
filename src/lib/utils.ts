import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function formatPrice(n: number) {
	const whole = Number.isInteger(n) ? n.toString() : n.toFixed(2);
	return `${whole}`;
}

export type ServerError = {
	type: string;
	value?: string;
	msg: string;
	message: string;
	path?: string;
	location?: string;
};
type ErrorResponse = {
	errors?: ServerError[];
	message?: string;
};

export const mapServerFormErrors = (
	data?: ErrorResponse
): Record<string, string> => {
	if (!data) {
		return { general: 'Something went wrong, please try again later.' };
	}

	// Case 1: structured errors array
	if (data.errors && data.errors.length > 0) {
		return data.errors.reduce<Record<string, string>>((acc, err) => {
			if (err.type == 'field') {
				acc[err.path || 'general'] = err.msg || err.message;
			} else {
				acc.general = err.msg || err.message;
			}
			return acc;
		}, {});
	}

	// Case 2: generic message
	if (data.message) {
		return { general: data.message };
	}

	// Fallback
	return { general: 'Something went wrong, please try again later.' };
};
