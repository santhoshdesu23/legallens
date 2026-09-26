'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, CheckCircle2, ShieldCheck, FileText, ArrowRight, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-navy-100 dark:bg-navy-900 text-navy-800 dark:text-navy-300">
          About LegalLens
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Empowering Everyday People to Navigate Complex Law
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Legal documents are often deliberately opaque, dense, and intimidating. LegalLens exists to level the playing field through explainability, verification, and actionable empowerment.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          The LegalLens Vision
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          We believe that understanding a contract should not require a 5-year law degree. When individuals and small business owners sign agreements without comprehension, they take on hidden liabilities, unfair restrictive covenants, and asymmetric termination risks.
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
          COMPLEX LEGAL DOCUMENT → UNDERSTANDING → IMPORTANT CLAUSES → RISKS → EVIDENCE → QUESTIONS → POSSIBLE OPTIONS → NEXT STEPS → LAWYER-READY BRIEF
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">What LegalLens IS</h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>An intelligent document comprehension assistant</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>A strict evidence-grounded contract auditor</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>A lawyer consultation preparation studio</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">What LegalLens IS NOT</h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-950 text-red-600 text-center font-bold text-xs flex items-center justify-center flex-shrink-0">✕</span>
              <span>Not a replacement for a licensed advocate</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-950 text-red-600 text-center font-bold text-xs flex items-center justify-center flex-shrink-0">✕</span>
              <span>Not a generic ungrounded hallucinating chatbot</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-950 text-red-600 text-center font-bold text-xs flex items-center justify-center flex-shrink-0">✕</span>
              <span>Does not provide binding legal guarantees</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-slate-200 dark:border-slate-800">
        <Link href="/how-it-works" className="text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline">
          Learn How It Works →
        </Link>
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 text-white font-semibold text-xs">
          <span>Go to Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
