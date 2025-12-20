'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
	error,
	reset,
}: {
	error?: Error;
	reset?: () => void;
}) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-xl text-center p-8 bg-white rounded-lg shadow">
				<h1 className="text-2xl font-bold mb-4">
					Something went wrong
				</h1>
				<p className="text-gray-600 mb-6">
					We encountered an unexpected error. You can retry or go back
					home.
				</p>
				<div className="flex items-center justify-center gap-4">
					<Button asChild>
						<Link href="/">Go Home</Link>
					</Button>
					<Button
						variant="ghost"
						onClick={() =>
							reset ? reset() : window.location.reload()
						}
					>
						Retry
					</Button>
				</div>
				{error && (
					<pre className="text-xs text-left mt-4 bg-gray-100 p-2 rounded overflow-auto">
						{String(error.message)}
					</pre>
				)}
			</div>
		</div>
	);
}
