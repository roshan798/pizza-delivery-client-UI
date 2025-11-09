import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import PizzaHero from '../../../public/Images/Hero-pizza.png';
import CONFIG from '@/config';
import { categoryListResponse } from '@/types/types';

const sampleProducts = new Array(8).fill(0).map((_, i) => ({
	id: i + 1,
	title: `Pizza ${i + 1}`,
	description: 'Delicious cheese & toppings',
	price: (8 + i).toFixed(2),
	image: '/pizza-sample.jpg',
}));

export default async function HomePage() {
	const categoryListResponse = await fetch(CONFIG.baseUrl + CONFIG.categories.list)
	const categories = await categoryListResponse.json() as categoryListResponse;
	
	return (
		<div className="min-h-screen bg-gray-50">
			<section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
				<div>
					<h1 className="text-4xl  sm:text-5xl md:text-6xl font-extrabold leading-tight">
						Get yummy pizza in{' '}
						<span className="text-primary">30 min</span>
					</h1>
					<p className="mt-4 text-gray-600 text-xl">
						No need to pay in order total more than $10
					</p>
					<div className="mt-6">
						<Button asChild>
							<Link href="/menu">Order Now</Link>
						</Button>
					</div>
				</div>
				<div className="flex justify-center md:justify-end">
					<Image
						src={PizzaHero}
						alt="Pizza"
						width={450}
						height={450}
					/>
				</div>
			</section>

			<section className="container mx-auto px-4 py-8">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Select>
							<SelectTrigger className="w-[160px]">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								{/* <SelectItem value="all">All</SelectItem> */}
								{categories.data.map((category) => {
									return (
										<SelectItem
											key={category.id}
											value={category.id}>
											{category.name}
										</SelectItem>)

								})}
							</SelectContent>
						</Select>
						<div className="hidden sm:block">
							<Button variant="ghost">Filters</Button>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button variant="outline">Sort</Button>
						<Button>View Cart</Button>
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
					{sampleProducts.map((p) => (
						<div
							key={p.id}
							className="bg-white rounded-lg p-4 shadow"
						>
							<div className="flex justify-center">
								<Image
									src={p.image}
									width={140}
									height={140}
									alt={p.title}
									className="rounded"
								/>
							</div>
							<h3 className="mt-3 font-semibold text-lg">
								{p.title}
							</h3>
							<p className="text-sm text-gray-500">
								{p.description}
							</p>
							<div className="mt-4 flex items-center justify-between">
								<div className="text-primary font-bold">
									${p.price}
								</div>
								<Button>ADD</Button>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
