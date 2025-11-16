// services/productService.ts
import CONFIG from '@/config';
import { toQueryString } from '@/lib/http';
import { PaginatedResponse, Product, ProductQueryParams } from '@/types/product';

export async function getAllProducts(
    params: ProductQueryParams = {}
): Promise<PaginatedResponse<Product>> {
    const {
        page = 1,
        limit = 12,
        tenantId = '2', //CHANGE
        sortBy = 'createdAt',
        order = 'desc',
        skip,
        categoryId,
        name,
        priceMin,
        priceMax,
        isPublished = false,
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
    // console.log(
    //     {
    //     page,
    //     limit,
    //     tenantId,
    //     sortBy,
    //     order,
    //     skip,
    //     categoryId,
    //     name,
    //     priceMin,
    //     priceMax,
    //     isPublished,
    // }
    // );

    const res = await fetch(`${CONFIG.baseUrl}${CONFIG.products.url}?${query}`, {
        next: { revalidate: 1000 * 60 * 5 },
    });
    // console.log('Fetch URL:', `${CONFIG.baseUrl}${CONFIG.products.url}?${query}`,res);
    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const json = (await res.json()) as PaginatedResponse<Product>;
    // console.log('Fetched Products:', json);
    return json;
}
