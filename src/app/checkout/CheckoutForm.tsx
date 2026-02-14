'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import CONFIG from '@/config';
import ContactSelector from './ContactSelector';
import AddressSelector from './AddressSelector';
import CouponSection from './CouponSection';
import PaymentSelector from './PaymentSelector';
import { useCheckoutForm, FormData } from './useCheckoutForm'; // Import the new hook and types

// Types remain the same
type Address = {
	_id: string;
	address: string;
	city: string;
	zipCode: string;
	isPrimary: boolean;
};

type Contact = {
	_id?: string;
	countryCode: string;
	contact: string;
	isPrimary: boolean;
};

interface CheckoutFormProps {
	onFormChange: (data: FormData) => void;
	isPending: boolean;
}

export interface Customer {
	// This type should remain here or be moved to a shared types file
	_id?: string;
	userId: string;
	firstName: string;
	lastName: string;
	email: string;
	Contact: Contact[];
	address: Address[];
	createdAt?: Date;
	updatedAt?: Date;
}

export function CheckoutForm({ onFormChange, isPending }: CheckoutFormProps) {
	const {
		formData,
		handleChange,
		updatePhone,
		updatePayment,
		updateAddress,
		initializeFormData,
	} = useCheckoutForm();
	const [customer, setCustomer] = useState<Customer | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCustomer = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					CONFIG.baseUrl + CONFIG.order.customer.url,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
						credentials: 'include',
					}
				);
				const data = await response.json();
				if (response.ok) {
					setCustomer(data.customer);
					let primaryAddress = data.customer.address.find(
						(addr: Address) => addr.isPrimary
					);
					if (!primaryAddress && data.customer.address.length > 0) {
						primaryAddress = data.customer.address[0];
					}

					let primaryContact = data.customer.Contact.find(
						(contact: Contact) => contact.isPrimary
					);
					if (!primaryContact && data.customer.Contact.length > 0) {
						primaryContact = data.customer.Contact[0];
					}
					initializeFormData({
						// Use initializeFormData from the hook
						customerId: data.customer._id,
						firstName: data.customer.firstName,
						lastName: data.customer.lastName,
						email: data.customer.email,
						phone: primaryContact?.contact || '',
						address: primaryAddress?.address || '',
						city: primaryAddress?.city || '',
						zip: primaryAddress?.zipCode || '',
					});
				}
			} catch (error) {
				console.error('Error fetching customer:', error);
			} finally {
				setLoading(false); // Always set loading to false
			}
		};
		fetchCustomer();
	}, []);
	useEffect(() => {
		onFormChange(formData);
	}, [formData, onFormChange]);

	if (loading) {
		return (
			<Card className="flex-1">
				<CardHeader>
					<Skeleton className="h-8 w-48 mb-2" />
					<Skeleton className="h-4 w-72" />
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-16 w-full" />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="flex-1">
			<CardHeader>
				<CardTitle>Shipping & Payment</CardTitle>
				<CardDescription>
					Enter your details to complete the order.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<input
								type="text"
								id="customerId"
								name="customerId"
								value={formData.customerId}
								hidden
								readOnly
							/>
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								placeholder="John Doe"
								value={formData.firstName}
								onChange={handleChange}
								required
								disabled={isPending}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								id="lastName"
								placeholder="John Doe"
								value={formData.lastName}
								onChange={handleChange}
								disabled={isPending}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="john.doe@example.com"
								value={formData.email}
								onChange={handleChange}
								required
								disabled={true} // Email is always disabled as it's fetched
							/>
						</div>
					</div>

					<ContactSelector
						contacts={customer?.Contact || []}
						onPhoneChange={updatePhone}
						isPending={isPending}
					/>

					<AddressSelector
						addresses={customer?.address || []}
						onAddressChange={updateAddress}
						isPending={isPending}
					/>

					<CouponSection
						couponCode={formData.couponCode}
						onChange={handleChange}
						isPending={isPending}
					/>

					<PaymentSelector
						paymentMethod={formData.paymentMethod}
						onChange={updatePayment}
						isPending={isPending}
					/>
				</form>
			</CardContent>
		</Card>
	);
}
