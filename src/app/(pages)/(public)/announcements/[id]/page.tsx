import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15 async params unwrapping
  const { id } = await params;

  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });

  // 404 if announcement does not exist or is marked as draft
  if (!announcement || !announcement.published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono text-xs selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        
        {/* Navigation Back Link */}
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-400 text-xs transition group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Announcements
        </Link>

        {/* Main Bulletin Card */}
        <article className="space-y-6 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-sm">
          <div className="space-y-4 border-b border-zinc-800/80 pb-6">
            
            {/* Category Tag */}
            {announcement.category && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">
                <Tag className="h-3 w-3 text-indigo-400" />
                {announcement.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight leading-snug">
              {announcement.title}
            </h1>

            {/* Publication Date */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1 font-mono">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <span>
                Published on{' '}
                {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Bulletin Content */}
          <div className="pt-2">
            <p className="text-zinc-300 font-sans leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {announcement.content}
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}