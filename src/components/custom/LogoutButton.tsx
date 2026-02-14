'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { logoutUser } from '@/app/actions/auth';

export default function LogoutButton() {
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		await logoutUser(); 
		setIsLoggingOut(false);
	};

	return (
		<Button onClick={handleLogout} variant="default" disabled={isLoggingOut}>
			{isLoggingOut ? 'Logging out...' : 'Logout'}
		</Button>
	);
}
