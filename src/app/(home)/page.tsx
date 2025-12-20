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
import { ProductsPagination } from './ProductsPagination';
import ProductsGrid from './ProductsGrid';
import { SortBy, SortOrder } from '@/types/product';

export default async function HomePage({
	searchParams,
}: {
	searchParams?: Record<string, string | string[] | undefined>;
}) {
	const cookieStore = await cookies();
	const tenantId = cookieStore.get('tenantId')?.value || undefined;

	// Categories (static-ish)
	const categoryListResponse = await fetch(
		CONFIG.baseUrl + CONFIG.categories.list,
		{
			next: { revalidate: 3600000 },
		}
	);
	const categories =
		(await categoryListResponse.json()) as categoryListResponse;

	const categoryId =
		typeof searchParams?.categoryId === 'string'
			? searchParams.categoryId
			: undefined;
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
	const q =
		typeof searchParams?.q === 'string' && searchParams.q.trim()
			? searchParams.q.trim()
			: undefined;

	// Fetch products (use defaults only for logic, not for URL)
	const page =
		typeof searchParams?.page === 'string' && Number(searchParams.page) > 0
			? Number(searchParams.page)
			: 1;

	const limit =
		typeof searchParams?.limit === 'string' &&
		Number(searchParams.limit) > 0
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
	// console.log('Products fetched on HomePage:', products);
	// If your API returns { meta: {...} } adjust accordingly.
	const totalItems = metadata?.totalItems ?? 0;
	const totalPages =
		metadata?.totalPages ??
		Math.max(1, Math.ceil(totalItems / Math.max(1, limit)));

	return (
		<div className="min-h-screen bg-gray-50">
			<section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
				<div>
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
						Get yummy pizza in{' '}
						<span className="text-primary">30 min</span>
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
					<Image
						src={PizzaHero}
						alt="Pizza"
						width={450}
						height={450}
					/>
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
