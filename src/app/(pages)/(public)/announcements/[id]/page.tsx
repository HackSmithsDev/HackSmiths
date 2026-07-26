import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export default async function AnnouncementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const announcement = await prisma.announcement.findUnique({
    where: { id: params.id },
  });

  if (!announcement) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-6 gap-2">
        <Link href="/announcements">
          <ArrowLeft className="h-4 w-4" />
          Back to Announcements
        </Link>
      </Button>

      <article className="space-y-6 rounded-xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm">
        <div className="space-y-3">
          {announcement.category && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <Tag className="h-3.5 w-3.5" />
              {announcement.category}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {announcement.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Published on {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="border-t border-border/40 pt-6">
          <p className="text-foreground/90 leading-relaxed whitespace-pre-line text-base">
            {announcement.content}
          </p>
        </div>
      </article>
    </div>
  );
}