import { useState, useCallback } from 'react';

// Define the FormData type
export type FormData = {
	customerId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	zip: string;
	paymentMethod: 'CASH' | 'CARD';
	couponCode: string;
};

// Define the initial form data state
export const initialFormData: FormData = {
	customerId: '',
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	address: '',
	city: '',
	zip: '',
	paymentMethod: 'CASH',
	couponCode: '',
};

/**
 * Custom hook to manage checkout form state and update logic.
 * @returns An object containing formData and various update functions.
 */
export function useCheckoutForm() {
	const [formData, setFormData] = useState<FormData>(initialFormData);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { id, value } = e.target;
			setFormData((prev) => ({ ...prev, [id]: value }));
		},
		[]
	);

	const updatePhone = useCallback((phone: string) => {
		setFormData((prev) => ({ ...prev, phone }));
	}, []);

	const updatePayment = useCallback((paymentMethod: 'CASH' | 'CARD') => {
		setFormData((prev) => ({ ...prev, paymentMethod }));
	}, []);

	const updateAddress = useCallback(
		(address: string, city: string, zip: string) => {
			setFormData((prev) => ({ ...prev, address, city, zip }));
		},
		[]
	);

	// Function to initialize form data, useful after fetching customer details
	const initializeFormData = useCallback((data: Partial<FormData>) => {
		setFormData((prev) => ({ ...prev, ...data }));
	}, []);

	return {
		formData,
		setFormData,
		handleChange,
		updatePhone,
		updatePayment,
		updateAddress,
		initializeFormData,
	};
}
