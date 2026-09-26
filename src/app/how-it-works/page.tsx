'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Upload, 
  FileSearch, 
  BrainCircuit, 
  Database, 
  ShieldAlert, 
  CheckCheck, 
  Rocket, 
  ArrowRight 
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: 1,
      title: '1. Secure Upload & Ingestion',
      icon: Upload,
      desc: 'You upload PDF, DOCX, or text contracts. The system ingests streams, validates file types, and verifies formatting.'
    },
    {
      num: 2,
      title: '2. Page-Aware Boundary Extraction',
      icon: FileSearch,
      desc: 'Preserves exact page numbers, article headings, clause hierarchies, and numerical tables without fragmenting legal meaning.'
    },
    {
      num: 3,
      title: '3. PII & Privacy Sanitization',
      icon: Database,
      desc: 'Scans for sensitive Aadhaar/PAN, phones, emails, and financial markers, allowing you to redact before indexing.'
    },
    {
      num: 4,
      title: '4. Page-Aware Document Retrieval',
      icon: BrainCircuit,
      desc: 'Uploaded text is split into page-aware chunks and matched using exact terms, section names, clause names, and numerical terms.'
    },
    {
      num: 5,
      title: '5. Multi-Stage AI Reasoning Audit',
      icon: ShieldAlert,
      desc: '12 specialized prompt modules classify document types, extract clauses, evaluate risks, and calculate Document Attention Scores.'
    },
    {
      num: 6,
      title: '6. Strict Citation & Source Verification',
      icon: CheckCheck,
      desc: 'Separates document facts from interpretation and checks extracted evidence against the uploaded document text.'
    },
    {
      num: 7,
      title: '7. Actionable Execution & Lawyer Brief',
      icon: Rocket,
      desc: 'Produces concrete checklists, extracted timeline dates, side-by-side contract diffs, and structured briefing reports for legal counsel.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-navy-100 dark:bg-navy-900 text-navy-800 dark:text-navy-300">
          Under the Hood
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          How LegalLens Works
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          A transparent, evidence-first pipeline designed to make legal documents understandable, verifiable, and actionable.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div 
              key={step.num}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start gap-4"
            >
              <div className="p-3 rounded-xl bg-navy-50 dark:bg-navy-950 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-800 flex-shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base">Ready to test the pipeline?</h4>
          <p className="text-xs text-navy-200">Try one of our preloaded synthetic contract scenarios.</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-navy-950 font-bold text-xs shadow hover:bg-slate-100"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
