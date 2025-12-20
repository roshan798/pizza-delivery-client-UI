// TenantSelect.tsx (Client)
'use client';
import { useTransition, useState, useEffect } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { setTenant } from '@/app/actions/tenants';

export function TenantSelect({
	tenants,
	current,
}: {
	tenants: { id: string; name: string }[];
	current?: string;
}) {
	const [pending, start] = useTransition();

	const [value, setValue] = useState(current ?? 'all');
	useEffect(() => setValue(current ?? 'all'), [current]);

	return (
		<Select
			value={value}
			onValueChange={(val) =>
				start(async () => {
					setValue(val);
					await setTenant(val);
				})
			}
			disabled={pending}
		>
			<SelectTrigger className="w-[200px]">
				<SelectValue placeholder="Select Restaurant" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All</SelectItem>
				{tenants.map((t) => (
					<SelectItem key={t.id} value={t.id.toString()}>
						{t.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
