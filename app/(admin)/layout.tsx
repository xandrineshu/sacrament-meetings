import { Suspense } from 'react';
import NavLinks from '@/components/NavLinks';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-container">
            <Suspense fallback={<div className="h-12" />}>
                <NavLinks />
            </Suspense>
            {children}
        </div>
    );
}