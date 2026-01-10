'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useFormStatus } from 'react-dom';

const SignupButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button className="w-full cursor-pointer" disabled={pending}>
			{pending ? 'Creating account...' : 'Create account'}
		</Button>
	);
};

export default SignupButton;
