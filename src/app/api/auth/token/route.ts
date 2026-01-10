import { cookies } from 'next/headers';

export async function GET() {
	console.log(
		'API Route: /api/auth/token called to get access token from cookies'
	);
	const clientCookies = await cookies();
	const accessToken = clientCookies.get('accessToken');
	const refreshToken = clientCookies.get('refreshToken');
	return new Response(
		JSON.stringify({
			accessToken: accessToken?.value,
			refreshToken: refreshToken ? true : false,
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
}
