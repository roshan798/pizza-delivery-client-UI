'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

type AddressFormData = {
	address: string;
	city: string;
	zipCode: string;
	isPrimary: boolean;
};

type AddressDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	initialData: AddressFormData;
	onSave: (data: AddressFormData) => Promise<void>;
	isEdit?: boolean;
	onDelete?: (addressId: string) => Promise<void>; // ✅ New prop for delete
	addressId?: string; // ✅ Address ID for delete
};

export default function AddressDialog({
	open,
	onOpenChange,
	title,
	initialData,
	onSave,
	isEdit = false,
	addressId,
	onDelete,
}: AddressDialogProps) {
	const [formData, setFormData] = useState<AddressFormData>(initialData);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // ✅ Delete confirmation

	// Sync initial data when dialog opens
	const handleOpenChange = (newOpen: boolean) => {
		onOpenChange(newOpen);
		if (!newOpen) {
			setFormData(initialData);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handlePrimaryChange = (value: string) => {
		setFormData((prev) => ({ ...prev, isPrimary: value === 'true' }));
	};

	const handleSave = async () => {
		if (!formData.address.trim() || !formData.city.trim()) return;
		await onSave(formData);
	};

	const canDelete = isEdit && !!initialData; // Only show delete for edit mode
	console.log({ canDelete, isEdit, addressId });
	const handleDelete = async () => {
		if (canDelete && onDelete) {
			await onDelete(addressId!);
			setShowDeleteConfirm(false);
		}
	};
	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>
							{isEdit
								? 'Update the address details.'
								: 'Enter your new shipping address details.'}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="address">Address</Label>
							<Textarea
								id="address"
								value={formData.address}
								onChange={handleChange}
								placeholder="Enter full address"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="city">City</Label>
								<Input
									id="city"
									value={formData.city}
									onChange={handleChange}
									placeholder="Enter city"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="zipCode">Zip Code</Label>
								<Input
									id="zipCode"
									value={formData.zipCode}
									onChange={handleChange}
									placeholder="Enter zip code"
								/>
							</div>
						</div>
						<div className="space-y-2 pt-2">
							<Label>Set as Primary Address</Label>
							<RadioGroup
								value={formData.isPrimary.toString()}
								onValueChange={handlePrimaryChange}
								className="flex gap-4"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="true"
										id="primary-yes"
									/>
									<Label htmlFor="primary-yes">Yes</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="false"
										id="primary-no"
									/>
									<Label htmlFor="primary-no">No</Label>
								</div>
							</RadioGroup>
						</div>
					</div>
					<DialogFooter>
						<div className="flex w-full justify-end gap-2 sm:gap-3">
							<Button
								onClick={handleSave}
								disabled={
									!formData.address.trim() ||
									!formData.city.trim()
								}
								className="flex-1 sm:flex-none"
							>
								{isEdit ? 'Update Address' : 'Save Address'}
							</Button>

							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								className="flex-1 sm:flex-none"
							>
								Cancel
							</Button>

							{canDelete && (
								<Button
									type="button"
									variant="destructive"
									size="sm"
									onClick={() => setShowDeleteConfirm(true)}
									className="h-9 gap-2 flex-1 sm:flex-none"
								>
									<Trash2 className="h-4 w-4" />
									Delete
								</Button>
							)}
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={showDeleteConfirm}
				onOpenChange={setShowDeleteConfirm}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Address?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This address will be
							permanently deleted from your account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							onClick={handleDelete}
						>
							Delete Address
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
