'use client';

import { Button } from '../ui/button';
import { logoutUser } from '@/app/actions/auth';

export default function LogoutButton() {
	const handleLogout = async () => {
		await logoutUser();
	};

	return (
		<Button onClick={handleLogout} variant="default">
			Logout
		</Button>
	);
}
