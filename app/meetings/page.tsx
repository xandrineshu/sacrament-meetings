// app/meetings/page.tsx
import MeetingCard from '@/components/MeetingCard';
import type { SacramentMeeting } from '@/lib/types';

async function getMeetingsData(): Promise<SacramentMeeting[]> {
    // Relative or absolute fetch for server components in Next.js App Router
    try {
        const res = await fetch('http://localhost:3000/api/meetings', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch meetings');
        return res.json();
    } catch {
        // Fallback if local fetch fails during build/ssr
        const { getMeetings } = await import('@/lib/meetings-db');
        return getMeetings();
    }
}

export default async function MeetingsPage() {
    const meetings = await getMeetingsData();

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sacrament Meeting Schedule</h2>
            {meetings.length === 0 ? (
                <p className="text-gray-500">No meetings found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {meetings.map((meeting) => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                </div>
            )}
        </div>
    );
}