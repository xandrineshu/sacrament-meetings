// components/NavLinks.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
    const pathname = usePathname();

    const links = [
        { name: 'Home', href: '/' },
        { name: 'All Meetings', href: '/meetings' },
        { name: "Current Sunday", href: '/meetings/current' },
    ];

    return (
        <nav className="flex space-x-4 mb-6 border-b pb-3">
            {links.map((link) => {
                const isActive = pathname === link.href;
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