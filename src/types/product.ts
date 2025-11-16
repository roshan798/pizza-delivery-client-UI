// types/product.ts
export type SortOrder = 'asc' | 'desc';

export interface ProductQueryParams extends Record<string, string | number | boolean | undefined> {
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

// export interface Product {
//     id: string;
//     name: string;
//     description?: string;
//     priceConfiguration?: Record<string, any>;
//     attributes?: Record<string, any>[];
//     imageUrl?: string;
//     createdAt: string;
//     isPublished: boolean;
//     categoryId?: string;
// }

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
}