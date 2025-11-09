import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignupPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
			<div className="w-full max-w-md bg-white rounded-lg shadow p-8">
				<div className="mb-6">
					<h2 className="text-xl font-semibold">
						Create a new account
					</h2>
					<span className="text-sm text-gray-600">
						Enter your email below to login to your account
					</span>
				</div>{' '}
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							First name
						</label>
						<Input placeholder="First name" />
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Last name
						</label>
						<Input placeholder="Last name" />
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Email
						</label>
						<Input placeholder="you@company.com" />
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Password
						</label>
						<Input type="password" placeholder="Your password" />
					</div>

					<Button className="w-full">Create account</Button>

					<p className="text-sm text-center">
						Already have an account?{' '}
						<Link href="/login" className="text-primary">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
