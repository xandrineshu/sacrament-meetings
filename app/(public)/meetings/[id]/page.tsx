import { getMeetingById } from '@/lib/meetings-db';
import MeetingDetail from '@/components/MeetingDetail';
import { notFound } from 'next/navigation';

export default async function MeetingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
        notFound();
    }

    const meeting = await getMeetingById(numericId);

    if (!meeting) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto py-6">
            <MeetingDetail meeting={meeting} />
        </div>
    );
}