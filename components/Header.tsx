// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Header() {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const dateStr = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setCurrentDate(dateStr);
    }, []);

    return (
        <header className="bg-blue-800 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Sacrament Meeting Planner</h1>
                    <p className="text-sm text-blue-200">First Ward Agenda Management</p>
                </div>
                <div className="mt-2 md:mt-0 text-sm text-blue-100 font-medium">
                    {currentDate || 'Loading date...'}
                </div>
            </div>
        </header>
    );
}