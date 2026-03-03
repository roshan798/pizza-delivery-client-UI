import { Suspense } from 'react';
import PaymentStatusContent from './PaymentStatusContent';

export default function PaymentPage() {
	return (
		<Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<p className="text-lg text-gray-700">Loading order details...</p>
		</div>}>
			<PaymentStatusContent />
		</Suspense>
	);
}
