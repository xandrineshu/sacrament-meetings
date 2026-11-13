// app/meetings/page.tsx
import { getMeetings } from '@/lib/meetings-db';
import MeetingCard from '@/components/MeetingCard';

export default async function MeetingsPage() {
    const meetings = await getMeetings();

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <h1 className="text-2xl font-bold text-[#293681] tracking-tight">
                Sacrament Meeting Schedule
            </h1>

            {/* Grid of Meeting Cards using the reusable component */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
            </div>
        </div>
    );
}