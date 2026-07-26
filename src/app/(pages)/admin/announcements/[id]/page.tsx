'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Megaphone, CheckCircle2 } from 'lucide-react';

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [title, setTitle] = useState('HackSmiths Season 3 Submissions Open');
  const [target, setTarget] = useState<'ALL' | 'MEMBERS' | 'PUBLIC'>('PUBLIC');
  const [content, setContent] = useState(
    'Official applications for Season 3 are now active. Submit your team details before the deadline.'
  );
  const [saved, setSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      router.push('/admin/announcements');
    }
  };

  return (
    <main className="p-6 lg:p-8 space-y-6 max-w-4xl">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/announcements"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Announcements
          </Link>
          <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-indigo-400" />
            Edit Announcement <span className="text-zinc-500 text-xs">[{id}]</span>
          </h1>
        </div>

        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/20 px-3 py-2 font-mono text-xs font-semibold text-rose-400 hover:bg-rose-900/40 transition"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleUpdate} className="space-y-5 font-mono text-xs">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 backdrop-blur-sm">
          <div className="space-y-1">
            <label className="text-zinc-400">Headline Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Audience Scope</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as any)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ALL">ALL USERS</option>
              <option value="PUBLIC">PUBLIC ONLY</option>
              <option value="MEMBERS">MEMBERS ONLY</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Message Payload</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-500 transition"
          >
            <Save className="h-4 w-4" />
            Update Broadcast
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-emerald-400 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Changes saved!
            </span>
          )}
        </div>
      </form>
    </main>
  );
}