'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Rocket,
  ShieldCheck,
  Code2,
  ArrowRight,
  Mail,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

      // Store metadata returned by API (e.g., if application exists)
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

      // If user already exists in DB
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
        // New user — create fresh draft session
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
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Rocket className="h-3.5 w-3.5" />
          HackSmiths Recruitment Cohort
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Join the Core Builder Collective
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Verify your email address to start a new application or access an existing submission.
        </p>
      </div>

      {/* Primary Action Card: Email & OTP Verification */}
      <div className="mx-auto max-w-lg rounded-xl border border-border/60 bg-card p-6 shadow-md mb-12">
        {mode === 'EMAIL' ? (
          /* Step 1 Form: Email Input */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Enter Your Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full gap-2 cursor-pointer">
              {loading ? 'Sending Code...' : 'Send Verification Code'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          /* Step 2 Form: 6-Digit OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMode('EMAIL');
                  setError('');
                  setOtp('');
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change Email
              </button>
              <span className="text-xs text-muted-foreground font-mono">{email}</span>
            </div>

            {appMetadata?.exists && (
              <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-600 dark:text-amber-400">
                An existing application was found for this email. Verify code to continue.
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Enter 6-Digit Verification Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-1 focus:ring-primary"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            {successMsg && (
              <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full gap-2 cursor-pointer">
              {loading ? 'Verifying...' : 'Verify Code & Proceed'}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={() => handleSendOtp()}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary disabled:opacity-50 transition-colors cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend verification code'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border/60 bg-card/50 p-6 shadow-sm">
          <Code2 className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-bold text-foreground text-lg mb-1">Production Projects</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Collaborate on full-stack web and mobile apps using Next.js, Node.js, and cloud backends.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card/50 p-6 shadow-sm">
          <Rocket className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-bold text-foreground text-lg mb-1">Hackathons</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Form teams with senior builders to design, build, and ship winners at major competitions.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card/50 p-6 shadow-sm">
          <ShieldCheck className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-bold text-foreground text-lg mb-1">Peer Mentorship</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Gain direct code reviews, practice technical architecture, and grow your portfolio.
          </p>
        </div>
      </div>
    </div>
  );
}