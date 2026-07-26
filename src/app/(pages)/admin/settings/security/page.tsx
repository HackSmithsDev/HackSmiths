'use client';

import { useState, useEffect } from 'react';
import { Lock, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    OTP_EXPIRATION_SECONDS: '300',
    JWT_EXPIRY_DURATION: '7d',
    RATE_LIMIT_PER_MINUTE: '10',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings/security');
        if (res.ok) {
          const data = await res.json();
          if (data.security) setFormData((prev) => ({ ...prev, ...data.security }));
        }
      } catch (err) {
        console.error('Failed to load security parameters:', err);
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
      const res = await fetch('/api/admin/settings/security', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update security parameters.');

      setStatusMessage({ type: 'success', text: 'Security parameters updated!' });
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
        Loading security configuration...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
        <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
          <Lock className="h-4 w-4 text-indigo-400" /> Security & Session Rules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-400">OTP Expiration (Seconds)</label>
            <input
              type="number"
              value={formData.OTP_EXPIRATION_SECONDS}
              onChange={(e) => setFormData({ ...formData, OTP_EXPIRATION_SECONDS: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">JWT Token Duration</label>
            <input
              type="text"
              value={formData.JWT_EXPIRY_DURATION}
              onChange={(e) => setFormData({ ...formData, JWT_EXPIRY_DURATION: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Rate Limit (Req / Min)</label>
            <input
              type="number"
              value={formData.RATE_LIMIT_PER_MINUTE}
              onChange={(e) => setFormData({ ...formData, RATE_LIMIT_PER_MINUTE: e.target.value })}
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
          {saving ? 'Saving...' : 'Save Security Matrix'}
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