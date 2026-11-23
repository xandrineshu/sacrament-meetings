'use server';

import { NeonDbError } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
    addMeeting,
    deleteMeeting as deleteMeetingFromDb,
    updateMeeting as updateMeetingInDb,
} from '@/lib/meetings-db';
import type {
    MeetingType,
    SacramentMeeting,
    SpeakerItem,
    WardBusinessItem,
} from '@/lib/types';

export type MeetingFormState = {
    message?: string;
    errors?: {
        date?: string[];
        meetingType?: string[];
        presiding?: string[];
        conducting?: string[];
        announcementsText?: string[];
        openingHymnNumber?: string[];
        openingHymnTitle?: string[];
        openingPrayer?: string[];
        wardBusinessText?: string[];
        stakeBusiness?: string[];
        sacramentHymnNumber?: string[];
        sacramentHymnTitle?: string[];
        speakersText?: string[];
        closingHymnNumber?: string[];
        closingHymnTitle?: string[];
        closingPrayer?: string[];
    };
};

const MEETING_TYPES = [
    'testimony',
    'regular',
    'stake',
    'general',
    'special',
] as const satisfies readonly MeetingType[];

const optionalHymnNumberSchema = z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return 0;
    return Number(val);
}, z.number().int().min(0, 'Hymn number cannot be negative.'));

const MeetingFormSchema = z.object({
    date: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD).')
        .refine((value) => {
            const [year, month, day] = value.split('-').map(Number);
            const date = new Date(Date.UTC(year, month - 1, day));
            return date.getUTCFullYear() === year
                && date.getUTCMonth() === month - 1
                && date.getUTCDate() === day;
        }, 'Please enter a valid calendar date.'),
    meetingType: z.enum(MEETING_TYPES, {
        error: 'Please select a valid meeting type.',
    }),
    presiding: z.string().trim().min(1, 'Presiding is required.'),
    conducting: z.string().trim(),
    announcementsText: z.string().optional().default(''),
    openingHymnNumber: optionalHymnNumberSchema,
    openingHymnTitle: z.string().trim().optional().default(''),
    openingPrayer: z.string().trim().optional().default(''),
    wardBusinessText: z.string().optional().default(''),
    stakeBusiness: z.boolean().default(false),
    sacramentHymnNumber: optionalHymnNumberSchema,
    sacramentHymnTitle: z.string().trim().optional().default(''),
    speakersText: z.string().optional().default('').superRefine((raw, context) => {
        if (!raw.trim()) return;

        for (const line of parseLineItems(raw)) {
            const parts = line.split('|').map((part) => part.trim());
            if (parts.length !== 3 || !parts[0]) {
                context.addIssue({
                    code: 'custom',
                    message: 'Use: Name | Topic | speaker or musical-number.',
                });
                return;
            }
            if (parts[2] !== 'speaker' && parts[2] !== 'musical-number') {
                context.addIssue({
                    code: 'custom',
                    message: 'Speaker type must be "speaker" or "musical-number".',
                });
                return;
            }
        }
    }),
    closingHymnNumber: optionalHymnNumberSchema,
    closingHymnTitle: z.string().trim().optional().default(''),
    closingPrayer: z.string().trim().optional().default(''),
});

function isMeetingDateConflict(error: unknown): boolean {
    return error instanceof NeonDbError
        && error.code === '23505'
        && error.constraint === 'meetings_date_key';
}

