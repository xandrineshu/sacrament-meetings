// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sacrament Meeting Planner',
  description: 'Manage and plan sacrament meetings efficiently.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#D0E7E6]/30 text-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="grow max-w-5xl w-full mx-auto p-4 md:p-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}