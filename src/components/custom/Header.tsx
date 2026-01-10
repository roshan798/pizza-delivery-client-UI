import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../public/Logo.svg';
import CONFIG from '@/config';
import { cookies } from 'next/headers';
import { Button } from '../ui/button';
import { TenantSelect } from './TenantSelect';
import ClientCartIconWrapper from './ClientCartIconWrapper';
import { getSession } from '@/lib/session';
import LogoutButton from './LogoutButton';

export default async function Header() {
	const baseUrl = CONFIG.baseUrl.replace('localhost', '127.0.0.1');
	const res = await fetch(baseUrl + CONFIG.tenants.url, {
		next: { revalidate: 3600, tags: ['tenants'] },
	});
	const { tenants } = (await res.json()) as {
		tenants: { id: string; name: string }[];
	};
	const current = (await cookies()).get('tenantId')?.value || 'all';
	const session = await getSession();
	return (
		<header className="w-full bg-white border-b">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href="/">
						<Image src={Logo} alt="Pizza App" />
					</Link>
					<div className="block">
						<TenantSelect tenants={tenants} current={current} />
					</div>
				</div>
				{/* ...right nav... */}
				{/* Right: Nav + auth */}
				<div className="flex items-center gap-4">
					<nav className="hidden md:flex items-center gap-6">
						<Link
							href="/menu"
							className="text-sm font-medium text-gray-700 hover:text-primary"
						>
							Menu
						</Link>
						<Link
							href="/offers"
							className="text-sm font-medium text-gray-700 hover:text-primary"
						>
							Offers
						</Link>
						<Link
							href="/contact"
							className="text-sm font-medium text-gray-700 hover:text-primary"
						>
							Contact
						</Link>
					</nav>
					<ClientCartIconWrapper />{' '}
					{/* Use the client wrapper here */}
					<div className="flex items-center gap-3"></div>
					{session ? (
						<LogoutButton />
					) : (
						<Link href="/login">
							<Button variant="default">Login</Button>{' '}
							{/* Corrected: Login button should not call handleLogout */}
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
