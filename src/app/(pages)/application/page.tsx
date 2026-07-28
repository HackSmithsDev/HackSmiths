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

      setSuccessMsg(`Verification code sent to ${email}`);
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Top Navigation Control */}
        <div className="flex items-center justify-between font-mono text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>BACK_TO_HOME</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="text-center space-y-4 font-mono">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs text-indigo-300">
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span>hacksmiths --join // core guild recruitment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
            Join The Core<span className="text-indigo-400">.</span>
          </h1>

          <p className="font-sans text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Verify your email address to start a new application or resume an existing submission.
          </p>
        </div>

        {/* Form Card */}
        <div className="mx-auto max-w-md rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-sm shadow-xl font-mono">
          {mode === 'EMAIL' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  EMAIL_ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    required
                    type="email"
                    placeholder="user@domain.com"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
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
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'SENDING_OTP...' : 'SEND VERIFICATION CODE'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setMode('EMAIL');
                    setError('');
                    setOtp('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change Email
                </button>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
                  {email}
                </span>
              </div>

              {appMetadata?.exists && (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-400 font-sans">
                  Existing application found for this email address. Enter OTP to resume.
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  VERIFICATION_CODE (6-DIGITS)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    required
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2.5 text-xs text-center font-mono tracking-widest text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'VERIFYING...' : 'VERIFY & CONTINUE'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={() => handleSendOtp()}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-400 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Pillars Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs pt-4">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Production Code</h3>
            <p className="text-zinc-400 font-sans leading-relaxed">
              Build full-stack platforms, scalable backends, and user-facing applications.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Hackathons</h3>
            <p className="text-zinc-400 font-sans leading-relaxed">
              Assemble teams, prototype under tight deadlines, and compete nationwide.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Peer Network</h3>
            <p className="text-zinc-400 font-sans leading-relaxed">
              Code reviews, architectural discussions, and direct mentorship from core members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}