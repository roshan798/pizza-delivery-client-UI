// app/(home)/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import PizzaHero from '../../../public/Images/Hero-pizza.png';
import CONFIG from '@/config';
import { categoryListResponse } from '@/types/types';
import ProductsHeader from './ProductsHeader';
import { getAllProducts } from '@/services/productService';
import { cookies } from 'next/headers';
import { Product } from '@/types/product';
import { ProductsEmpty } from '@/components/custom/empty/ProductsEmpty';
import { ProductsPagination } from './ProductsPagination';

type PriceCfgEntry = {
	priceType: 'base' | 'additional' | 'discount';
	availableOptions: Record<string, number>;
	_id: string;
};
type PriceConfiguration = Record<string, PriceCfgEntry>;

function getStartingPrice(pc?: PriceConfiguration): number {
	if (!pc) return 0;
	let min = Number.POSITIVE_INFINITY;
	for (const [, cfg] of Object.entries(pc)) {
		if (cfg.priceType !== 'base') continue;
		const v = Object.values(cfg.availableOptions ?? {})[0];
		const price = typeof v === 'number' ? v : undefined;
		if (typeof price === 'number' && price < min) min = price;
	}
	return Number.isFinite(min) ? min : 0;
}

type SortOrder = 'asc' | 'desc';
type SortBy = 'createdAt' | 'name';

export default async function HomePage({
	searchParams,
}: {
	searchParams?: Record<string, string | string[] | undefined>;
}) {
	const cookieStore = await cookies();
	const tenantId = cookieStore.get('tenantId')?.value || undefined;

	// Categories (static-ish)
	const categoryListResponse = await fetch(CONFIG.baseUrl + CONFIG.categories.list, {
		next: { revalidate: 300 },
	});
	const categories = (await categoryListResponse.json()) as categoryListResponse;

	// URL state (keep URL clean by allowing undefined)
	const categoryId =
		typeof searchParams?.categoryId === 'string' ? searchParams.categoryId : undefined;
	const sortBy =
		typeof searchParams?.sortBy === 'string' &&
			(['createdAt', 'name'] as const).includes(searchParams.sortBy as SortBy)
			? (searchParams.sortBy as SortBy)
			: undefined;
	const order =
		typeof searchParams?.order === 'string' &&
			(['asc', 'desc'] as const).includes(searchParams.order as SortOrder)
			? (searchParams.order as SortOrder)
			: undefined;
	const q = typeof searchParams?.q === 'string' && searchParams.q.trim() ? searchParams.q.trim() : undefined;

	// Fetch products (use defaults only for logic, not for URL)
	const page =
		typeof searchParams?.page === 'string' && Number(searchParams.page) > 0
			? Number(searchParams.page)
			: 1;

	const limit =
		typeof searchParams?.limit === 'string' && Number(searchParams.limit) > 0
			? Math.min(48, Number(searchParams.limit))
			: 12;


	const productsRes = await getAllProducts({
		page,
		limit,
		categoryId,
		sortBy: sortBy ?? 'createdAt',
		order: order ?? 'desc',
		tenantId,
		name: q,
	});

	const { items: products, metadata } = productsRes.data;
	// If your API returns { meta: {...} } adjust accordingly.
	const totalItems = metadata?.totalItems ?? 0;
	const totalPages = metadata?.totalPages ?? Math.max(1, Math.ceil(totalItems / Math.max(1, limit)));

	return (
		<div className="min-h-screen bg-gray-50">
			<section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
				<div>
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
						Get yummy pizza in <span className="text-primary">30 min</span>
					</h1>
					<p className="mt-4 text-gray-600 text-xl">
						No need to pay in order total more than $10
					</p>
					<div className="mt-6">
						<Button asChild>
							<Link href="/menu">Order Now</Link>
						</Button>
					</div>
				</div>
				<div className="flex justify-center md:justify-end">
					<Image src={PizzaHero} alt="Pizza" width={450} height={450} />
				</div>
			</section>

			<section className="container mx-auto px-4 py-8">
				<ProductsHeader
					categories={categories.data}
					selectedCategoryId={categoryId}
					sortBy={sortBy}
					order={order}
				/>

				<Suspense
					key={`${tenantId || 'all'}:${categoryId || 'all'}:${sortBy || 'createdAt'}:${order || 'desc'}`}
					fallback={
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className="h-64 rounded-xl border border-gray-200 bg-white animate-pulse"
								/>
							))}
						</div>
					}
				>
					<ProductsGrid products={products} />
					<div className="mt-6">
						<ProductsPagination totalPages={totalPages} />
					</div>
				</Suspense>
			</section>
		</div>
	);
}

function ProductsGrid({ products }: { products: Product[] }) {
	if (!products || products.length === 0) {
		return (
			<div className="mt-6">
				<ProductsEmpty onBrowseAllHref="/" />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
			{products.map((p) => (
				<div
					key={p._id}
					className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
				>
					<div className="p-4">
						<div className="relative mx-auto rounded-md overflow-hidden bg-gray-50">
							<div className="aspect-[1/1] w-full">
								<Image
									src={p?.imageUrl || '/Images/placeholder.png'}
									alt={p.name}
									fill
									sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
									className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
								/>
							</div>
						</div>

						<h3 className="mt-3 font-semibold text-gray-900 text-base line-clamp-1">
							{p.name}
						</h3>
						<p className="mt-1 text-sm text-gray-500 line-clamp-2">
							{p.description}
						</p>

						<div className="mt-4 flex items-center justify-between">
							<div className="text-primary font-semibold text-lg">
								₹{getStartingPrice(p.priceConfiguration as unknown as PriceConfiguration).toFixed(0)}
							</div>
							<Button className="rounded-md px-3 py-2 text-sm bg-primary text-white hover:bg-primary/90 transition cursor-pointer">
								ADD
							</Button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
