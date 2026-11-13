// app/meetings/layout.tsx
import NavLinks from '@/components/NavLinks';
import { Suspense } from 'react';

export default function MeetingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-5xl mx-auto">
            <Suspense fallback={<div className="text-sm text-gray-500 mb-6">Loading navigation...</div>}>
                <NavLinks />
            </Suspense>
            <div className="mt-4">{children}</div>
        </div>
    );
}