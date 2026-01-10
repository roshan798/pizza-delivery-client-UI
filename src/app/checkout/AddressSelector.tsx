'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import CONFIG from '@/config';
import AddressDialog from './AddressDialog';

type Address = {
	_id: string;
	address: string;
	city: string;
	zipCode: string;
	isPrimary: boolean;
};

type AddressSelectorProps = {
	addresses: Address[];
	onAddressChange: (address: string, city: string, zip: string) => void;
};

type AddressFormData = {
	address: string;
	city: string;
	zipCode: string;
	isPrimary: boolean;
};

const NEW_ADDRESS_ID = 'newAddress';

export default function AddressSelector({
	addresses,
	onAddressChange,
}: AddressSelectorProps) {
	const [selectedAddressId, setSelectedAddressId] = useState<string>('');
	const [showNewDialog, setShowNewDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [editingAddressId, setEditingAddressId] = useState<string | null>(
		null
	);

	// Set initial selection
	useEffect(() => {
		const selected = addresses.find((addr) => addr.isPrimary);
		if (selected) {
			setSelectedAddressId(selected._id);
			onAddressChange(selected.address, selected.city, selected.zipCode);
		} else if (addresses.length > 0) {
			setSelectedAddressId(addresses[0]._id);
			onAddressChange(
				addresses[0].address,
				addresses[0].city,
				addresses[0].zipCode
			);
		}
	}, [addresses, onAddressChange]);

	const handleAddressSelection = (value: string) => {
		setSelectedAddressId(value);
		if (value === NEW_ADDRESS_ID) {
			setShowNewDialog(true);
			return;
		}
		const selected = addresses.find((addr) => addr._id === value);
		if (selected) {
			onAddressChange(selected.address, selected.city, selected.zipCode);
		}
	};

	const handleDoubleClick = (addressId: string) => {
		const addressToEdit = addresses.find((addr) => addr._id === addressId);
		if (addressToEdit) {
			setEditingAddressId(addressId);
			setShowEditDialog(true);
		}
	};

	const saveNewAddress = async (formData: AddressFormData) => {
		try {
			const response = await fetch(
				CONFIG.baseUrl + CONFIG.order.customer.address,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify(formData),
				}
			);
			if (response.ok) {
				setShowNewDialog(false);
				window.location.reload();
			}
		} catch (error) {
			console.error('Error saving address:', error);
		}
	};

	const updateAddress = async (formData: AddressFormData) => {
		if (!editingAddressId) return;
		try {
			const response = await fetch(
				`${CONFIG.baseUrl}${CONFIG.order.customer.address}/${editingAddressId}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify(formData),
				}
			);
			if (response.ok) {
				setShowEditDialog(false);
				setEditingAddressId(null);
				window.location.reload();
			}
		} catch (error) {
			console.error('Error updating address:', error);
		}
	};

	const editingAddress = editingAddressId
		? addresses.find((addr) => addr._id === editingAddressId)
		: null;

	return (
		<>
			<div className="space-y-2">
				<Label>Shipping Address</Label>
				<RadioGroup
					value={selectedAddressId}
					onValueChange={handleAddressSelection}
					className="grid grid-cols-1 gap-2"
				>
					{addresses.map((addr) => (
						<div
							key={addr._id}
							className="cursor-pointer"
							onDoubleClick={() => handleDoubleClick(addr._id)}
						>
							<Label
								className={cn(
									'flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50 w-full',
									selectedAddressId === addr._id
										? 'border-primary'
										: 'border-gray-300'
								)}
							>
								<RadioGroupItem
									id={addr._id}
									value={addr._id}
									className="self-center"
								/>
								<div className="flex flex-col justify-center flex-grow gap-1 ml-2">
									<span className="font-medium">
										{addr.address}
									</span>
									<span className="text-sm text-muted-foreground">
										{addr.city} - {addr.zipCode}
									</span>
								</div>
								<span className="text-xs text-muted-foreground">
									(dbl-click to edit)
								</span>
							</Label>
						</div>
					))}
					<Label
						className={cn(
							'flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50',
							selectedAddressId === NEW_ADDRESS_ID
								? 'border-primary'
								: 'border-gray-300'
						)}
					>
						<RadioGroupItem
							id={NEW_ADDRESS_ID}
							value={NEW_ADDRESS_ID}
							className="self-center"
						/>
						<span className="flex-grow ml-2 font-medium">
							+ Add new address
						</span>
					</Label>
				</RadioGroup>
			</div>

			{/* ✅ REUSABLE DIALOGS */}
			<AddressDialog
				open={showNewDialog}
				onOpenChange={setShowNewDialog}
				title="Add New Address"
				initialData={{
					address: '',
					city: '',
					zipCode: '',
					isPrimary: false,
				}}
				onSave={saveNewAddress}
			/>

			{showEditDialog && editingAddress && (
				<AddressDialog
					open={showEditDialog}
					onOpenChange={setShowEditDialog}
					title="Edit Address"
					initialData={
						editingAddress
							? {
									address: editingAddress.address,
									city: editingAddress.city,
									zipCode: editingAddress.zipCode,
									isPrimary: editingAddress.isPrimary,
								}
							: {
									address: '',
									city: '',
									zipCode: '',
									isPrimary: false,
								}
					}
					onSave={updateAddress}
					isEdit={true}
					addressId={editingAddressId!}
					onDelete={async (addressId) => {
						try {
							await fetch(
								`${CONFIG.baseUrl}${CONFIG.order.customer.address}/${addressId}`,
								{
									method: 'DELETE',
									credentials: 'include',
								}
							);
							setShowEditDialog(false);
							window.location.reload();
						} catch (error) {
							console.error('Error deleting address:', error);
						}
					}}
				/>
			)}
		</>
	);
}
