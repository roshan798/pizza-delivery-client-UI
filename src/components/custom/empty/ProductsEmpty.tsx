// components/empty/ProductsEmpty.tsx
import { Button } from '@/components/ui/button';

export function ProductsEmpty({
    onBrowseAllHref = '/',
}: { onBrowseAllHref?: string }) {
    return (
        <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-gray-300 bg-white p-10">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No products to show</h3>
            <p className="mt-1 text-sm text-gray-600">
                Try adjusting filters or browsing all categories.
            </p>
            <a href={onBrowseAllHref} className="mt-4">
                <Button>Browse all</Button>
            </a>
        </div>
    );
}
