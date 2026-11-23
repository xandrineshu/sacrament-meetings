'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import type { MeetingFormState } from '@/lib/actions';
import type { SacramentMeeting } from '@/lib/types';

type MeetingAction = (
    prevState: MeetingFormState,
    formData: FormData
) => Promise<MeetingFormState>;

const initialState: MeetingFormState = {};

function formatSpeakersForInput(meeting?: SacramentMeeting): string {
    if (!meeting?.speakers?.length) return '';
    return meeting.speakers
        .map((item) => `${item.name} | ${item.topic} | ${item.type}`)
        .join('\n');
}

function formatWardBusinessForInput(meeting?: SacramentMeeting): string {
    if (!meeting?.wardBusiness?.length) return '';
    return meeting.wardBusiness.map((item) => item.description).join('\n');
}

function formatAnnouncementsForInput(meeting?: SacramentMeeting): string {
    if (!meeting?.announcements?.length) return '';
    return meeting.announcements.join('\n');
}

export default function MeetingForm({
    action,
    meeting,
    submitLabel = 'Save Meeting',
}: {
    action: MeetingAction;
    meeting?: SacramentMeeting;
    submitLabel?: string;
}) {
    const [state, formAction, isPending] = useActionState(action, initialState);
    const [date, setDate] = useState(meeting?.date ?? '');

    return (
        <form action={formAction} noValidate className="space-y-6">
            {state.message && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-md border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-800"
                >
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Meeting Date
                    </label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        aria-describedby="date-error"
                        aria-invalid={Boolean(state.errors?.date?.length)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div id="date-error" aria-live="polite" className="mt-1 min-h-5 text-sm text-red-700">
                        {state.errors?.date?.[0] ?? ''}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="meetingType"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Meeting Type
                    </label>
                    <select
                        id="meetingType"
                        name="meetingType"
                        defaultValue={meeting?.meetingType ?? 'regular'}
                        aria-describedby="meetingType-error"
                        aria-invalid={Boolean(state.errors?.meetingType?.length)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="regular">Regular</option>
                        <option value="testimony">Fast &amp; Testimony</option>
                        <option value="stake">Stake Conference</option>
                        <option value="general">General Conference</option>
                        <option value="special">Special</option>
                    </select>
                    <div
                        id="meetingType-error"
                        aria-live="polite"
                        className="mt-1 min-h-5 text-sm text-red-700"
                    >
                        {state.errors?.meetingType?.[0] ?? ''}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="presiding"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Presiding
                    </label>
                    <input
                        id="presiding"
                        name="presiding"
                        type="text"
                        defaultValue={meeting?.presiding ?? ''}
                        aria-describedby="presiding-error"
                        aria-invalid={Boolean(state.errors?.presiding?.length)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div
                        id="presiding-error"
                        aria-live="polite"
                        className="mt-1 min-h-5 text-sm text-red-700"
                    >
                        {state.errors?.presiding?.[0] ?? ''}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="conducting"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Conducting
                    </label>
                    <input
                        id="conducting"
                        name="conducting"
                        type="text"
                        defaultValue={meeting?.conducting ?? ''}
                        aria-describedby="conducting-error"
                        aria-invalid={Boolean(state.errors?.conducting?.length)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div
                        id="conducting-error"
                        aria-live="polite"
                        className="mt-1 min-h-5 text-sm text-red-700"
                    >
                        {state.errors?.conducting?.[0] ?? ''}
                    </div>
                </div>
            </div>

            <fieldset className="space-y-4 rounded-md border border-sky-200/80 bg-white/60 p-4">
                <legend className="px-1 text-sm font-semibold text-gray-900">
                    Opening Hymn &amp; Prayer
                </legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="openingHymnNumber"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Opening Hymn Number
                        </label>
                        <input
                            id="openingHymnNumber"
                            name="openingHymnNumber"
                            type="number"
                            min={0}
                            defaultValue={meeting?.openingHymn?.number ?? 0}
                            aria-describedby="openingHymnNumber-error"
                            aria-invalid={Boolean(state.errors?.openingHymnNumber?.length)}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div
                            id="openingHymnNumber-error"
                            aria-live="polite"
                            className="mt-1 min-h-5 text-sm text-red-700"
                        >
                            {state.errors?.openingHymnNumber?.[0] ?? ''}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="openingHymnTitle"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Opening Hymn Title
                        </label>
                        <input
                            id="openingHymnTitle"
                            name="openingHymnTitle"
                            type="text"
                            defaultValue={meeting?.openingHymn?.title ?? ''}
                            aria-describedby="openingHymnTitle-error"
                            aria-invalid={Boolean(state.errors?.openingHymnTitle?.length)}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div
                            id="openingHymnTitle-error"
                            aria-live="polite"
                            className="mt-1 min-h-5 text-sm text-red-700"
                        >
                            {state.errors?.openingHymnTitle?.[0] ?? ''}
                        </div>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="openingPrayer"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Opening Prayer
                    </label>
                    <input
                        id="openingPrayer"
                        name="openingPrayer"
                        type="text"
                        defaultValue={meeting?.openingPrayer ?? ''}
                        aria-describedby="openingPrayer-error"
                        aria-invalid={Boolean(state.errors?.openingPrayer?.length)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div
                        id="openingPrayer-error"
                        aria-live="polite"
                        className="mt-1 min-h-5 text-sm text-red-700"
                    >
                        {state.errors?.openingPrayer?.[0] ?? ''}
                    </div>
                </div>
            </fieldset>

            <fieldset className="space-y-4 rounded-md border border-sky-200/80 bg-white/60 p-4">
                <legend className="px-1 text-sm font-semibold text-gray-900">
                    Sacrament Hymn
                </legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="sacramentHymnNumber"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Sacrament Hymn Number
                        </label>
                        <input
                            id="sacramentHymnNumber"
                            name="sacramentHymnNumber"
                            type="number"
                            min={0}
                            defaultValue={meeting?.sacramentHymn?.number ?? 0}
                            aria-describedby="sacramentHymnNumber-error"
                            aria-invalid={Boolean(state.errors?.sacramentHymnNumber?.length)}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div
                            id="sacramentHymnNumber-error"
                            aria-live="polite"
                            className="mt-1 min-h-5 text-sm text-red-700"
                        >
                            {state.errors?.sacramentHymnNumber?.[0] ?? ''}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="sacramentHymnTitle"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Sacrament Hymn Title
                        </label>
                        <input
                            id="sacramentHymnTitle"
                            name="sacramentHymnTitle"
                            type="text"
                            defaultValue={meeting?.sacramentHymn?.title ?? ''}
                            aria-describedby="sacramentHymnTitle-error"
                            aria-invalid={Boolean(state.errors?.sacramentHymnTitle?.length)}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div
                            id="sacramentHymnTitle-error"
                            aria-live="polite"
                            className="mt-1 min-h-5 text-sm text-red-700"
                        >
                            {state.errors?.sacramentHymnTitle?.[0] ?? ''}
                        </div>
                    </div>
                </div>
            </fieldset>

            <div>
                <label
                    htmlFor="speakers"
                    className="block text-sm font-medium text-gray-900"
                >
                    Speakers &amp; Musical Numbers (one per line: Name | Topic | speaker or musical-number)
                </label>
                <textarea
                    id="speakers"
                    name="speakers"
                    rows={3}
                    defaultValue={formatSpeakersForInput(meeting)}
                    aria-describedby="speakers-help speakers-error"
                    aria-invalid={Boolean(state.errors?.speakersText?.length)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <p id="speakers-help" className="mt-1 text-xs text-gray-600">
                    Example: Brother Smith | Faith in Christ | speaker
                </p>
                <div
                    id="speakers-error"
                    aria-live="polite"
                    className="mt-1 min-h-5 text-sm text-red-700"
                >
                    {state.errors?.speakersText?.[0] ?? ''}
                </div>
            </div>

            <fieldset className="space-y-4 rounded-md border border-sky-200/80 bg-white/60 p-4">
                <legend className="px-1 text-sm font-semibold text-gray-900">
                    Closing Hymn &amp; Prayer
                </legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="closingHymnNumber"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Closing Hymn Number
                        </label>
                        <input
                            id="closingHymnNumber"
                            name="closingHymnNumber"
                            type="number"
                            min={0}
                            defaultValue={meeting?.closingHymn?.number ?? 0}
                            aria-describedby="closingHymnNumber-error"
                            aria-invalid={Boolean(state.errors?.closingHymnNumber?.length)}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div
                            id="closingHymnNumber-error"
                            aria-live="polite"
                            className="mt-1 min-h-5 text-sm text-red-700"
                        >
                            {state.errors?.closingHymnNumber?.[0] ?? ''}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="closingHymnTitle"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Closing Hymn Title
                        </label>
                        <input
                            id="closingHymnTitle"
                            name="closingHymnTitle"
                            type="text"
                            defaultValue={meeting?.closingHymn?.title ?? ''}
                            aria-describedby="closingHymnTitle-error"
                            aria-invalid={Boolean(state.errors?.closingHymnTitle?.length)}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div
                            id="closingHymnTitle-error"
                            aria-live="polite"
                            className="mt-1 min-h-5 text-sm text-red-700"
                        >
                            {state.errors?.closingHymnTitle?.[0] ?? ''}
                        </div>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="closingPrayer"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Closing Prayer
                    </label>
                    <input
                        id="closingPrayer"
                        name="closingPrayer"
                        type="text"
                        defaultValue={meeting?.closingPrayer ?? ''}
                        aria-describedby="closingPrayer-error"
                        aria-invalid={Boolean(state.errors?.closingPrayer?.length)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div
                        id="closingPrayer-error"
                        aria-live="polite"
                        className="mt-1 min-h-5 text-sm text-red-700"
                    >
                        {state.errors?.closingPrayer?.[0] ?? ''}
                    </div>
                </div>
            </fieldset>

            <div>
                <label
                    htmlFor="announcements"
                    className="block text-sm font-medium text-gray-900"
                >
                    Announcements (one per line)
                </label>
                <textarea
                    id="announcements"
                    name="announcements"
                    rows={3}
                    defaultValue={formatAnnouncementsForInput(meeting)}
                    aria-describedby="announcements-error"
                    aria-invalid={Boolean(state.errors?.announcementsText?.length)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div
                    id="announcements-error"
                    aria-live="polite"
                    className="mt-1 min-h-5 text-sm text-red-700"
                >
                    {state.errors?.announcementsText?.[0] ?? ''}
                </div>
            </div>

            <div>
                <label
                    htmlFor="wardBusiness"
                    className="block text-sm font-medium text-gray-900"
                >
                    Ward Business (one item per line)
                </label>
                <textarea
                    id="wardBusiness"
                    name="wardBusiness"
                    rows={2}
                    defaultValue={formatWardBusinessForInput(meeting)}
                    aria-describedby="wardBusiness-error"
                    aria-invalid={Boolean(state.errors?.wardBusinessText?.length)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div
                    id="wardBusiness-error"
                    aria-live="polite"
                    className="mt-1 min-h-5 text-sm text-red-700"
                >
                    {state.errors?.wardBusinessText?.[0] ?? ''}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <input
                    id="stakeBusiness"
                    name="stakeBusiness"
                    type="checkbox"
                    defaultChecked={meeting?.stakeBusiness ?? false}
                    aria-describedby="stakeBusiness-error"
                    aria-invalid={Boolean(state.errors?.stakeBusiness?.length)}
                    className="h-4 w-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-2 focus:ring-blue-600"
                />
                <label
                    htmlFor="stakeBusiness"
                    className="text-sm font-medium text-gray-900"
                >
                    Stake Business to be presented
                </label>
                <div
                    id="stakeBusiness-error"
                    aria-live="polite"
                    className="text-sm text-red-700"
                >
                    {state.errors?.stakeBusiness?.[0] ?? ''}
                </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : submitLabel}
                </button>
                <Link
                    href="/meetings"
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}