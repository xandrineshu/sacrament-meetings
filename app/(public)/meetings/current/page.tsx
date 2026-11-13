import { redirect } from 'next/navigation';
import { getMeetingByDate, getMeetings } from '@/lib/meetings-db';
import { connection } from 'next/server';

export default async function CurrentMeetingPage() {
    await connection();

    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);

    const year = sunday.getFullYear();
    const month = String(sunday.getMonth() + 1).padStart(2, '0');
    const day = String(sunday.getDate()).padStart(2, '0');
    const sundayString = `${year}-${month}-${day}`;

    const meeting = await getMeetingByDate(sundayString);

    if (meeting) {
        // Redirect with a query flag so the UI knows this is the current Sunday!
        redirect(`/meetings/${meeting.id}?current=true`);
    }

    const meetings = await getMeetings();
    if (meetings.length > 0) {
        redirect(`/meetings/${meetings[0].id}?current=true`);
    }

    redirect('/meetings');
}