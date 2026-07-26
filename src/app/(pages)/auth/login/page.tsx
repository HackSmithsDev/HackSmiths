'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
        return;
      }

      // If backend identifies the user as an Admin requiring Redis 2FA verification
      if (data.requires2FA) {
        sessionStorage.setItem('admin_login_email', email);
        router.push('/auth/login/admin/verify');
        return;
      }

      // Standard user / applicant login -> Home page
      router.push('/');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-xl border border-border/60 bg-card p-6 shadow-md space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary mx-auto">
            <Terminal className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Sign In</h1>
          <p className="text-xs text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                required
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                required
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full gap-2">
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="pt-2 border-t border-border/40 text-center text-xs text-muted-foreground">
          Don&apos;t have an application yet?{' '}
          <Link href="/application" className="text-primary underline-offset-4 hover:underline">
            Apply now
          </Link>
        </div>
      </div>
    </div>
  );
}