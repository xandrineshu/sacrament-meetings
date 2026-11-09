// lib/meetings-db.ts
import type { SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
    {
        id: 1,
        date: '2026-05-03',
        meetingType: 'regular',
        presiding: 'Bishop Smith',
        conducting: 'Brother Jones',
        openingHymn: { number: 2, title: 'The Spirit of God' },
        openingPrayer: 'Sister Williams',
        wardBusiness: [{ description: 'Sustaining of new Primary president' }],
        stakeBusiness: false,
        sacramentHymn: { number: 169, title: "In Remembrance of Thy Suffering" },
        speakers: [
            { name: 'Sister Brown', topic: 'Faith in Jesus Christ', type: 'speaker' },
            { name: 'Youth Choir', topic: '', type: 'musical-number' }
        ],
        closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
        closingPrayer: 'Brother Davis',
        announcements: ['Ward temple night: May 10']
    },
    {
        id: 2,
        date: '2026-05-10',
        meetingType: 'regular',
        presiding: 'Bishop Smith',
        conducting: 'Brother Miller',
        openingHymn: { number: 85, title: 'How Firm a Foundation' },
        openingPrayer: 'Brother Taylor',
        wardBusiness: [{ description: 'Release of Relief Society counselors with vote of thanks' }],
        stakeBusiness: false,
        sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
        speakers: [
            { name: 'Brother Clark', topic: 'Gratitude and Resilience', type: 'speaker' },
            { name: 'Sister Adams', topic: 'Following the Savior', type: 'speaker' }
        ],
        closingHymn: { number: 152, title: 'God Be With You Till We Meet Again' },
        closingPrayer: 'Sister White',
        announcements: ['Youth service project on Saturday at 9:00 AM']
    },
    {
        id: 3,
        date: '2026-05-17',
        meetingType: 'stake-conference',
        presiding: 'President Johnson',
        conducting: 'President Harris',
        openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
        openingPrayer: 'Brother Martinez',
        wardBusiness: [],
        stakeBusiness: true,
        sacramentHymn: { number: 181, title: 'Jesus of Nazareth, Savior and King' },
        speakers: [
            { name: 'Sister Green', topic: 'Covenant Keeping', type: 'speaker' },
            { name: 'President Johnson', topic: 'Building Up Zion', type: 'speaker' }
        ],
        closingHymn: { number: 27, title: 'Praise to the Man' },
        closingPrayer: 'Sister Lopez',
        announcements: ['No regular ward Sunday School next week due to Stake Conference schedule.']
    }
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
    if (date) return meetings.filter(m => m.date === date);
    return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
    return meetings.find(m => m.id === id) ?? null;
}