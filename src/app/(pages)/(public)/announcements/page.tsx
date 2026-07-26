import { Megaphone, Calendar, Tag } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 30;

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Announcements & Bulletins
        </h1>
        <p className="text-muted-foreground">
          Stay updated with recruitment notices, hackathon schedules, and official club news.
        </p>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl border-border">
          <Megaphone className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-medium text-foreground">No active announcements</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-xl font-bold text-foreground">{item.title}</h2>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>

              {item.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    <Tag className="h-3 w-3" />
                    {item.category}
                  </span>
                </div>
              )}

              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}