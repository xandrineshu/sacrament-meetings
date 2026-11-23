import { neon } from '@neondatabase/serverless';
import type { MeetingType, SacramentMeeting } from './types';

const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 6;

type MeetingRow = {
    id: number;
    date: string;
    meetingType: string;
    presiding: string;
    conducting: string;
    announcements: string[] | null;
    openingHymn: { number: number; title: string } | null;
    openingPrayer: string;
    wardBusiness: Array<{ description: string }> | null;
    stakeBusiness: boolean;
    sacramentHymn: { number: number; title: string } | null;
    speakers: Array<{ name: string; topic: string; type: string }> | null;
    closingHymn: { number: number; title: string } | null;
    closingPrayer: string;
};

function normalizeHymn(value: unknown): { number: number; title: string } {
    const hymn = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>;

    return {
        number: Number(hymn.number ?? 0),
        title: String(hymn.title ?? ''),
    };
}

function normalizeMeeting(row: MeetingRow): SacramentMeeting {
    const meetingType = String(row.meetingType ?? 'regular').toLowerCase();
    const validMeetingType = ['testimony', 'regular', 'stake', 'general', 'special'].includes(meetingType)
        ? meetingType
        : 'regular';

    return {
        id: Number(row.id ?? 0),
        date: String(row.date ?? ''),
        meetingType: validMeetingType as MeetingType,
        presiding: String(row.presiding ?? ''),
        conducting: String(row.conducting ?? ''),
        announcements: Array.isArray(row.announcements) ? row.announcements.map((item) => String(item ?? '')) : [],
        openingHymn: normalizeHymn(row.openingHymn),
        openingPrayer: String(row.openingPrayer ?? ''),
        wardBusiness: Array.isArray(row.wardBusiness)
            ? row.wardBusiness
                .map((item) => ({ description: String(item?.description ?? '') }))
                .filter((item) => item.description)
            : [],
        stakeBusiness: Boolean(row.stakeBusiness),
        sacramentHymn: normalizeHymn(row.sacramentHymn),
        speakers: Array.isArray(row.speakers)
            ? row.speakers.map((speaker) => ({
                name: String(speaker?.name ?? ''),
                topic: String(speaker?.topic ?? ''),
                type: speaker?.type === 'musical-number' ? 'musical-number' : 'speaker',
            }))
            : [],
        closingHymn: normalizeHymn(row.closingHymn),
        closingPrayer: String(row.closingPrayer ?? ''),
    };
}

function sanitizePage(currentPage: number): number {
    if (!Number.isFinite(currentPage) || currentPage < 1) {
        return 1;
    }
    return Math.floor(currentPage);
}

export async function getMeetings(
    query: string = '',
    currentPage: number = 1
): Promise<SacramentMeeting[]> {
    const safePage = sanitizePage(currentPage);
    const searchTerm = `%${query}%`;
    const offset = (safePage - 1) * ITEMS_PER_PAGE;

    const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE
      presiding     ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  ` as MeetingRow[];
    return rows.map((row) => normalizeMeeting(row as MeetingRow));
}

export async function getMeetingsTotalPages(
    query: string = ''
): Promise<number> {
    const searchTerm = `%${query}%`;
    const rows = await sql`
    SELECT COUNT(*) FROM meetings
    WHERE
      presiding     ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
  `;
    return Math.max(1, Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE));
}

export async function getMeetingByDate(date: string): Promise<SacramentMeeting | null> {
    const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE date = ${date}
    LIMIT 1
  ` as MeetingRow[];
    return rows[0] ? normalizeMeeting(rows[0] as MeetingRow) : null;
}

export async function getMeetingById(
    id: number
): Promise<SacramentMeeting | null> {
    const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings WHERE id = ${id}
  ` as MeetingRow[];
    return rows[0] ? normalizeMeeting(rows[0] as MeetingRow) : null;
}

// Mutation stubs — wired to the database in Week 04
export async function addMeeting(
    data: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
    const normalized = normalizeMeeting({
        id: 0,
        ...data,
        announcements: data.announcements ?? [],
    });

    const rows = await sql`
    INSERT INTO meetings (
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    )
    VALUES (
      ${normalized.date},
      ${normalized.meetingType},
      ${normalized.presiding},
      ${normalized.conducting},
      ${normalized.announcements},
      ${JSON.stringify(normalized.openingHymn)}::jsonb,
      ${normalized.openingPrayer},
      ${JSON.stringify(normalized.wardBusiness)}::jsonb,
      ${normalized.stakeBusiness},
      ${JSON.stringify(normalized.sacramentHymn)}::jsonb,
      ${JSON.stringify(normalized.speakers)}::jsonb,
      ${JSON.stringify(normalized.closingHymn)}::jsonb,
      ${normalized.closingPrayer}
    )
    RETURNING
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
  ` as MeetingRow[];

    if (!rows[0]) {
        throw new Error('Failed to insert meeting record.');
    }

    return normalizeMeeting(rows[0]);
}

export async function updateMeeting(
    id: number,
    updates: Partial<SacramentMeeting>
): Promise<SacramentMeeting | null> {
    const existing = await getMeetingById(id);
    if (!existing) {
        return null;
    }

    const merged = normalizeMeeting({
        ...existing,
        ...updates,
        id,
        announcements: updates.announcements ?? existing.announcements ?? [],
    });

    const rows = await sql`
    UPDATE meetings
    SET
      date           = ${merged.date},
      meeting_type   = ${merged.meetingType},
      presiding      = ${merged.presiding},
      conducting     = ${merged.conducting},
      announcements  = ${merged.announcements},
      opening_hymn   = ${JSON.stringify(merged.openingHymn)}::jsonb,
      opening_prayer = ${merged.openingPrayer},
      ward_business  = ${JSON.stringify(merged.wardBusiness)}::jsonb,
      stake_business = ${merged.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(merged.sacramentHymn)}::jsonb,
      speakers       = ${JSON.stringify(merged.speakers)}::jsonb,
      closing_hymn   = ${JSON.stringify(merged.closingHymn)}::jsonb,
      closing_prayer = ${merged.closingPrayer}
    WHERE id = ${id}
    RETURNING
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
  ` as MeetingRow[];

    return rows[0] ? normalizeMeeting(rows[0]) : null;
}

export async function deleteMeeting(id: number): Promise<boolean> {
    const rows = await sql`
    DELETE FROM meetings
    WHERE id = ${id}
    RETURNING id
  ` as Array<{ id: number }>;

    return rows.length > 0;
}
