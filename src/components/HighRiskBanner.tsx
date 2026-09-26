'use client';

import React from 'react';
import Link from 'next/link';
import { AlertOctagon, ArrowRight, PhoneCall, ShieldAlert, FileSearch } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  category?: string;
  lawyerPrepHref?: string;
}

export default function HighRiskBanner({
  title = 'Professional Legal Review Strongly Recommended',
  description = 'This document contains clauses with critical liability exposure, heavy liquidated damages, or severe post-termination restrictions.',
  category = 'Critical Restrictive & Liability Covenants',
  lawyerPrepHref = '/lawyer-prep'
}: Props) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-red-950/80 via-red-900/60 to-slate-900 border-2 border-red-500/50 p-5 text-white shadow-xl shadow-red-950/30">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg flex-shrink-0 mt-0.5">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/30 border border-red-400/40 text-red-200">
                🚨 {category}
              </span>
              <h3 className="font-bold text-base text-white">{title}</h3>
            </div>
            <p className="text-xs text-red-100/90 max-w-2xl leading-relaxed">
              {description} Do not sign or agree to unnegotiated terms without obtaining independent legal counsel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-shrink-0">
          <Link
            href={lawyerPrepHref}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-red-950 hover:bg-red-50 text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
          >
            <FileSearch className="w-4 h-4 text-red-700" />
            <span>Generate Lawyer Brief</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
