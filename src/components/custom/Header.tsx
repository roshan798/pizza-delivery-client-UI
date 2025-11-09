import Link from 'next/link';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import Image from 'next/image';
import Logo from '../../../public/Logo.svg';
import { Button } from '../ui/button';
import CONFIG from '@/config';
import { TenantsResponse } from '@/types/types';



export default async function Header() {
	const baseUrl = CONFIG.baseUrl.replace('localhost', '127.0.0.1');
	console.log('Attempting to fetch from:', baseUrl + CONFIG.tenants.url);

	const res = await fetch(baseUrl + CONFIG.tenants.url);
	if (!res.ok) {
		throw new Error(`HTTP error! status: ${res.status}`);
	}

	const response = await res.json() as TenantsResponse;
	const restraunts = response.tenants;
	return (
		<header className="w-full bg-white border-b">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				{/* Left: Logo + selector */}
				<div className="flex items-center gap-4">
					<Link href="/">
						<Image src={Logo} alt="Pizza App" />
					</Link>

					<div className="hidden sm:block">
						<Select>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Select Restaurant" />
							</SelectTrigger>
							<SelectContent>{
								restraunts.map(restaurant => (
									<SelectItem key={restaurant.id} value={restaurant.id}>
										{restaurant.name}
									</SelectItem>
								))
							}
							</SelectContent>
						</Select>
					</div>
				</div>

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

					<div>
						<Link href="/login">
							<Button variant="default">Login</Button>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}
