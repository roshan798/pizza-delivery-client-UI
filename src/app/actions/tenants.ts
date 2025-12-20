'use server';

import { cookies } from 'next/headers';

export async function setTenant(tenantId: string) {
	console.log('setting tenant to', tenantId);
	if (!tenantId) return;
	const store = await cookies();
	store.set({
		name: 'tenantId',
		value: tenantId,
		httpOnly: true,
		path: '/',
		// secure: true, // enable in production https
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});
	// Optionally: tag-based invalidation of cached product lists per tenant
	// import { revalidateTag } from 'next/cache'
	// revalidateTag('products');
}
