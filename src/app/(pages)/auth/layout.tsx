'use client';

import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-mono text-xs antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Decorator / Dark Grid Overlay */}
      <div 
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:24px_24px]" 
        aria-hidden="true"
      />

      {/* Header Bar inside Auth Layout */}
      <header className="w-full border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-mono text-xs font-extrabold tracking-tight text-zinc-100 transition-opacity hover:opacity-90"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400 shadow-inner">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <span>
              HACK<span className="text-indigo-400">SMITHS</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors font-mono"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Main Site</span>
          </Link>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-4">
          {children}

          <p className="font-mono text-[11px] text-center text-zinc-600 pt-2">
            © {new Date().getFullYear()} HackSmiths. Secure System Access.
          </p>
        </div>
      </main>
    </div>
  );
}