export interface ProductQueryParams
	extends Record<string, string | number | boolean | undefined> {
	page?: number;
	limit?: number;
	skip?: number;

	tenantId?: string;
	categoryId?: string;
	name?: string;
	priceMin?: number;
	priceMax?: number;
	isPublished?: boolean;

	sortBy?: 'createdAt' | 'name';
	order?: SortOrder;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: {
		items: T[];
		metadata: {
			totalItems: number;
			currentPage: number;
			pageSize: number;
			totalPages: number;
			hasNextPage: boolean;
			hasPreviousPage: boolean;
		};
	};
}

export type PriceType = 'base' | 'additional';

export interface PriceConfiguration {
	priceType: PriceType;
	availableOptions: Map<string, number>;
}

export interface Attribute {
	name: string;
	value: string | number | boolean;
}

export interface Product {
	_id: string;
	name: string;
	description: string;
	imageUrl: string;
	priceConfiguration: Map<string, PriceConfiguration>;
	attributes: Attribute[];
	tenantId: string;
	categoryId: string;
	isPublished: boolean;
	createdAt: Date;
	updatedAt: Date;
	isToppingsAvailable: boolean;
}

export type PriceCfgEntry = {
	priceType: 'base' | 'additional' | 'discount';
	availableOptions: Record<string, number>;
	_id: string;
};
// export type PriceConfiguration = Record<string, PriceCfgEntry>;

export type SortOrder = 'asc' | 'desc';
export type SortBy = 'createdAt' | 'name';
