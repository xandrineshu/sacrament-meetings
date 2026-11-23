// app/api/meetings/[id]/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { deleteMeeting, getMeetingById, updateMeeting } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

const meetingUpdateSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    meetingType: z.enum(['testimony', 'regular', 'stake', 'general', 'special']).optional(),
    presiding: z.string().trim().min(1).optional(),
    conducting: z.string().trim().optional(),
    announcements: z.array(z.string()).optional(),
    openingHymn: z.object({ number: z.number().int().min(0), title: z.string() }).optional(),
    openingPrayer: z.string().optional(),
    wardBusiness: z.array(z.object({ description: z.string() })).optional(),
    stakeBusiness: z.boolean().optional(),
    sacramentHymn: z.object({ number: z.number().int().min(0), title: z.string() }).optional(),
    speakers: z.array(z.object({
        name: z.string().trim().min(1),
        topic: z.string(),
        type: z.enum(['speaker', 'musical-number']),
    })).optional(),
    closingHymn: z.object({ number: z.number().int().min(0), title: z.string() }).optional(),
    closingPrayer: z.string().optional(),
}).refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update.');

function isValidDate(value: string): boolean {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
}

function parseMeetingId(id: string): number | null {
    if (!/^\d+$/.test(id)) return null;
    const numericId = Number(id);
    return Number.isSafeInteger(numericId) && numericId > 0 ? numericId : null;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const numericId = parseMeetingId(id);

        if (numericId === null) {
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

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const numericId = parseMeetingId(id);
        if (numericId === null) {
            return NextResponse.json({ error: 'Invalid meeting ID' }, { status: 400 });
        }

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }
        const parsed = meetingUpdateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid meeting data', issues: parsed.error.flatten() },
                { status: 400 }
            );
        }
        if (parsed.data.date && !isValidDate(parsed.data.date)) {
            return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
        }

        const meeting = await updateMeeting(numericId, parsed.data as Partial<SacramentMeeting>);
        if (!meeting) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }
        revalidatePath('/meetings');
        revalidatePath(`/meetings/${numericId}`);
        return NextResponse.json(meeting);
    } catch (error) {
        void error;
        return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const numericId = parseMeetingId(id);
        if (numericId === null) {
            return NextResponse.json({ error: 'Invalid meeting ID' }, { status: 400 });
        }

        const deleted = await deleteMeeting(numericId);
        if (!deleted) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }
        revalidatePath('/meetings');
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        void error;
        return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
    }
}