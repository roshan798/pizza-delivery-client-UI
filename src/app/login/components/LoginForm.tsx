'use client';
import { LoginState, loginUser } from '@/app/actions/auth';
import { useToast } from '@/components/ui/toast';
import { useActionState, useEffect } from 'react';
import LoginButton from './LoginButton';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface LoginFormProps {
	returnTo?: string;
}

export function LoginForm({ returnTo }: LoginFormProps) {
	const initialState: LoginState = { message: '', success: false };
	const [state, formAction] = useActionState(loginUser, initialState);
	const { toast } = useToast();
	useEffect(() => {
		if (state.success === false && state.errors && state.errors.general) {
			console.log('Login failed:', state);
			toast({
				title: 'Login Failed',
				description: state.errors.general,
				variant: 'error',
			});
		}
	}, [state, toast]);
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
				<form action={formAction} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							Email
						</label>
						<Input
							autoComplete="email"
							name="email"
							type="email"
							placeholder="john@example.com"
							hasError={!!state.errors?.email}
							errorMessage={state.errors?.email}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">
							Password
						</label>
						<Input
							autoComplete="current-password"
							name="password"
							type="password"
							placeholder="Your password"
							hasError={!!state.errors?.password}
							errorMessage={state.errors?.password}
						/>
					</div>
					{returnTo && (
						<input type="hidden" name="returnTo" value={returnTo} />
					)}

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

					<LoginButton />
					<p className="text-sm text-center">
						Don&apos;t have an account?{' '}
						<Link href="/signup" className="text-primary">
							Sign up
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
