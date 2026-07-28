'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Code2,
  ArrowRight,
  Mail,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Terminal,
  Trophy,
  Loader2,
  Sparkles,
} from 'lucide-react';

type ViewMode = 'EMAIL' | 'OTP';

export default function ApplicationOverviewPage() {
  const router = useRouter();

  // Form State
  const [mode, setMode] = useState<ViewMode>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Status & Metadata State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [appMetadata, setAppMetadata] = useState<{
    exists: boolean;
    applicationId?: string;
    status?: string;
    applicationData?: Record<string, unknown>;
  } | null>(null);

  // Resend Cooldown Timer (60s)
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/members/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send verification code.');
      }

      setAppMetadata({
        exists: data.exists ?? false,
        applicationId: data.applicationId,
        status: data.status,
        applicationData: data.applicationData,
      });

      setSuccessMsg(`Verification code dispatched to ${email}`);
      setMode('OTP');
      setCooldown(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/members/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid or expired OTP code.');
      }

      if (appMetadata?.exists && appMetadata.applicationId) {
        const appId = appMetadata.applicationId;
        sessionStorage.setItem(
          `app_draft_${appId}`,
          JSON.stringify({
            email,
            emailVerified: true,
            ...(appMetadata.applicationData || {}),
          })
        );

        router.push(`/application/${appId}/step-1`);
      } else {
        const newAppId = crypto.randomUUID();
        sessionStorage.setItem(
          `app_draft_${newAppId}`,
          JSON.stringify({
            email,
            emailVerified: true,
          })
        );

        router.push(`/application/${newAppId}/step-1`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 antialiased">
      {/* Background Ambient Glows */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-violet-600/5 blur-[100px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Top Navigation Control */}
        <div className="flex items-center justify-between font-mono text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-400 transition-colors py-1 px-2.5 rounded-md hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>RETURN_TO_HOME</span>
          </Link>

          <span className="text-[11px] text-zinc-500 hidden sm:inline-block font-mono">
            RECRUITMENT_PORTAL // 2026
          </span>
        </div>

        {/* Header Banner */}
        <div className="text-center space-y-4 font-mono">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs text-indigo-300 shadow-sm">
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span>hacksmiths --join // guild entry portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
            Join The Core<span className="text-indigo-400">.</span>
          </h1>

          <p className="font-sans text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Verify your email address to initiate a new recruit application or resume an active submission draft.
          </p>
        </div>

        {/* Form Card */}
        <div className="mx-auto max-w-md rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-sm shadow-2xl font-mono relative overflow-hidden">
          {/* Subtle Accent Edge Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {mode === 'EMAIL' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-2 uppercase tracking-wider">
                  EMAIL_ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    required
                    type="email"
                    placeholder="user@domain.com"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-2 font-sans">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
                    <span>DISPATCHING_CODE...</span>
                  </>
                ) : (
                  <>
                    <span>SEND VERIFICATION CODE</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setMode('EMAIL');
                    setError('');
                    setOtp('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change Email</span>
                </button>
                <span className="text-[11px] text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 font-mono max-w-[180px] truncate">
                  {email}
                </span>
              </div>

              {appMetadata?.exists && (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300 font-sans flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Existing submission draft identified. Verify code to restore your progress.</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-2 uppercase tracking-wider">
                  VERIFICATION_CODE (6-DIGITS)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    required
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2.5 text-xs text-center font-mono tracking-[0.3em] text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:tracking-normal"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              {successMsg && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 flex items-center gap-2 font-sans">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-2 font-sans">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>VERIFY & CONTINUE</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={() => handleSendOtp()}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-400 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Pillars Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs pt-4">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm hover:border-zinc-700/80 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Production Engineering</h3>
            <p className="text-zinc-400 font-sans leading-relaxed text-xs">
              Architect and deliver full-stack applications, scalable backends, and production tooling.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm hover:border-zinc-700/80 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Hackathon Squads</h3>
            <p className="text-zinc-400 font-sans leading-relaxed text-xs">
              Assemble specialized teams, prototype under tight timelines, and represent at top hackathons.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm hover:border-zinc-700/80 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Guild Mentorship</h3>
            <p className="text-zinc-400 font-sans leading-relaxed text-xs">
              Receive direct code reviews, system design critiques, and technical guidance from senior core members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}