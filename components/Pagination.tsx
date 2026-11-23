'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    function createPageURL(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page));
        return `${pathname}?${params.toString()}`;
    }

    return (
        <nav
            aria-label="Pagination"
            className="mt-16 flex items-center justify-center gap-4"
        >
            {currentPage > 1 && (
                <Link
                    href={createPageURL(currentPage - 1)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Previous
                </Link>
            )}
            <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
                <Link
                    href={createPageURL(currentPage + 1)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Next
                </Link>
            )}
        </nav>
    );
}