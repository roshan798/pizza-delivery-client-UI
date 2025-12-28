'use client';
import { PriceConfiguration, Product } from '@/types/product';
import Image from 'next/image';
import productPlaceHolder from '../../../public/Images/product-placholder.png';
import React, { useState } from 'react';
import { ProductQuickActions } from './ProductQuickActions';
function getStartingPrice(pc?: PriceConfiguration): number {
	if (!pc) return 0;
	let min = Number.POSITIVE_INFINITY;
	for (const [, cfg] of Object.entries(pc)) {
		if (cfg.priceType !== 'base') continue;
		const v = Object.values(cfg.availableOptions ?? {})[0];
		const price = typeof v === 'number' ? v : undefined;
		if (typeof price === 'number' && price < min) min = price;
	}
	return Number.isFinite(min) ? min : 0;
}

const ProductCard = ({ product: p }: { product: Product }) => {
	const [imgSrc, setImagesrc] = useState(
		p?.imageUrl || '/Images/product-placeholder.png'
	);
	return (
		<>
			<div
				key={p._id}
				className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
			>
				<div className="p-4">
					<div className="relative mx-auto rounded-md overflow-hidden bg-gray-50">
						<div className="aspect-[1/1] w-full relative">
							<Image
								src={imgSrc}
								alt={p.name}
								fill
								onError={() => {
									setImagesrc(productPlaceHolder.src);
								}}
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
								className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
							/>
						</div>
					</div>

					<h3 className="mt-3 font-semibold text-gray-900 text-base line-clamp-1">
						{p.name}
					</h3>
					<p className="mt-1 text-sm text-gray-500 line-clamp-2">
						{p.description}
					</p>

					<div className="mt-4 flex items-center justify-between">
						<div className=" font-semibold text-base">
							<span className="text-sm text-gray-700">From</span>{' '}
							₹
							{getStartingPrice(
								p.priceConfiguration as unknown as PriceConfiguration
							).toFixed(0)}
						</div>
						<ProductQuickActions product={p} imgSrc={imgSrc} />
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductCard;
