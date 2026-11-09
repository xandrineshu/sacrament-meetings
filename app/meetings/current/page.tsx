// app/meetings/current/page.tsx
import { redirect } from 'next/navigation';
import { getMeetings } from '@/lib/meetings-db';
import { connection } from 'next/server';

export default async function CurrentMeetingPage() {
    // Await connection to signal to Next.js that this page is dynamic at request-time
    await connection();

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) through 6 (Sat)
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek); // Roll back to Sunday

    // Format as 'YYYY-MM-DD'
    const year = sunday.getFullYear();
    const month = String(sunday.getMonth() + 1).padStart(2, '0');
    const day = String(sunday.getDate()).padStart(2, '0');
    const sundayString = `${year}-${month}-${day}`;

    const meetings = getMeetings(sundayString);

    if (meetings.length > 0) {
        redirect(`/meetings/${meetings[0].id}`);
    }

    // Fallback if no matching meeting exists for this Sunday
    redirect('/meetings');
}