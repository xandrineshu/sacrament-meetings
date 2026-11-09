// app/meetings/[id]/page.tsx
import MeetingDetail from '@/components/MeetingDetail';
import type { SacramentMeeting } from '@/lib/types';
import { notFound } from 'next/navigation';

async function getMeeting(id: string): Promise<SacramentMeeting | null> {
    try {
        const res = await fetch(`http://localhost:3000/api/meetings/${id}`, { cache: 'no-store' });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Failed to fetch meeting');
        return res.json();
    } catch {
        const { getMeetingById } = await import('@/lib/meetings-db');
        const numericId = Number(id);
        return isNaN(numericId) ? null : getMeetingById(numericId);
    }
}

export default async function MeetingDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const meeting = await getMeeting(params.id);

    if (!meeting) {
        notFound();
    }

    return (
        <div>
            <MeetingDetail meeting={meeting} />
        </div>
    );
}