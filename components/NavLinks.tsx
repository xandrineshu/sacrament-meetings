// components/NavLinks.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavLinks() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isCurrentParam = searchParams.get('current') === 'true';

    const links = [
        { name: 'Home', href: '/' },
        { name: 'All Meetings', href: '/meetings' },
        { name: 'Current Sunday', href: '/meetings/current' },
    ];

    return (
        <nav className="flex space-x-4 mb-6 border-b pb-3">
            {links.map((link) => {
                // Determine if this link is active
                let isActive = false;
                if (link.href === '/meetings') {
                    // All meetings is active if we are on /meetings (and NOT viewing a specific meeting via current)
                    isActive = pathname === '/meetings';
                } else if (link.href === '/meetings/current') {
                    // Current Sunday is active if we are on /meetings/current OR viewing a meeting with ?current=true
                    isActive = pathname === '/meetings/current' || isCurrentParam;
                } else {
                    isActive = pathname === link.href;
                }

                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
}