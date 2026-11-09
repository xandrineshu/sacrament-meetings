// components/MeetingDetail.tsx
import type { SacramentMeeting } from '@/lib/types';

export default function MeetingDetail({ meeting }: { meeting: SacramentMeeting }) {
    return (
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 max-w-3xl mx-auto print:shadow-none print:border-none">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Sacrament Meeting Program</h2>
                    <p className="text-gray-500 mt-1">Date: {meeting.date} | Type: <span className="capitalize">{meeting.meetingType}</span></p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="print:hidden bg-gray-800 hover:bg-gray-900 text-white text-sm px-4 py-2 rounded shadow transition-colors"
                >
                    Print Program
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Presiding:</strong> {meeting.presiding}</p>
                <p className="text-gray-700"><strong>Conducting:</strong> {meeting.conducting}</p>
                <p className="text-gray-700"><strong>Stake Business:</strong> {meeting.stakeBusiness ? 'Yes' : 'No'}</p>
            </div>

            {meeting.announcements && meeting.announcements.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-900 border-b pb-1 mb-2">Announcements</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {meeting.announcements.map((ann, idx) => (
                            <li key={idx}>{ann}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="space-y-4 text-gray-800">
                <div className="border-b pb-2">
                    <p><strong>Opening Hymn:</strong> #{meeting.openingHymn.number} - {meeting.openingHymn.title}</p>
                </div>
                <div className="border-b pb-2">
                    <p><strong>Opening Prayer:</strong> {meeting.openingPrayer}</p>
                </div>

                {meeting.wardBusiness.length > 0 && (
                    <div className="border-b pb-2">
                        <h4 className="font-semibold text-gray-700 mb-1">Ward Business:</h4>
                        <ul className="list-disc list-inside text-gray-600 pl-2">
                            {meeting.wardBusiness.map((biz, idx) => (
                                <li key={idx}>{biz.description}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="border-b pb-2">
                    <p><strong>Sacrament Hymn:</strong> #{meeting.sacramentHymn.number} - {meeting.sacramentHymn.title}</p>
                    <p className="text-xs text-gray-500 mt-1 italic">Administration of the Sacrament</p>
                </div>

                {meeting.speakers.length > 0 && (
                    <div className="border-b pb-2">
                        <h4 className="font-semibold text-gray-700 mb-2">Speakers & Musical Numbers:</h4>
                        <div className="space-y-2 pl-2">
                            {meeting.speakers.map((speaker, idx) => (
                                <div key={idx} className="bg-gray-50 p-2.5 rounded border border-gray-100">
                                    <p className="font-medium">{speaker.name} <span className="text-xs text-gray-500 uppercase">({speaker.type})</span></p>
                                    {speaker.topic && <p className="text-sm text-gray-600">Topic: {speaker.topic}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="border-b pb-2">
                    <p><strong>Closing Hymn:</strong> #{meeting.closingHymn.number} - {meeting.closingHymn.title}</p>
                </div>
                <div>
                    <p><strong>Closing Prayer:</strong> {meeting.closingPrayer}</p>
                </div>
            </div>
        </div>
    );
}