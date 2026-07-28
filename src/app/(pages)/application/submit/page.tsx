'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Home, Terminal, Copy, Check, Loader2 } from 'lucide-react';

function SubmitSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [refId, setRefId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Try search param first (?id=... or ?recruitmentId=...)
    const queryId = searchParams.get('id') || searchParams.get('recruitmentId');
    if (queryId) {
      setRefId(queryId);
    } else {
      // 2. Fallback check from session storage if applicable
      const lastId = sessionStorage.getItem('last_submitted_id');
      if (lastId) setRefId(lastId);
    }
  }, [searchParams]);

  const handleCopyId = () => {
    if (!refId) return;
    navigator.clipboard.writeText(refId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="rounded-xl border border-emerald-500/30 bg-zinc-900/50 p-8 sm:p-10 text-center space-y-6 backdrop-blur-sm shadow-2xl relative overflow-hidden">
        {/* Glowing Background Accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon Header */}
        <div className="relative inline-flex p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        {/* Text Content */}
        <div className="space-y-3 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400 tracking-widest uppercase">
            STATUS // APPLICATION_RECVD
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight">
            APPLICATION SUCCESSFULLY SUBMITTED
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed font-sans">
            Your technical profile has been indexed into the HackSmiths recruit database. Our leads will review your application shortly.
          </p>
        </div>

        {/* Reference ID Terminal Block */}
        <div className="max-w-md mx-auto rounded-lg bg-zinc-950 border border-zinc-800 p-3.5 flex items-center justify-between text-left font-mono">
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <Terminal className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-zinc-500 text-[11px] shrink-0">REF_ID:</span>
            <span className="text-emerald-400 font-semibold text-xs truncate">
              {refId || 'HS-REC-2026'}
            </span>
          </div>

          <button
            onClick={handleCopyId}
            type="button"
            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            title="Copy Reference ID"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Call to Action */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => router.push('/application')}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition cursor-pointer"
          >
            <span>APPLICATIONS HOME</span>
          </button>

          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>RETURN TO DASHBOARD</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubmitSuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>}>
      <SubmitSuccessContent />
    </Suspense>
  );
}