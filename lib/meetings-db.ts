import { neon } from '@neondatabase/serverless';
import type { MeetingType, SacramentMeeting } from './types';

const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 5;

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
    void data;
    throw new Error('addMeeting: database implementation coming in Week 04');
}

export async function updateMeeting(
    id: number,
    updates: Partial<SacramentMeeting>
): Promise<SacramentMeeting | null> {
    void id;
    void updates;
    throw new Error('updateMeeting: database implementation coming in Week 04');
}

export async function deleteMeeting(id: number): Promise<boolean> {
    void id;
    throw new Error('deleteMeeting: database implementation coming in Week 04');
}
