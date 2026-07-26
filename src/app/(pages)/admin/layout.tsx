'use client';

import AdminNavbar from '@/components/unit/AdminNavbar';
import Footer from '@/components/unit/Footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 antialiased font-sans">
      <AdminNavbar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}