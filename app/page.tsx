// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center my-8 md:my-12">
      {/* Hero Container */}
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl bg-[#293681] text-white">
        {/* Background Hero Image */}
        <div className="relative h-72 md:h-96 w-full">
          <Image
            src="/chapel-hero.jpg"
            alt="Sacrament Meeting Chapel Sanctuary"
            fill
            className="object-cover opacity-95"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#293681] via-[#293681]/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative -mt-32 p-8 md:p-12 text-center flex flex-col items-center">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-[#95CCDD] text-[#293681] rounded-full mb-4">
            Sunday Worship Management
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-md">
            Sacrament Meeting Planner
          </h1>
          <p className="text-base md:text-lg max-w-2xl text-[#D0E7E6] mb-8 leading-relaxed drop-shadow">
            Designed for bishoprics, branch leaders, and members to plan agendas, track sacrament programs, and view weekly worship details.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/meetings"
              className="px-6 py-3 rounded-lg font-medium bg-[#293681]/80 hover:bg-[#4274D9] text-white transition-all shadow-md text-center border border-[#95CCDD]/40"
            >
              View All Meetings
            </Link>
            <Link
              href="/meetings/current"
              className="px-6 py-3 rounded-lg font-medium bg-[#D0E7E6] hover:bg-[#95CCDD] text-[#293681] transition-all shadow-md text-center"
            >
              Current Sunday Program
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}