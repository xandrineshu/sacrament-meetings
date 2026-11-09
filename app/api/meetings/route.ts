// app/api/meetings/route.ts
import { NextResponse } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const date = url.searchParams.get('date'); // e.g. "2026-05-03" or null

    const meetings = getMeetings(date);
    return NextResponse.json(meetings);
}