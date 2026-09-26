'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, Terminal, FileCheck } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
          Security & Privacy Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Enterprise-Grade Document Protection
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Legal documents contain some of the most sensitive personal, financial, and trade secret information. LegalLens is built from the ground up with a privacy-by-design paradigm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Zero Model Training Policy</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Your uploaded documents, contracts, and Q&A interactions are never used to train or fine-tune underlying foundation models.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 w-fit">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Prompt Injection Defense</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Uploaded document text is strictly treated as untrusted payload data. Embedded adversarial commands (e.g. "Ignore previous instructions") are neutralized and analyzed solely as document content.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 w-fit">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Automated PII Redaction</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Detects names, phone numbers, email addresses, Aadhaar/PAN markers, and bank details with one-click redaction masking before embedding or indexing.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 w-fit">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Isolated Tenant Workspaces</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Documents remain quarantined in your active workspace session. No document is ever exposed on public index endpoints.
          </p>
        </div>
      </div>
    </div>
  );
}
