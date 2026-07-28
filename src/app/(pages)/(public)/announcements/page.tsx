import { Megaphone, Calendar, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { headers } from 'next/headers';

export const revalidate = 30;

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

async function getAnnouncements(): Promise<Announcement[]> {
  try {
    // Resolve host dynamically for SSR/RSC internal API calls
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/main/announcements?published=true`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.error('Failed to fetch announcements from API:', res.status);
      return [];
    }

    const data = await res.json();
    return data.announcements || [];
  } catch (error) {
    console.error('Error in getAnnouncements:', error);
    return [];
  }
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono text-xs selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header / Nav Breadcrumb */}
        <div className="space-y-4 border-b border-zinc-800/80 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-indigo-400 text-xs transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
                Announcements & Bulletins
              </h1>
              <p className="text-zinc-400 font-sans text-xs sm:text-sm mt-1">
                Recruitment notices, hackathon schedules, and official HackSmiths updates.
              </p>
            </div>
          </div>
        </div>

        {/* Announcements Stream */}
        {announcements.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-xl border-zinc-800 bg-zinc-900/20 text-zinc-500 space-y-3">
            <Megaphone className="h-8 w-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-medium text-zinc-300">No active announcements</p>
            <p className="text-xs text-zinc-500 font-sans">
              Check back soon for recruitment cycles and event schedules.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {announcements.map((item) => (
              <Link
                key={item.id}
                href={`/announcements/${item.id}`}
                className="group block rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-4 backdrop-blur-sm hover:border-indigo-500/50 hover:bg-zinc-900/70 transition"
              >
                {/* Header row: Title + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
                  <h2 className="text-base font-bold text-zinc-100 group-hover:text-indigo-400 transition">
                    {item.title}
                  </h2>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 shrink-0 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                {/* Category Badge */}
                {item.category && (
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">
                      <Tag className="h-3 w-3" />
                      {item.category}
                    </span>
                  </div>
                )}

                {/* Snippet Body */}
                <p className="text-zinc-400 font-sans text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {item.content}
                </p>

                {/* Link Prompt Footer */}
                <div className="pt-2 flex justify-end items-center text-[11px] font-mono text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Read full bulletin</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}