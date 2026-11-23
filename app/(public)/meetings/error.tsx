'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function MeetingsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Meetings route error:', error);
    }, [error]);

    return (
        <div className="mx-auto max-w-xl p-6">
            <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
            <p className="mb-6 text-gray-600">
                {error.message || 'An unexpected error occurred while loading or updating meetings.'}
            </p>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => reset()}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Try Again
                </button>
                <Link
                    href="/meetings"
                    className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                    Back to Meetings
                </Link>
            </div>
        </div>
    );
}