// app/api/meetings/[id]/route.ts
import { NextResponse } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const numericId = Number(id);

        if (isNaN(numericId)) {
            return NextResponse.json({ error: 'Invalid meeting ID' }, { status: 400 });
        }

        const meeting = await getMeetingById(numericId);

        if (!meeting) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }

        return NextResponse.json(meeting);
    } catch (error) {
        void error;
        return NextResponse.json({ error: 'Failed to fetch meeting' }, { status: 500 });
    }
}