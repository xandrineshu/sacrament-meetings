// components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
    return (
        <header className="bg-[#293681] text-white shadow-md">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-wide">Sacrament Meeting Planner</h1>
                    <p className="text-xs text-[#95CCDD]">First Ward Agenda Management</p>
                </div>
                <nav className="flex gap-4">
                    <Link href="/" className="hover:text-[#95CCDD] transition-colors">Home</Link>
                    <Link href="/meetings" className="hover:text-[#95CCDD] transition-colors">Meetings</Link>
                    <Link href="/meetings/current" className="hover:text-[#95CCDD] transition-colors">Current Sunday</Link>
                </nav>
            </div>
        </header>
    );
}