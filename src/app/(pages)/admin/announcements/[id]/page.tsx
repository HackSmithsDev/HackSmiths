'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Trash2,
  Save,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  Megaphone,
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

export default function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);

  // Fetch single announcement details
  const fetchAnnouncement = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/main/announcements/${id}`);
      if (!res.ok) throw new Error('Announcement not found');
      const data = await res.json();
      
      const item: Announcement = data.announcement || data;
      setAnnouncement(item);
      setTitle(item.title);
      setCategory(item.category || 'General');
      setContent(item.content);
      setPublished(item.published);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  // Handle Update (PATCH)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/main/announcements/${id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          content,
          published,
        }),
      });

      if (!res.ok) throw new Error('Failed to update announcement');

      const updated = await res.json();
      setAnnouncement(updated.announcement || updated);
      alert('Announcement updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Error updating announcement');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete (DELETE)
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/main/announcements/${id}/delete`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete announcement');

      router.push('/admin/announcements');
    } catch (err: any) {
      alert(err.message || 'Error deleting announcement');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6 lg:p-8 flex h-64 items-center justify-center gap-2 text-zinc-400 font-mono text-xs">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
        Loading announcement details...
      </main>
    );
  }

  if (!announcement) {
    return (
      <main className="p-6 lg:p-8 space-y-4 max-w-4xl font-mono text-xs">
        <Link
          href="/admin/announcements"
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Feed
        </Link>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-zinc-400">
          Announcement not found or has been removed.
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 lg:p-8 space-y-6 max-w-4xl font-mono text-xs">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/announcements"
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Announcements
        </Link>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/30 px-3 py-1.5 text-rose-400 hover:bg-rose-900/40 transition cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      {/* Main Edit Form */}
      <form
        onSubmit={handleUpdate}
        className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-5 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-indigo-400" />
            <h1 className="text-base font-bold text-zinc-100">
              Edit Announcement #{id.slice(0, 8)}
            </h1>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border ${
              published
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {published ? (
              <>
                <Eye className="h-3 w-3" /> PUBLISHED
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3" /> DRAFT
              </>
            )}
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-zinc-400 font-semibold">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-zinc-100 focus:border-indigo-500 focus:outline-none"
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
              <option value="true">Published</option>
              <option value="false">Draft / Hidden</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-zinc-400 font-semibold">Content Body</label>
          <textarea
            rows={8}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-200 focus:border-indigo-500 focus:outline-none font-sans text-xs leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-[10px] text-zinc-500">
          <div>
            <span>Created: {new Date(announcement.createdAt).toLocaleString()}</span>
            {announcement.updatedAt !== announcement.createdAt && (
              <span className="ml-4">
                Last updated: {new Date(announcement.updatedAt).toLocaleString()}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50 cursor-pointer text-xs"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Changes
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-rose-900/50 bg-zinc-950 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-bold text-zinc-100">Delete Announcement?</h3>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              Are you sure you want to delete <strong className="text-zinc-200">"{title}"</strong>? This operation cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-zinc-800 px-4 py-2 font-semibold text-zinc-300 hover:bg-zinc-900 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-500 transition disabled:opacity-50 cursor-pointer"
              >
                {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}