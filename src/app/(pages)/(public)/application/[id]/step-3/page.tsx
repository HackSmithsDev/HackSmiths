'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function Step3Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    githubUrl: '',
    portfolioUrl: '',
    linkedinUrl: '',
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(`app_draft_${params.id}`);
    if (saved) setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get all accumulated state from Session Storage
    const existingDraft = JSON.parse(sessionStorage.getItem(`app_draft_${params.id}`) || '{}');
    const finalPayload = { ...existingDraft, ...formData, recruitmentId: params.id };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (!res.ok) throw new Error('Failed to submit application');

      // Clear draft storage and navigate to Step 4 (Submit page)
      sessionStorage.removeItem(`app_draft_${params.id}`);
      router.push(`/application/${params.id}/submit`);
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
          <label className="text-zinc-400">Portfolio / Personal Site URL</label>
          <input
            type="url"
            value={formData.portfolioUrl}
            onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
            placeholder="https://yourportfolio.dev"
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
          onClick={() => router.push(`/application/${params.id}/step-2`)}
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