import { NextResponse } from 'next/server';
import { getMeetingByDate, getMeetings } from '@/lib/meetings-db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';
        const date = searchParams.get('date');

        if (date) {
            const meeting = await getMeetingByDate(date);
            return NextResponse.json(meeting ? [meeting] : []);
        }

        const rawPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
        const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

        const meetings = await getMeetings(query, page);
        return NextResponse.json(meetings);
    } catch (error) {
        void error;
        return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
    }
}