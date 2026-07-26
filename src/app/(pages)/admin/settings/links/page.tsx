'use client';

import { useState, useEffect } from 'react';
import { Globe, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LinksSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    LINK_GITHUB_ORG: 'https://github.com/hacksmiths',
    LINK_DISCORD_INVITE: 'https://discord.gg/hacksmiths',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings/links');
        if (res.ok) {
          const data = await res.json();
          if (data.links) setFormData((prev) => ({ ...prev, ...data.links }));
        }
      } catch (err) {
        console.error('Failed to load links settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/settings/links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update community links.');

      setStatusMessage({ type: 'success', text: 'Community links updated!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 py-6">
        <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
        Loading social & community links...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
        <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
          <Globe className="h-4 w-4 text-indigo-400" /> External & Community Handles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-400">GitHub Organization URL</label>
            <input
              type="text"
              value={formData.LINK_GITHUB_ORG}
              onChange={(e) => setFormData({ ...formData, LINK_GITHUB_ORG: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Discord Community Invite</label>
            <input
              type="text"
              value={formData.LINK_DISCORD_INVITE}
              onChange={(e) => setFormData({ ...formData, LINK_DISCORD_INVITE: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition cursor-pointer"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Links Matrix'}
        </button>

        {statusMessage && (
          <span className={`flex items-center gap-1.5 text-xs ${statusMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {statusMessage.text}
          </span>
        )}
      </div>
    </form>
  );
}