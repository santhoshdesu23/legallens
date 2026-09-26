'use client';

import React from 'react';
import { ShieldAlert, BookOpen, AlertTriangle, Scale, CheckCircle2 } from 'lucide-react';

export default function LegalSafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
          Legal Safety & Epistemic Standards
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Our Four-Tier Information Standard
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Legal documents deal with rights, property, and freedom. To prevent hallucinations and unfounded overconfidence, LegalLens strictly separates facts from interpretations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
            1. FACT
          </span>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Verifiable Document Terms</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Information explicitly stated in your uploaded contract (e.g. "90 days notice", "₹28,00,000 CTC"). Tied to exact page and clause numbers.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white">
            2. LEGAL INFORMATION
          </span>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Statutory Rules & Statutes</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Public legislation and official judicial rulings (e.g. Section 27 of the Indian Contract Act, 1872 on restraint of trade).
          </p>
        </div>

        <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-600 text-white">
            3. AI INTERPRETATION
          </span>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reasoned Explanations</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Plain-language explanations of how document terms interact with standard legal practices. Always framed as potential considerations.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-600 text-white">
            4. UNKNOWN
          </span>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Transparent Uncertainty</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Facts not present in the document. LegalLens will never invent missing annexures, facts, or dates.
          </p>
        </div>

      </div>

      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
        <h3 className="font-bold text-base text-amber-950 dark:text-amber-200 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          Full Statutory Disclaimer
        </h3>
        <p className="text-xs text-amber-900 dark:text-amber-300/90 leading-relaxed">
          LegalLens provides general legal information and document-assistance tools. It does not provide legal advice, create an advocate-client relationship, or replace a qualified legal professional. AI-generated information may contain errors and should be independently verified, especially for high-stakes matters.
        </p>
      </div>

    </div>
  );
}
