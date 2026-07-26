'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Globe, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function Step3Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    githubUrl: '',
    linkedinUrl: '',
  });

  useEffect(() => {
    if (!id) return;
    const saved = sessionStorage.getItem(`app_draft_${id}`);
    if (saved) setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get all accumulated state from Session Storage
    const existingDraft = JSON.parse(sessionStorage.getItem(`app_draft_${id}`) || '{}');
    const finalPayload = { ...existingDraft, ...formData, recruitmentId: id };

    try {
      const res = await fetch('/api/members/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (!res.ok) throw new Error('Failed to submit application');

      // Clear draft storage and navigate to Submit/Success page
      sessionStorage.removeItem(`app_draft_${id}`);
      router.push(`/application/${id}/submit`);
    } catch (err) {
      console.error(err);
      alert('Error submitting application. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h2 className="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-2.5 flex items-center gap-2">
          <Globe className="h-4 w-4 text-indigo-400" />
          3. Portfolios & Handles
        </h2>

        <div className="space-y-1">
          <label className="text-zinc-400">GitHub Profile URL</label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="https://github.com/username"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-zinc-400">LinkedIn Profile URL</label>
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/username"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(`/application/${id}/step-2`)}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 font-semibold text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" /> Previous Step
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              Submit Application <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}