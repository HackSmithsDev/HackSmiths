'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Globe, ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';

export default function Step3Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    whyJoin: '',
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
    setError('');

    // Save step 3 fields to local draft state before merging
    const existingDraft = JSON.parse(sessionStorage.getItem(`app_draft_${id}`) || '{}');
    const finalPayload = { ...existingDraft, ...formData, recruitmentId: id };

    try {
      const res = await fetch('/api/members/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (!res.ok) throw new Error('Failed to submit application. Please try again.');

      // Persist reference ID for fallback and clear active draft
      sessionStorage.setItem('last_submitted_id', id);
      sessionStorage.removeItem(`app_draft_${id}`);

      // Route to global submission page with query param
      router.push(`/application/submit?id=${id}`);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Error submitting application.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl">
        {/* Section Header */}
        <div className="border-b border-zinc-800/80 pb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-400" />
            03 // MOTIVATION & PORTFOLIOS
          </h2>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:inline-block">
            Step 3 of 3
          </span>
        </div>

        {/* Why Join Statement */}
        <div className="space-y-2">
          <label className="block font-bold text-zinc-300 tracking-wider">
            WHY_DO_YOU_WANT_TO_JOIN *
          </label>
          <textarea
            required
            rows={4}
            placeholder="What motivates you to join HackSmiths, and what do you hope to achieve or build with the guild?"
            value={formData.whyJoin}
            onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-sans leading-relaxed"
          />
        </div>

        {/* Portfolios Section Header */}
        <div className="pt-2 border-t border-zinc-800/60 space-y-4">
          <label className="block font-bold text-zinc-300 tracking-wider">
            PROFILES_AND_HANDLES
          </label>

          {/* GitHub URL */}
          <div className="space-y-2">
            <label className="block font-bold text-zinc-400 tracking-wider flex items-center gap-2">
              <FaGithub className="h-3.5 w-3.5 text-zinc-400" />
              GITHUB_PROFILE_URL
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
            />
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-2">
            <label className="block font-bold text-zinc-400 tracking-wider flex items-center gap-2">
              <FaLinkedin className="h-3.5 w-3.5 text-zinc-400" />
              LINKEDIN_PROFILE_URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Submission Notice */}
        <div className="rounded-lg bg-zinc-950 border border-zinc-800/80 p-4 text-[11px] font-sans text-zinc-400 leading-relaxed">
          <p className="font-mono text-xs text-indigo-400 font-semibold mb-1">
            FINAL_VERIFICATION
          </p>
          By clicking submit, your application payload will be dispatched directly to the HackSmiths core guild team for review.
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-2 font-sans">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Navigation & Submit CTA Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            // Persist current Step 3 input before navigating back
            const existing = JSON.parse(sessionStorage.getItem(`app_draft_${id}`) || '{}');
            sessionStorage.setItem(`app_draft_${id}`, JSON.stringify({ ...existing, ...formData }));
            router.push(`/application/${id}/step-2`);
          }}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>PREVIOUS STEP</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>SUBMITTING_APPLICATION...</span>
            </>
          ) : (
            <>
              <span>SUBMIT APPLICATION</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}