import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import CheckoutClientPage from './CheckoutClientPage';
import { SearchParams } from 'next/dist/server/request/search-params';

interface CheckoutPageProps {
	searchParams: SearchParams;
}

const CheckoutPage = async ({ searchParams }: CheckoutPageProps) => {
	const session = await getSession();
	if (!session) {
		redirect(`/login?return-to=${encodeURIComponent('/checkout')}`);
	}

	const tenantId = searchParams?.tenant as string | undefined;
	if (!tenantId) {
		redirect(`/`);
	}

	return <CheckoutClientPage tenantId={tenantId} />;
};

export default CheckoutPage;
