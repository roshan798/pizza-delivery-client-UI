'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
    PaginationEllipsis,
} from '@/components/ui/pagination';

export function ProductsPagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentPage = Math.max(1, Number(searchParams.get('page') || '1'));
    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (pageNumber <= 1) params.delete('page'); else params.set('page', String(pageNumber));
        return `${pathname}?${params.toString()}`;
    };

    const canPrev = currentPage > 1;
    const canNext = currentPage < totalPages;

    const pages: number[] = [];
    const window = 2;
    const start = Math.max(1, currentPage - window);
    const end = Math.min(totalPages, currentPage + window);
    for (let p = start; p <= end; p++) pages.push(p);

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={canPrev ? createPageURL(currentPage - 1) : undefined}
                        aria-disabled={!canPrev}
                        className={!canPrev ? 'pointer-events-none opacity-40' : undefined}
                        onClick={(e) => {
                            if (!canPrev) return;
                            e.preventDefault();
                            router.push(createPageURL(currentPage - 1), { scroll: false });
                        }}
                    />
                </PaginationItem>

                {start > 1 && (
                    <>
                        <PaginationItem>
                            <PaginationLink
                                href={createPageURL(1)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(createPageURL(1), { scroll: false });
                                }}
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                        {start > 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                    </>
                )}

                {pages.map((p) => (
                    <PaginationItem key={p}>
                        <PaginationLink
                            href={createPageURL(p)}
                            isActive={p === currentPage}
                            aria-current={p === currentPage ? 'page' : undefined}
                            onClick={(e) => {
                                e.preventDefault();
                                router.push(createPageURL(p), { scroll: false });
                            }}
                        >
                            {p}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {end < totalPages && (
                    <>
                        {end < totalPages - 1 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink
                                href={createPageURL(totalPages)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(createPageURL(totalPages), { scroll: false });
                                }}
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}

                <PaginationItem>
                    <PaginationNext
                        href={canNext ? createPageURL(currentPage + 1) : undefined}
                        aria-disabled={!canNext}
                        className={!canNext ? 'pointer-events-none opacity-40' : undefined}
                        onClick={(e) => {
                            if (!canNext) return;
                            e.preventDefault();
                            router.push(createPageURL(currentPage + 1), { scroll: false });
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
