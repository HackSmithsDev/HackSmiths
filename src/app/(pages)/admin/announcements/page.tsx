'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Plus,
  Loader2,
  RefreshCw,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch announcements list
  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/main/announcements');
      if (!res.ok) throw new Error('Failed to load announcements');
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : data.announcements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <main className="p-6 lg:p-8 space-y-6 max-w-7xl font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-indigo-400" />
            Broadcasting & Announcements
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Overview of dispatched broadcasts and system announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAnnouncements}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
            title="Refresh Feed"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Updated link pointing to /add */}
          <Link
            href="/admin/announcements/add"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 transition"
          >
            <Plus className="h-4 w-4" />
            New Announcement
          </Link>
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center gap-2 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          Loading announcements...
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-zinc-500">
          No announcements found.
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <Link
              key={item.id}
              href={`/admin/announcements/${item.id}`}
              className="group block rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2 backdrop-blur-sm hover:border-zinc-700 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-100 group-hover:text-indigo-400 transition text-sm">
                    {item.title}
                  </span>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 border border-zinc-700 uppercase">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border ${
                      item.published
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {item.published ? (
                      <>
                        <Eye className="h-3 w-3" /> PUBLISHED
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" /> DRAFT
                      </>
                    )}
                  </span>
                  <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition" />
                </div>
              </div>

              <p className="text-zinc-400 font-sans text-xs leading-relaxed line-clamp-2">
                {item.content}
              </p>

              <div className="pt-2 border-t border-zinc-800/60 text-[10px] text-zinc-500">
                Created: {new Date(item.createdAt).toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}