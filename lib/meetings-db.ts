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
        meetingType: 'stake',
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
    },
    {
        id: 4,
        date: '2026-05-24',
        meetingType: 'testimony',
        presiding: 'Bishop Smith',
        conducting: 'Brother Jones',
        openingHymn: { number: 134, title: 'I Believe in Christ' },
        openingPrayer: 'Sister Park',
        wardBusiness: [],
        stakeBusiness: false,
        sacramentHymn: { number: 175, title: 'God, Our Father, Hear Us Pray' },
        speakers: [],
        closingHymn: { number: 219, title: 'Because I Have Been Given Much' },
        closingPrayer: 'Brother Alvarez',
        announcements: ['Fast and testimony meeting today.']
    },
    {
        id: 5,
        date: '2026-05-31',
        meetingType: 'special',
        presiding: 'Bishop Smith',
        conducting: 'Brother Miller',
        openingHymn: { number: 107, title: 'The Lord Is My Light' },
        openingPrayer: 'Brother Lee',
        wardBusiness: [{ description: 'High Council visit and ward report' }],
        stakeBusiness: false,
        sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
        speakers: [
            { name: 'Brother Vance', topic: 'Missionary Preparation', type: 'speaker' },
            { name: 'Sister Vance', topic: 'Finding Joy in Service', type: 'speaker' }
        ],
        closingHymn: { number: 252, title: 'Put Your Shoulder to the Wheel' },
        closingPrayer: 'Sister Gomez',
        announcements: ['Special missionary farewell sacrament meeting.']
    }
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
    if (date) return meetings.filter(m => m.date === date);
    return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
    return meetings.find(m => m.id === id) ?? null;
}