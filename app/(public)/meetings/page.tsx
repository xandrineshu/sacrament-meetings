import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';
import { MeetingSearch } from '@/components/MeetingSearch';
import MeetingCard from '@/components/MeetingCard';
import Link from 'next/link';

function Pagination({ totalPages, currentPage, query }: {
    totalPages: number;
    currentPage: number;
    query: string;
}) {
    if (totalPages <= 1) return null;

    const hrefForPage = (page: number) => {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        params.set('page', String(page));
        return `?${params.toString()}`;
    };

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
            {currentPage > 1 && (
                <Link href={hrefForPage(currentPage - 1)} className="rounded border px-3 py-1">
                    Previous
                </Link>
            )}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <Link
                    key={page}
                    href={hrefForPage(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className={`rounded border px-3 py-1 ${page === currentPage ? 'font-bold' : ''}`}
                >
                    {page}
                </Link>
            ))}
            {currentPage < totalPages && (
                <Link href={hrefForPage(currentPage + 1)} className="rounded border px-3 py-1">
                    Next
                </Link>
            )}
        </nav>
    );
}

export default async function MeetingsPage(props: {
    searchParams?: Promise<{ query?: string; page?: string }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query ?? '';
    const rawPage = Number.parseInt(searchParams?.page ?? '1', 10);
    const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

    const [meetings, totalPages] = await Promise.all([
        getMeetings(query, currentPage),
        getMeetingsTotalPages(query),
    ]);

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <h1 className="text-2xl font-bold text-[#293681] tracking-tight">
                Sacrament Meeting Schedule
            </h1>

            {/* Search Input */}
            <div className="max-w-md">
                <MeetingSearch />
            </div>

            {/* Grid of Meeting Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
            </div>

            {/* Pagination Controls */}
            <Pagination totalPages={totalPages} currentPage={currentPage} query={query} />
        </div>
    );
}