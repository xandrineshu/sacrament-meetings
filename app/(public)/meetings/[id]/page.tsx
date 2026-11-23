import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getMeetingById } from '@/lib/meetings-db';
import MeetingDetail from '@/components/MeetingDetail';

async function MeetingDetailContent({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
        notFound();
    }

    const meeting = await getMeetingById(numericId);

    if (!meeting) {
        notFound();
    }

    return <MeetingDetail meeting={meeting} />;
}

export default function MeetingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <div className="space-y-6 max-w-3xl mx-auto py-6">
            <Suspense fallback={<p className="text-gray-600">Loading meeting program...</p>}>
                <MeetingDetailContent params={params} />
            </Suspense>
        </div>
    );
}