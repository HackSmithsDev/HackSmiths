'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, Home, ArrowLeft } from 'lucide-react';

export default function SubmitSuccessPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center space-y-6">
      <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-zinc-100">Application Successfully Submitted!</h2>
        <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
          Your profile has been saved to our recruit database. Reference ID: <span className="text-emerald-400 font-mono">{params.id}</span>
        </p>
      </div>

      <div className="pt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
        >
          <Home className="h-4 w-4" /> Return to Dashboard
        </button>
      </div>
    </div>
  );
}