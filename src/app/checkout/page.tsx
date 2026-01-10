import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import CheckoutClientPage from './CheckoutClientPage';

const CheckoutPage = async () => {
	const session = await getSession();
	if (!session) {
		redirect(`/login?return-to=${encodeURIComponent('/checkout')}`);
	}
	return <CheckoutClientPage />;
};

export default CheckoutPage;
