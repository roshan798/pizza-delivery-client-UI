import { ProductsEmpty } from '@/components/custom/empty/ProductsEmpty';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

export default function ProductsGrid({ products }: { products: Product[] }) {
	if (!products || products.length === 0) {
		return (
			<div className="mt-6">
				<ProductsEmpty onBrowseAllHref="/" />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
			{products.map((p) => (
				<ProductCard key={p._id} product={p} />
			))}
		</div>
	);
}
