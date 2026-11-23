import { redirect } from 'next/navigation';
import { getMeetingByDate } from '@/lib/meetings-db';
import { connection } from 'next/server';
import Link from 'next/link';
import { Suspense } from 'react';

async function CurrentMeetingContent() {
    await connection();

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + daysUntilSunday);

    const year = sunday.getFullYear();
    const month = String(sunday.getMonth() + 1).padStart(2, '0');
    const day = String(sunday.getDate()).padStart(2, '0');
    const sundayString = `${year}-${month}-${day}`;

    const meeting = await getMeetingByDate(sundayString);

    if (meeting) {
        redirect(`/meetings/${meeting.id}?current=true`);
    }

    return (
        <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#293681]">No meeting scheduled for this Sunday</h1>
            <p className="mt-3 text-gray-600">
                There is no sacrament meeting record for {sundayString}.
            </p>
            <Link
                href="/meetings"
                className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
                View all meetings
            </Link>
        </div>
    );
}

export default function CurrentMeetingPage() {
    return (
        <Suspense
            fallback={
                <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-gray-600">Loading this week&apos;s Sunday meeting...</p>
                </div>
            }
        >
            <CurrentMeetingContent />
        </Suspense>
    );
}