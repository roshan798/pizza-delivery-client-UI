// services/productService.ts
import CONFIG from '@/config';
import { toQueryString } from '@/lib/http';
import {
	PaginatedResponse,
	Product,
	ProductQueryParams,
} from '@/types/product';

export async function getAllProducts(
	params: ProductQueryParams = {}
): Promise<PaginatedResponse<Product>> {
	const {
		page = 1,
		limit = 12,
		tenantId = '1',
		sortBy = 'createdAt',
		order = 'desc',
		skip,
		categoryId,
		name,
		priceMin,
		priceMax,
		isPublished = true,
	} = params;

	const query = toQueryString({
		page,
		limit,
		tenantId,
		sortBy,
		order,
		skip,
		categoryId,
		name,
		priceMin,
		priceMax,
		isPublished,
	});

	const res = await fetch(
		`${CONFIG.baseUrl}${CONFIG.products.url}?${query}`,
		{
			next: { revalidate: 1000 * 60 * 5 },
		}
	);
	if (!res.ok) {
		throw new Error(`Failed to fetch products: ${res.status}`);
	}

	const json = (await res.json()) as PaginatedResponse<Product>;
	return json;
}