function parseLineItems(raw: string): string[] {
    return raw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

function parseSpeakers(raw: string): SpeakerItem[] {
    return parseLineItems(raw).map((line) => {
        const [namePart, topicPart, typePart] = line.split('|').map((s) => s.trim());
        return {
            name: namePart ?? '',
            topic: topicPart ?? '',
            type: typePart === 'musical-number' ? 'musical-number' : 'speaker',
        };
    });
}

function parseWardBusiness(raw: string): WardBusinessItem[] {
    return parseLineItems(raw).map((description) => ({ description }));
}

function buildMeetingPayload(
    parsedData: z.infer<typeof MeetingFormSchema>
): Omit<SacramentMeeting, 'id'> {
    return {
        date: parsedData.date,
        meetingType: parsedData.meetingType,
        presiding: parsedData.presiding,
        conducting: parsedData.conducting,
        announcements: parseLineItems(parsedData.announcementsText),
        openingHymn: {
            number: parsedData.openingHymnNumber,
            title: parsedData.openingHymnTitle,
        },
        openingPrayer: parsedData.openingPrayer,
        wardBusiness: parseWardBusiness(parsedData.wardBusinessText),
        stakeBusiness: parsedData.stakeBusiness,
        sacramentHymn: {
            number: parsedData.sacramentHymnNumber,
            title: parsedData.sacramentHymnTitle,
        },
        speakers: parseSpeakers(parsedData.speakersText),
        closingHymn: {
            number: parsedData.closingHymnNumber,
            title: parsedData.closingHymnTitle,
        },
        closingPrayer: parsedData.closingPrayer,
    };
}

function extractRawFormData(formData: FormData) {
    return {
        date: String(formData.get('date') ?? ''),
        meetingType: String(formData.get('meetingType') ?? 'regular'),
        presiding: String(formData.get('presiding') ?? ''),
        conducting: String(formData.get('conducting') ?? ''),
        announcementsText: String(formData.get('announcements') ?? ''),
        openingHymnNumber: formData.get('openingHymnNumber'),
        openingHymnTitle: String(formData.get('openingHymnTitle') ?? ''),
        openingPrayer: String(formData.get('openingPrayer') ?? ''),
        wardBusinessText: String(formData.get('wardBusiness') ?? ''),
        stakeBusiness:
            formData.get('stakeBusiness') === 'true' ||
            formData.get('stakeBusiness') === 'on',
        sacramentHymnNumber: formData.get('sacramentHymnNumber'),
        sacramentHymnTitle: String(formData.get('sacramentHymnTitle') ?? ''),
        speakersText: String(formData.get('speakers') ?? ''),
        closingHymnNumber: formData.get('closingHymnNumber'),
        closingHymnTitle: String(formData.get('closingHymnTitle') ?? ''),
        closingPrayer: String(formData.get('closingPrayer') ?? ''),
    };
}

export async function createMeeting(
    _prevState: MeetingFormState,
    formData: FormData
): Promise<MeetingFormState> {
    const parsed = MeetingFormSchema.safeParse(extractRawFormData(formData));

    if (!parsed.success) {
        return {
            message: 'Please fix the validation errors below before saving.',
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        const payload = buildMeetingPayload(parsed.data);
        await addMeeting(payload);
        revalidatePath('/meetings');
    } catch (error) {
        console.error('Error creating meeting:', error);
        if (isMeetingDateConflict(error)) {
            return {
                message: 'A meeting is already scheduled for that date.',
                errors: { date: ['Choose a date that does not already have a meeting.'] },
            };
        }
        return {
            message: 'Could not create the sacrament meeting. Please try again.',
        };
    }

    redirect('/meetings');
}

export async function updateMeeting(
    id: number,
    _prevState: MeetingFormState,
    formData: FormData
): Promise<MeetingFormState> {
    if (!Number.isInteger(id) || id <= 0) {
        return {
            message: 'Invalid meeting ID.',
        };
    }

    const parsed = MeetingFormSchema.safeParse(extractRawFormData(formData));

    if (!parsed.success) {
        return {
            message: 'Please fix the validation errors below before saving changes.',
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        const payload = buildMeetingPayload(parsed.data);
        const updated = await updateMeetingInDb(id, payload);

        if (!updated) {
            return {
                message: 'Meeting record could not be found to update.',
            };
        }

        revalidatePath('/meetings');
        revalidatePath(`/meetings/${id}`);
        revalidatePath(`/meetings/${id}/edit`);
    } catch (error) {
        console.error(`Error updating meeting ${id}:`, error);
        if (isMeetingDateConflict(error)) {
            return {
                message: 'A meeting is already scheduled for that date.',
                errors: { date: ['Choose a date that does not already have a meeting.'] },
            };
        }
        return {
            message: 'Could not update the sacrament meeting. Please try again.',
        };
    }

    redirect(`/meetings/${id}`);
}

export async function deleteMeeting(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid meeting ID.');
    }

    try {
        const deleted = await deleteMeetingFromDb(id);
        if (!deleted) {
            throw new Error('Meeting record could not be found to delete.');
        }
        revalidatePath('/meetings');
    } catch (error) {
        console.error(`Error deleting meeting ${id}:`, error);
        throw new Error('Could not delete the sacrament meeting. Please try again.');
    }

    redirect('/meetings');
}