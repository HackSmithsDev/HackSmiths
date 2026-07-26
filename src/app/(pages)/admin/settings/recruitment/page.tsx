'use client';

import { useState, useEffect } from 'react';
import { Users, Save, Loader2, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export default function RecruitmentSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    RECRUITMENT_OPEN: 'true',
    CURRENT_COHORT_NAME: 'Season 2026-27',
    MAX_APPLICATIONS_CAP: '500',
    SUPPORT_EMAIL: 'support@hacksmiths.io',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings/recruitment');
        if (res.ok) {
          const data = await res.json();
          if (data.recruitment) {
            setFormData((prev) => ({ ...prev, ...data.recruitment }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch recruitment settings:', err);
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
      const res = await fetch('/api/admin/settings/recruitment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update recruitment parameters.');

      setStatusMessage({ type: 'success', text: 'Recruitment settings updated!' });
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
        Loading recruitment configuration...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
        <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-400" /> Operational & Recruitment Controls
        </h3>

        <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900">
          <div>
            <p className="font-semibold text-zinc-200">Public Application Portal</p>
            <p className="text-[11px] text-zinc-400">Controls whether non-members can submit membership applications.</p>
          </div>
          <button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, RECRUITMENT_OPEN: p.RECRUITMENT_OPEN === 'true' ? 'false' : 'true' }))}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {formData.RECRUITMENT_OPEN === 'true' ? (
              <ToggleRight className="h-7 w-7 text-emerald-400" />
            ) : (
              <ToggleLeft className="h-7 w-7 text-zinc-600" />
            )}
            <span className={formData.RECRUITMENT_OPEN === 'true' ? 'text-emerald-400' : 'text-zinc-500'}>
              {formData.RECRUITMENT_OPEN === 'true' ? 'OPEN' : 'CLOSED'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-400">Active Cohort Name</label>
            <input
              type="text"
              value={formData.CURRENT_COHORT_NAME}
              onChange={(e) => setFormData({ ...formData, CURRENT_COHORT_NAME: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Max Applications Cap</label>
            <input
              type="number"
              value={formData.MAX_APPLICATIONS_CAP}
              onChange={(e) => setFormData({ ...formData, MAX_APPLICATIONS_CAP: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-zinc-400">Organization Support Email</label>
            <input
              type="email"
              value={formData.SUPPORT_EMAIL}
              onChange={(e) => setFormData({ ...formData, SUPPORT_EMAIL: e.target.value })}
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
          {saving ? 'Saving...' : 'Save Recruitment Matrix'}
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