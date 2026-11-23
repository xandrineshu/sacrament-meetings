'use client';

import Link from 'next/link';
import { deleteMeeting } from '@/lib/actions';
import type { SacramentMeeting } from '@/lib/types';

export default function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
    const handleDelete = deleteMeeting.bind(null, meeting.id);

    function confirmDelete(event: React.FormEvent<HTMLFormElement>) {
        const confirmed = window.confirm(
            `Are you sure you want to delete the sacrament meeting on ${meeting.date}? This action cannot be undone.`
        );
        if (!confirmed) {
            event.preventDefault();
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold uppercase tracking-wider px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                        {meeting.meetingType}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">{meeting.date}</span>
                </div>
                <p className="text-gray-700 mb-1">
                    <strong>Presiding:</strong> {meeting.presiding}
                </p>
                <p className="text-gray-700 mb-4">
                    <strong>Conducting:</strong> {meeting.conducting}
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
                <Link
                    href={`/meetings/${meeting.id}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded transition-colors"
                >
                    View Program
                </Link>
                <Link
                    href={`/meetings/${meeting.id}/edit`}
                    className="text-center border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2 px-3 rounded transition-colors"
                >
                    Edit
                </Link>
                <form action={handleDelete} onSubmit={confirmDelete}>
                    <button
                        type="submit"
                        aria-label={`Delete meeting on ${meeting.date}`}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded transition-colors"
                    >
                        Delete
                    </button>
                </form>
            </div>
        </div>
    );
}