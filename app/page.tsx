// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h2 className="text-4xl font-extrabold text-blue-900 mb-4">
        Welcome to the Sacrament Meeting Planner
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Designed for bishoprics, branch leaders, and members to plan agendas, track sacrament programs, and view weekly worship details.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/meetings"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow transition-colors"
        >
          View All Meetings
        </Link>
        <Link
          href="/meetings/current"
          className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg shadow transition-colors"
        >
          Current Sunday Program
        </Link>
      </div>
    </div>
  );
}