import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { getMeetingById } from '@/lib/meetings-db';

async function EditMeetingContent({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const meetingId = Number(id);

    if (!Number.isInteger(meetingId) || meetingId <= 0) {
        notFound();
    }

    const meeting = await getMeetingById(meetingId);

    if (!meeting) {
        notFound();
    }

    const boundUpdateMeeting = updateMeeting.bind(null, meeting.id);

    return (
        <MeetingForm
            key={`${meeting.id}-${JSON.stringify(meeting)}`}
            action={boundUpdateMeeting}
            meeting={meeting}
            submitLabel="Update Meeting"
        />
    );
}

export default function EditMeetingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <div className="mx-auto max-w-2xl p-6">
            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-6 shadow-sm sm:p-8">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">
                    Edit Sacrament Meeting
                </h1>
                <Suspense fallback={<p className="text-gray-600">Loading meeting editor...</p>}>
                    <EditMeetingContent params={params} />
                </Suspense>
            </div>
        </div>
    );
}