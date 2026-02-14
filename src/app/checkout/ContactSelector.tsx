'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import CONFIG from '@/config';

const INTIAL_STATE = {
	countryCode: '+91',
	contact: '',
	isPrimary: false,
};

type Contact = {
	_id?: string;
	countryCode: string;
	contact: string;
	isPrimary: boolean;
};

type ContactSelectorProps = {
	contacts: Contact[];
	onPhoneChange: (phone: string) => void;
	isPending: boolean;
};

const NEW_CONTACT_ID = 'newContact';

export default function ContactSelector({
	contacts,
	onPhoneChange,
	isPending,
}: ContactSelectorProps) {
	const [selectedContactId, setSelectedContactId] = useState<string>();
	const [showNewContactDialog, setShowNewContactDialog] = useState(false);
	const [newContactForm, setNewContactForm] = useState(INTIAL_STATE);
	const handleContactSelection = (value: string) => {
		setSelectedContactId(value);
		if (value === NEW_CONTACT_ID) {
			setShowNewContactDialog(true);
			return;
		}
		const selected = contacts.find((c) => c._id === value);
		if (selected) {
			onPhoneChange(selected.contact);
		}
	};
	useEffect(() => {
		const selected = contacts.find((c) => c.isPrimary);
		if (selected) {
			setSelectedContactId(selected._id);
		} else if (contacts.length > 0) {
			setSelectedContactId(contacts[0]._id);
		}
	}, [contacts]);

	const handleNewContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setNewContactForm((prev) => ({ ...prev, [id]: value }));
	};

	const saveNewContact = async () => {
		try {
			const response = await fetch(
				CONFIG.baseUrl + CONFIG.order.customer.contact,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify(newContactForm),
				}
			);
			if (response.ok) {
				const newContact = await response.json();
				setSelectedContactId(newContact._id!);
				onPhoneChange(newContact.contact);
				setShowNewContactDialog(false);
				window.location.reload();
				setNewContactForm(INTIAL_STATE);
			}
		} catch (error) {
			console.error('Error saving contact:', error);
		}
	};

	return (
		<>
			<div className="space-y-2">
				<Label>Phone Number</Label>
				<RadioGroup
					value={selectedContactId}
					onValueChange={handleContactSelection}
					className="grid grid-cols-1 gap-2"
				>
					{contacts.map((cont) => (
						<Label
							key={cont._id}
							htmlFor={cont._id}
							className={cn(
								'flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50',
								selectedContactId === cont._id
									? 'border-primary'
									: 'border-gray-300'
							)}
						>
							<RadioGroupItem
								id={cont._id!}
								value={cont._id!}
								disabled={isPending}
								className="self-center"
							/>
							<span className="flex-grow ml-2 font-medium">
								{cont.countryCode} {cont.contact}
							</span>
						</Label>
					))}
					<Label
						htmlFor={NEW_CONTACT_ID}
						className={cn(
							'flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50',
							selectedContactId === NEW_CONTACT_ID
								? 'border-primary'
								: 'border-gray-300'
						)}
					>
						<RadioGroupItem
							id={NEW_CONTACT_ID}
							value={NEW_CONTACT_ID}
							disabled={isPending}
							className="self-center"
						/>
						<span className="flex-grow ml-2 font-medium">
							+ Add new phone
						</span>
					</Label>
				</RadioGroup>
			</div>

			<Dialog
				open={showNewContactDialog}
				onOpenChange={setShowNewContactDialog}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Phone Number</DialogTitle>
						<DialogDescription>
							Enter your phone number details.
						</DialogDescription>
					</DialogHeader>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="countryCode">Country Code</Label>
							<Input
								id="countryCode"
								value={newContactForm.countryCode}
								onChange={handleNewContactChange}
								disabled={isPending}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="contact">Phone Number</Label>
							<Input
								id="contact"
								type="tel"
								required
								value={newContactForm.contact}
								onChange={handleNewContactChange}
								disabled={isPending}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setShowNewContactDialog(false)}
						>
							Cancel{' '}
						</Button>
						<Button onClick={saveNewContact} disabled={isPending}>
							{' '}
							Save Phone
						</Button>
						<Button onClick={saveNewContact}>Save Phone</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
