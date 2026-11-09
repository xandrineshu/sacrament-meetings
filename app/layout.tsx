// app/layout.tsx
import './globals.css';
import Navbar from '@/components/NavBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#D0E7E6]/30 text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="grow max-w-5xl w-full mx-auto p-4 md:p-6">
          {children}
        </main>
        <footer className="bg-[#293681] text-white text-center py-4 text-sm mt-auto">
          © 2026 Sacrament Meeting Planner. Built with Next.js & Tailwind CSS.
        </footer>
      </body>
    </html>
  );
}