// app/api/meetings/[id]/route.ts
import { NextResponse } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Await the params object in Next.js dynamic routes
    const resolvedParams = await params;
    const idParam = resolvedParams.id;
    const id = Number(idParam);

    // Validate that the ID parameter is a valid number
    if (isNaN(id)) {
        return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    const meeting = getMeetingById(id);

    if (!meeting) {
        return NextResponse.json({ message: 'Meeting not found' }, { status: 404 });
    }

    return NextResponse.json(meeting);
}