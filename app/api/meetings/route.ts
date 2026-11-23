import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addMeeting, getMeetingByDate, getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

const meetingSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    meetingType: z.enum(['testimony', 'regular', 'stake', 'general', 'special']),
    presiding: z.string().trim().min(1),
    conducting: z.string().trim(),
    announcements: z.array(z.string()).default([]),
    openingHymn: z.object({ number: z.number().int().min(0), title: z.string() }),
    openingPrayer: z.string(),
    wardBusiness: z.array(z.object({ description: z.string() })).default([]),
    stakeBusiness: z.boolean(),
    sacramentHymn: z.object({ number: z.number().int().min(0), title: z.string() }),
    speakers: z.array(z.object({
        name: z.string().trim().min(1),
        topic: z.string(),
        type: z.enum(['speaker', 'musical-number']),
    })).default([]),
    closingHymn: z.object({ number: z.number().int().min(0), title: z.string() }),
    closingPrayer: z.string(),
});

function isValidDate(value: string): boolean {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';
        const date = searchParams.get('date');

        if (date) {
            if (!isValidDate(date)) {
                return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
            }
            const meeting = await getMeetingByDate(date);
            return NextResponse.json(meeting ? [meeting] : []);
        }

        const rawPage = searchParams.get('page') ?? '1';
        const page = /^\d+$/.test(rawPage) && Number(rawPage) > 0 ? Number(rawPage) : 1;

        const meetings = await getMeetings(query, page);
        return NextResponse.json(meetings);
    } catch (error) {
        void error;
        return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }
        const parsed = meetingSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid meeting data', issues: parsed.error.flatten() },
                { status: 400 }
            );
        }
        if (!isValidDate(parsed.data.date)) {
            return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
        }

        const meeting = await addMeeting(parsed.data as Omit<SacramentMeeting, 'id'>);
        revalidatePath('/meetings');
        return NextResponse.json(meeting, { status: 201 });
    } catch (error) {
        void error;
        return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
    }
}