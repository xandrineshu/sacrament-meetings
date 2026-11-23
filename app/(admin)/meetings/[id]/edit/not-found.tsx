import Link from 'next/link';

export default function EditMeetingNotFound() {
    return (
        <div className="mx-auto max-w-xl p-6">
            <h1 className="mb-2 text-2xl font-bold">Meeting not found</h1>
            <p className="mb-6 text-gray-600">
                The sacrament meeting you are trying to edit could not be found or may have been removed.
            </p>
            <Link
                href="/meetings"
                className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Back to Meetings
            </Link>
        </div>
    );
}