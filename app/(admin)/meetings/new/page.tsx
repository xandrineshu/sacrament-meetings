import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export default function NewMeetingPage() {
    return (
        <div className="mx-auto max-w-2xl p-6">
            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-6 shadow-sm sm:p-8">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">
                    Create Sacrament Meeting
                </h1>
                <MeetingForm
                    action={createMeeting}
                    submitLabel="Create Meeting"
                />
            </div>
        </div>
    );
}