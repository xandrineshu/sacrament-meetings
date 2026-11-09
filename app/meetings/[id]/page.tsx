// app/meetings/[id]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getMeetingById } from '@/lib/meetings-db';
import MeetingDetail from '@/components/MeetingDetail';

async function MeetingContent({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
        notFound();
    }

    const meeting = getMeetingById(id);

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
        <Suspense fallback={<div className="p-4 text-gray-500">Loading meeting details...</div>}>
            <MeetingContent params={params} />
        </Suspense>
    );
}