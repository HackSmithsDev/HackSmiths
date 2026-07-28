'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function AdminVerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('admin_login_email');
    if (!storedEmail) {
      router.push('/auth/login');
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.removeItem('admin_login_email');
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid 2FA security code.');
      }
    } catch {
      setError('Verification failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12 font-mono text-xs antialiased">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        
        {/* Header Section */}
        <div className="space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-indigo-400 mx-auto shadow-inner">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-100">
            Admin 2FA Verification
          </h1>
          <p className="text-xs text-zinc-400 font-sans">
            A 6-digit verification code was sent to <br />
            <span className="font-semibold text-indigo-400 font-mono">{email}</span>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 flex items-center gap-2 text-left font-sans">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* 2FA Form */}
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <input
              required
              type="text"
              maxLength={6}
              placeholder="000000"
              className="w-48 mx-auto text-center font-mono text-2xl tracking-[0.3em] font-bold rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 text-zinc-100 placeholder:text-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>VERIFYING...</span>
              </>
            ) : (
              <span>VERIFY & ACCESS ADMIN</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="pt-4 border-t border-zinc-800/80">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            onClick={() => router.push('/auth/login')}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>

      </div>
    </div>
  );
}