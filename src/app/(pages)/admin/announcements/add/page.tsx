'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2, Megaphone } from 'lucide-react';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);

  // Create Broadcast (POST /api/main/announcements)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/main/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          content,
          published,
        }),
      });

      if (!res.ok) throw new Error('Failed to dispatch announcement');

      router.push('/admin/announcements');
    } catch (err: any) {
      alert(err.message || 'Error publishing announcement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-6 lg:p-8 space-y-6 max-w-4xl font-mono text-xs">
      <Link
        href="/admin/announcements"
        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Feed
      </Link>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-5 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
          <Megaphone className="h-4 w-4 text-indigo-400" />
          <h1 className="text-base font-bold text-zinc-100">
            Dispatch New Announcement
          </h1>
        </div>

        <div className="space-y-1.5">
          <label className="text-zinc-400 font-semibold">Headline Title</label>
          <input
            type="text"
            required
            placeholder="e.g. System Maintenance Scheduled for Weekend"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold">Category Tag</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="General">General</option>
              <option value="Recruitment">Recruitment</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Update">Update</option>
              <option value="Event">Event</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold">Visibility</label>
            <select
              value={published ? 'true' : 'false'}
              onChange={(e) => setPublished(e.target.value === 'true')}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="true">Publish Immediately</option>
              <option value="false">Save as Draft</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-zinc-400 font-semibold">Message Content</label>
          <textarea
            rows={8}
            required
            placeholder="Write full announcement text..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none font-sans text-xs leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <Link
            href="/admin/announcements"
            className="rounded-lg border border-zinc-800 px-4 py-2 font-semibold text-zinc-400 hover:bg-zinc-900 transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50 cursor-pointer text-xs"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Publish Announcement
          </button>
        </div>
      </form>
    </main>
  );
}