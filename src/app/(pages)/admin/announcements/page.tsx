'use client';

import { useState } from 'react';
import { Megaphone, Plus, Trash2, Edit3, Send, CheckCircle2 } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  target: 'ALL' | 'MEMBERS' | 'PUBLIC';
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'ann-1',
      title: 'HackSmiths Season 3 Submissions Open',
      content: 'Official applications for Season 3 are now active.',
      publishedAt: new Date().toISOString(),
      target: 'PUBLIC',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState<'ALL' | 'MEMBERS' | 'PUBLIC'>('ALL');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      publishedAt: new Date().toISOString(),
      target,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle('');
    setContent('');
    setShowModal(false);
  };

  return (
    <main className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-indigo-400" />
            Broadcasting & Announcements
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Dispatch updates across public landing nodes or registered member feeds.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-indigo-500 transition"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </button>
      </div>

      {/* List */}
      <div className="space-y-3 font-mono text-xs">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400 text-sm">{item.title}</span>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 border border-zinc-700 uppercase">
                {item.target}
              </span>
            </div>
            <p className="text-zinc-300 font-sans text-xs">{item.content}</p>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px] text-zinc-500">
              <span>Dispatched: {new Date(item.publishedAt).toLocaleString()}</span>
              <button
                onClick={() => setAnnouncements(announcements.filter((a) => a.id !== item.id))}
                className="text-rose-400 hover:text-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4 font-mono text-xs"
          >
            <h3 className="text-sm font-bold text-zinc-100">Broadcast New Update</h3>

            <div className="space-y-1">
              <label className="text-zinc-400">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement headline..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Audience Scope</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as any)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="ALL">ALL USERS</option>
                <option value="PUBLIC">PUBLIC ONLY</option>
                <option value="MEMBERS">MEMBERS ONLY</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Content</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write message payload..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-zinc-800 px-3 py-1.5 text-zinc-400 hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-500"
              >
                Dispatch
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}