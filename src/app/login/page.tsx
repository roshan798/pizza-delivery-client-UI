import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CONFIG from '@/config';

export default async function LoginPage() {
	try {
		const response = await fetch(`${CONFIG.baseUrl}${CONFIG.tenants.url}`);
		const restaurants = await response.json();
		console.log('Fetched restaurants:', restaurants);
		
	} catch (error) {
		console.error('Error fetching tenants:', error);
	}
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
			<div className="w-full max-w-md bg-white rounded-lg shadow p-8 ">
				<div className="mb-6">
					<h2 className="text-xl font-semibold">
						Login to your account
					</h2>
					<span className="text-sm text-gray-600">
						Enter your email below to login to your account
					</span>
				</div>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							Email
						</label>
						<Input placeholder="john@example.com" />
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Password
						</label>
						<Input type="password" placeholder="Your password" />
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<input
								id="remember"
								type="checkbox"
								className="h-4 w-4"
							/>
							<label htmlFor="remember" className="text-sm">
								Remember me
							</label>
						</div>
						<Link href="#" className="text-sm text-primary">
							Forgot password?
						</Link>
					</div>

					<Button className="w-full cursor-pointer">Sign in</Button>

					<p className="text-sm text-center">
						Don&apos;t have an account?{' '}
						<Link href="/signup" className="text-primary">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
