'use client';

export function CartLoading() {
	return (
		<div className="min-h-[60vh] grid place-items-center">
			<div className="flex flex-col items-center gap-4">
				<div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-primary animate-spin" />
				<p className="text-sm text-gray-600">Loading your cart...</p>
			</div>
		</div>
	);
}
