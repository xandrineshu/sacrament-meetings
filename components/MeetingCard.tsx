// components/MeetingCard.tsx
import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';

export default function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold uppercase tracking-wider px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                        {meeting.meetingType}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">{meeting.date}</span>
                </div>
                <p className="text-gray-700 mb-1"><strong>Presiding:</strong> {meeting.presiding}</p>
                <p className="text-gray-700 mb-4"><strong>Conducting:</strong> {meeting.conducting}</p>
            </div>
            <Link
                href={`/meetings/${meeting.id}`}
                className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
                View Program
            </Link>
        </div>
    );
}