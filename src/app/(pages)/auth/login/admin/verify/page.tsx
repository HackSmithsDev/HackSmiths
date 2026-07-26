'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-xl border border-border/60 bg-card p-6 shadow-md space-y-6 text-center">
        <div className="space-y-1.5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary mx-auto">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Admin 2FA Verification</h1>
          <p className="text-xs text-muted-foreground">
            A 6-digit verification code was sent to <br />
            <span className="font-semibold text-foreground font-mono">{email}</span>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2 text-left">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <input
              required
              type="text"
              maxLength={6}
              placeholder="000000"
              className="w-48 mx-auto text-center font-mono text-2xl tracking-widest rounded-md border border-input bg-background py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Verifying...' : 'Verify & Go to Admin Home'}
          </Button>
        </form>

        <div className="pt-2 border-t border-border/40">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-muted-foreground"
            onClick={() => router.push('/auth/login')}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}