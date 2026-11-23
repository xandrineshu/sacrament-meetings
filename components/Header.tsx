'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => { };

function formatCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function getServerSnapshot(): string {
    return '';
}

export default function Header() {
    const currentDate = useSyncExternalStore(
        emptySubscribe,
        formatCurrentDate,
        getServerSnapshot
    );

    return (
        <header className="bg-blue-700 text-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <div>
                    <h1 className="text-2xl font-bold">Sacrament Meeting Planner</h1>
                    <p className="text-sm text-white">First Ward Agenda Management</p>
                </div>
                {currentDate && (
                    <span className="text-sm font-medium text-white">{currentDate}</span>
                )}
            </div>
        </header>
    );
}