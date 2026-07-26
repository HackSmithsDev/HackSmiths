'use client';

import { useState, useEffect } from 'react';
import { Mail, Save, Loader2, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export default function SmtpSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    SMTP_SENDER_IDENTITY: 'HackSmiths Core <noreply@hacksmiths.io>',
    SMTP_REPLY_TO: 'contact@hacksmiths.io',
    ENABLE_APPLICATION_RECEIVED_EMAIL: 'true',
    ENABLE_STATUS_CHANGE_EMAILS: 'true',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings/smtp');
        if (res.ok) {
          const data = await res.json();
          if (data.smtp) setFormData((prev) => ({ ...prev, ...data.smtp }));
        }
      } catch (err) {
        console.error('Failed to load SMTP settings:', err);
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
      const res = await fetch('/api/admin/settings/smtp', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update SMTP settings.');

      setStatusMessage({ type: 'success', text: 'SMTP Gateway settings saved!' });
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
        Loading SMTP gateway configuration...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
        <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
          <Mail className="h-4 w-4 text-indigo-400" /> SMTP Dispatch Gateway
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-400">Default Sender Identity</label>
            <input
              type="text"
              value={formData.SMTP_SENDER_IDENTITY}
              onChange={(e) => setFormData({ ...formData, SMTP_SENDER_IDENTITY: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Reply-To Email</label>
            <input
              type="email"
              value={formData.SMTP_REPLY_TO}
              onChange={(e) => setFormData({ ...formData, SMTP_REPLY_TO: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900">
            <div>
              <p className="font-semibold text-zinc-200">Application Confirmation Trigger</p>
              <p className="text-[11px] text-zinc-400">Automatically send receipt emails when a new applicant registers.</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  ENABLE_APPLICATION_RECEIVED_EMAIL: p.ENABLE_APPLICATION_RECEIVED_EMAIL === 'true' ? 'false' : 'true',
                }))
              }
              className="cursor-pointer"
            >
              {formData.ENABLE_APPLICATION_RECEIVED_EMAIL === 'true' ? (
                <ToggleRight className="h-7 w-7 text-emerald-400" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-zinc-600" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900">
            <div>
              <p className="font-semibold text-zinc-200">Status Update Notifications</p>
              <p className="text-[11px] text-zinc-400">Send decision emails when application status changes to Approved or Rejected.</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  ENABLE_STATUS_CHANGE_EMAILS: p.ENABLE_STATUS_CHANGE_EMAILS === 'true' ? 'false' : 'true',
                }))
              }
              className="cursor-pointer"
            >
              {formData.ENABLE_STATUS_CHANGE_EMAILS === 'true' ? (
                <ToggleRight className="h-7 w-7 text-emerald-400" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-zinc-600" />
              )}
            </button>
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
          {saving ? 'Saving...' : 'Save SMTP Matrix'}
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