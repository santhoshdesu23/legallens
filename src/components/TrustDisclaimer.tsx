'use client';

import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface Props {
  variant?: 'banner' | 'card' | 'inline' | 'compact';
  className?: string;
}

export default function TrustDisclaimer({ variant = 'banner', className = '' }: Props) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-xs text-slate-500 ${className}`}>
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
        <span>LegalLens provides legal information & document assistance. It does not replace a qualified advocate.</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 ${className}`}>
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Legal Information Notice: </span>
          LegalLens assists with document understanding and preparation. All AI-generated outputs should be reviewed with a qualified legal professional before acting.
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full py-3 px-4 bg-slate-100 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <ShieldAlert className="w-4 h-4 text-navy-600 dark:text-navy-400 flex-shrink-0" />
          <span>
            <strong>LegalLens Trust Statement:</strong> LegalLens provides legal information and document assistance. It does not provide legal advice, create an advocate-client relationship, or replace a qualified legal professional.
          </span>
        </div>
        <div className="text-slate-500 text-[11px] whitespace-nowrap">
          Core Principle: Explain → Verify → Act
        </div>
      </div>
    </div>
  );
}
