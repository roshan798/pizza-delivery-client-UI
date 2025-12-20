export type Tenant = {
	id: string;
	name: string;
	address: string;
	createdAt: string;
	updatedAt: string;
};
export interface TenantsResponse {
	message: string;
	success: boolean;
	tenants: Tenant[];
}

export type categoryList = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
};

export interface categoryListResponse {
	success: boolean;
	data: categoryList[];
}

export type Topping = {
	id: string;
	name: string;
	price: number;
	image: string;
	tenantId: string;
	createdAt: string;
	updatedAt: string;
};
