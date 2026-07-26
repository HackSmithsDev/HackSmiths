'use client';

import { usePathname, useParams } from 'next/navigation';
import { Sparkles, User, FileText, Globe, CheckCircle2, Check } from 'lucide-react';

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();

  const getStepStatus = (stepPath: string) => {
    if (pathname.includes(stepPath)) return 'active';
    
    // Logic for completed stages
    if (stepPath === 'step-1' && (pathname.includes('step-2') || pathname.includes('step-3') || pathname.includes('submit'))) {
      return 'completed';
    }
    if (stepPath === 'step-2' && (pathname.includes('step-3') || pathname.includes('submit'))) {
      return 'completed';
    }
    if (stepPath === 'step-3' && pathname.includes('submit')) {
      return 'completed';
    }
    return 'pending';
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 font-mono text-xs">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Candidate Onboarding Pipeline
        </p>

        <h1 className="text-2xl font-bold text-zinc-100">
          Candidate Application Form
        </h1>

        <p className="text-[11px] text-zinc-500">
          Ref ID: {params.id}
        </p>
      </div>

      {/* 4-Step Progress Bar */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StepIndicator status={getStepStatus('step-1')} stepNum="STEP 1" label="Basic Info" icon={User} />
        <StepIndicator status={getStepStatus('step-2')} stepNum="STEP 2" label="Experience" icon={FileText} />
        <StepIndicator status={getStepStatus('step-3')} stepNum="STEP 3" label="Portfolios" icon={Globe} />
        <StepIndicator status={getStepStatus('submit')} stepNum="STEP 4" label="Confirmation" icon={CheckCircle2} />
      </div>

      {/* Dynamic Sub-route Content */}
      {children}
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
    active: 'border-indigo-500/50 bg-indigo-600/10 text-indigo-400 font-bold',
    completed: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
    pending: 'border-zinc-800 bg-zinc-900/40 text-zinc-500',
  };

  return (
    <div className={`flex items-center gap-2 p-2.5 rounded-lg border ${styles[status]}`}>
      {status === 'completed' ? (
        <Check className="h-4 w-4 shrink-0" />
      ) : (
        <Icon className="h-4 w-4 shrink-0" />
      )}

      <div>
        <p className="text-[10px] leading-tight">{stepNum}</p>
        <p className="text-[11px]">{label}</p>
      </div>
    </div>
  );
}