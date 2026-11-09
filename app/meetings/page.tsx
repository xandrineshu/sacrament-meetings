// app/meetings/page.tsx
import Link from 'next/link';
import { getMeetings } from '@/lib/meetings-db';

export default function MeetingsPage() {
    const meetings = getMeetings();

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <h1 className="text-2xl font-bold text-[#293681] tracking-tight">
                Sacrament Meeting Schedule
            </h1>

            {/* Grid of Meeting Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meetings.map((meeting) => (
                    <div
                        key={meeting.id}
                        className="bg-white rounded-xl p-6 shadow-sm border border-[#95CCDD]/50 hover:border-[#4274D9] transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="uppercase text-xs font-bold tracking-wider bg-[#D0E7E6] text-[#293681] px-3 py-1 rounded-full">
                                    {meeting.meetingType ?? 'REGULAR'}
                                </span>
                                <span className="text-xs font-medium text-gray-500">
                                    {meeting.date}
                                </span>
                            </div>

                            <div className="space-y-1 mb-6 text-sm">
                                <p className="text-gray-700">
                                    <span className="font-semibold text-[#293681]">Presiding:</span>{' '}
                                    {meeting.presiding}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold text-[#293681]">Conducting:</span>{' '}
                                    {meeting.conducting}
                                </p>
                            </div>
                        </div>

                        <Link
                            href={`/meetings/${meeting.id}`}
                            className="w-full block text-center py-2.5 px-4 rounded-lg bg-[#4274D9] hover:bg-[#293681] text-white font-medium text-sm transition-colors shadow-sm"
                        >
                            View Program
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}