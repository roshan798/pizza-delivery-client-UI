'use client';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { createUser, SignUpState } from '../actions/auth'; // Import SignUpState
import { useActionState, useEffect } from 'react';
import SignupButton from './components/SignupButton';
import { useToast } from '@/components/ui/toast';

export default function SignupPage() {
	const initialState: SignUpState = { message: '', success: false };
	const [state, formAction] = useActionState(createUser, initialState);
	const { toast } = useToast();

	useEffect(() => {
		if (state.success === false && state.errors && state.errors.general) {
			console.log('Signup failed:', state);
			toast({
				title: 'Signup Failed',
				description: state.errors.general,
				variant: 'error',
			})
		}
	}, [state, toast]);

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
				<form action={formAction} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							First name
						</label>
						<Input name='firstName' placeholder="First name"
							hasError={!!state.errors?.firstName}
							errorMessage={state.errors?.firstName}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Last name
						</label>
						<Input name='lastName' placeholder="Last name"
							hasError={!!state.errors?.lastName}
							errorMessage={state.errors?.lastName}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Email
						</label>
						<Input name='email' placeholder="you@company.com"
							hasError={!!state.errors?.email}
							errorMessage={state.errors?.email}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Password
						</label>
						<Input name='password' type="password" placeholder="Your password"
							hasError={!!state.errors?.password}
							errorMessage={state.errors?.password}
						/>
					</div>

					<SignupButton />
					<p className="text-sm text-center">
						Already have an account?{' '}
						<Link href="/login" className="text-primary">
							Login
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
