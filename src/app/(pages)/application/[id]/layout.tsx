'use client';

import { usePathname, useParams } from 'next/navigation';
import { Sparkles, User, Code2, Globe, CheckCircle2, Check } from 'lucide-react';

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();

  const getStepStatus = (stepPath: string) => {
    if (pathname.includes(stepPath)) return 'active';

    if (
      stepPath === 'step-1' &&
      (pathname.includes('step-2') ||
        pathname.includes('step-3') ||
        pathname.includes('submit'))
    ) {
      return 'completed';
    }
    if (
      stepPath === 'step-2' &&
      (pathname.includes('step-3') || pathname.includes('submit'))
    ) {
      return 'completed';
    }
    if (stepPath === 'step-3' && pathname.includes('submit')) {
      return 'completed';
    }
    return 'pending';
  };

  return (
    /* ADDED min-h-screen bg-zinc-950 text-zinc-100 relative HERE */
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden py-12 px-4 sm:px-6 font-mono text-xs antialiased">
      
      {/* Background Ambient Glows */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Candidate Onboarding Pipeline
          </p>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100">
            Candidate Application Form
          </h1>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              REF_ID: <span className="text-indigo-400 font-semibold">{params?.id || 'GLOBAL'}</span>
            </span>
          </div>
        </div>

        {/* 4-Step Progress Bar */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <StepIndicator
            status={getStepStatus('step-1')}
            stepNum="01"
            label="Basic Info"
            icon={User}
          />
          <StepIndicator
            status={getStepStatus('step-2')}
            stepNum="02"
            label="Tech Stack"
            icon={Code2}
          />
          <StepIndicator
            status={getStepStatus('step-3')}
            stepNum="03"
            label="Motivation & Links"
            icon={Globe}
          />
          <StepIndicator
            status={getStepStatus('submit')}
            stepNum="04"
            label="Confirmation"
            icon={CheckCircle2}
          />
        </div>

        {/* Dynamic Sub-route Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({
  status,
  stepNum,
  label,
  icon: Icon,
}: {
  status: 'active' | 'completed' | 'pending';
  stepNum: string;
  label: string;
  icon: React.ElementType;
}) {
  const styles = {
    active:
      'border-indigo-500/80 bg-indigo-950/60 text-zinc-100 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30',
    completed:
      'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/40',
    pending:
      'border-zinc-800/80 bg-zinc-900/40 text-zinc-500',
  };

  const badgeStyles = {
    active: 'bg-indigo-500 text-zinc-950 font-bold',
    completed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    pending: 'bg-zinc-800 text-zinc-500',
  };

  return (
    <div
      className={`relative flex items-center gap-2.5 p-3 rounded-lg border transition-all duration-200 overflow-hidden ${styles[status]}`}
    >
      {status === 'active' && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
      )}

      <div className={`p-1.5 rounded-md shrink-0 ${badgeStyles[status]}`}>
        {status === 'completed' ? (
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
        ) : (
          <Icon className="h-3.5 w-3.5" />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider font-mono opacity-80 leading-none mb-1">
          STEP {stepNum}
        </p>
        <p className="text-[11px] font-semibold truncate leading-none">
          {label}
        </p>
      </div>
    </div>
  );
}