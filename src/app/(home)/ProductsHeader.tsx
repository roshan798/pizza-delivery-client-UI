// app/(site)/products-header.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Props = {
	categories: { id: string; name: string }[];
	selectedCategoryId?: string;
	sortBy?: 'createdAt' | 'name';
	order?: 'asc' | 'desc';
};
const itemsPerPageOptions = ['6', '12', '24', '36', '48'];
const defaultItemsPerPage = '12';

export default function ProductsHeader({
	categories,
	selectedCategoryId,
	sortBy = 'createdAt',
	order = 'desc',
}: Props) {
	const router = useRouter();
	const params = useSearchParams();
	const pathname = usePathname();

	const updateQuery = (patch: Record<string, string | undefined>) => {
		const q = new URLSearchParams(params.toString());
		Object.entries(patch).forEach(([k, v]) => {
			if (!v) q.delete(k);
			else q.set(k, v);
		});
		// Reset page when filters/search/page size change
		q.delete('page');
		router.push(`${pathname}?${q.toString()}`, { scroll: false });
	};

	// Seed search from URL
	const initialQ = params.get('q') ?? '';
	const [term, setTerm] = useState(initialQ);
	const DEBOUNCE_DELAY = 800;
	const commit = useDebouncedCallback((next: string) => {
		updateQuery({ q: next || undefined });
	}, DEBOUNCE_DELAY);

	useEffect(() => {
		setTerm(params.get('q') ?? '');
	}, [params]);

	// Read current limit (fallback to default 12)
	const currentLimit = params.get('limit') ?? '12';

	return (
		<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-3 sm:gap-4 flex-1">
				{/* Category */}
				<Select
					value={selectedCategoryId ?? 'all'}
					onValueChange={(val) => {
						const next = val === 'all' ? undefined : val;
						updateQuery({ categoryId: next });
					}}
				>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						{categories.map((c) => (
							<SelectItem key={c.id} value={c.id}>
								{c.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Search */}
				<div className="relative flex-1 min-w-[200px]">
					<Input
						value={term}
						onChange={(e) => {
							const v = e.target.value;
							setTerm(v);
							commit(v);
						}}
						placeholder="Search products..."
						className="pl-3"
					/>
				</div>

				<div className="hidden sm:block">
					<Button variant="ghost">Filters</Button>
				</div>
			</div>

			<div className="flex items-center gap-3">
				{/* Sort */}
				<Select
					value={`${sortBy}:${order}`}
					onValueChange={(v) => {
						const [sb, ord] = v.split(':') as [
							'createdAt' | 'name',
							'asc' | 'desc',
						];
						updateQuery({ sortBy: sb, order: ord });
					}}
				>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="Sort" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="createdAt:desc">Newest</SelectItem>
						<SelectItem value="createdAt:asc">Oldest</SelectItem>
						<SelectItem value="name:asc">Name A–Z</SelectItem>
						<SelectItem value="name:desc">Name Z–A</SelectItem>
					</SelectContent>
				</Select>

				{/* Items per page */}
				<Select
					value={currentLimit}
					onValueChange={(val) => {
						// Omit when default to keep URL clean
						const limit = val === '12' ? undefined : val;
						updateQuery({ limit });
					}}
				>
					<SelectTrigger className="w-[140px]">
						<SelectValue placeholder="Items/page" />
					</SelectTrigger>
					<SelectContent defaultValue={defaultItemsPerPage}>
						{itemsPerPageOptions.map((option) => (
							<SelectItem key={option} value={option}>
								{option} / page
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Button>
					<Link href="/cart">View Cart</Link>
				</Button>
			</div>
		</div>
	);
}
