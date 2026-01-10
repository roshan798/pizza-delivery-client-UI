import { setAuthCookies } from '@/app/actions/auth';
import CONFIG from '@/config';
import { cookies } from 'next/headers';

export async function POST() {
	const clientCookies = await cookies();
	const refreshToken = clientCookies.get('refreshToken');
	const accessToken = clientCookies.get('accessToken');
	const res = await fetch(CONFIG.baseUrl + CONFIG.auth.refresh, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',

			Authorization: accessToken ? `Bearer ${accessToken.value}` : '',
			cookie: refreshToken ? `refreshToken=${refreshToken.value}` : '',
		},
	});
	if (!res.ok) {
		return new Response(
			JSON.stringify({ message: 'Failed to refresh access token' }),
			{
				status: 401,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
	const cookieHeader = res.headers.get('set-cookie');
	if (cookieHeader) {
		setAuthCookies(cookieHeader, 'refresh');
		return new Response(
			JSON.stringify({ message: 'Access token refreshed' }),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} else {
		console.warn('No Set-Cookie header found in the refresh response.');
	}
	return new Response(
		JSON.stringify({
			message: 'Access token refreshed, but no cookies set',
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
}
