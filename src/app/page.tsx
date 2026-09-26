'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Scale, 
  ShieldAlert, 
  HelpCircle, 
  CheckSquare, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Eye, 
  ExternalLink,
  Layers,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import DocumentUploader from '@/components/DocumentUploader';
import { useTranslation } from '@/lib/i18n';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'simplify' | 'compare' | 'risks' | 'ask' | 'action' | 'lawyer'>('simplify');
  const { t } = useTranslation();

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-800 text-navy-800 dark:text-navy-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-navy-600 dark:text-navy-400" />
              <span>{t('heroBadge')}</span>
            </div>

            {/* Brand Title & Tagline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                LegalLens
              </h1>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-navy-700 via-navy-800 to-slate-800 dark:from-navy-300 dark:via-white dark:to-slate-300 bg-clip-text text-transparent">
                {t('tagline')}
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t('heroDescription')}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href="#upload-zone"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4" />
                <span>{t('upload')}</span>
              </a>

              <Link
                href="/documents/demo_emp_v2"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t('demo')}</span>
              </Link>
            </div>

            {/* Trust statement */}
            <div className="pt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('disclaimer')}</span>
            </div>
          </div>

          {/* Interactive Document Upload Zone in Hero */}
          <div id="upload-zone" className="max-w-4xl mx-auto mt-12 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{t('quickAnalysis')}</h3>
                <p className="text-xs text-slate-500">{t('quickAnalysisDescription')}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Lock className="w-3.5 h-3.5" />
                <span>{t('confidential')}</span>
              </div>
            </div>

            <DocumentUploader />
          </div>

        </div>
      </section>

      {/* Core Principle: EXPLAIN → VERIFY → ACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-navy-600 dark:text-navy-400">
            {t('trustStandard')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('explainVerifyAct')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('trustDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Explain</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Translates legalese, fine print, and convoluted clauses into plain language across simple, detailed, or professional reading levels.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Verify</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict <strong>No Evidence → No Confident Claim</strong> rule. Click any insight to inspect the source page, verbatim clause, and official statutes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Act</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generates strategic option paths, actionable deadline checklists, and structured Lawyer Briefs to bring directly to your advocate.
            </p>
          </div>
        </div>
      </section>

      {/* Seven Core Pillars Feature Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800">
          
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-navy-400">
              Interactive Capability Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              The 7 Core Superpowers of LegalLens
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Explore how LegalLens tackles each stage of understanding, comparing, auditing, and preparing legal materials.
            </p>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-800">
            {[
              { id: 'simplify', label: '🧠 Simplify Documents' },
              { id: 'compare', label: '⚖️ Compare Contracts' },
              { id: 'risks', label: '🚨 Risk Scanner & Attention Score' },
              { id: 'ask', label: '💬 Evidence-Grounded Q&A' },
              { id: 'action', label: '📋 Action Plan & Deadlines' },
              { id: 'lawyer', label: '👨‍⚖️ Lawyer Prep Brief' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-navy-600 text-white shadow-lg'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="pt-8">
            {activeTab === 'simplify' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Executive & Plain-Language Simplification</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Transform dense legal agreements into crystal-clear executive briefings. Switch seamlessly between Simple (analogies for laypersons), Detailed (section-by-section terms), and Professional (counsel-ready notes).
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Identifies exact parties, core purpose, and duration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Highlights financial terms, fees, and security deposit terms</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Never alters or distorts underlying legal meaning</span>
                    </li>
                  </ul>
                  <Link
                    href="/documents/demo_emp_v1"
                    className="inline-flex items-center gap-2 text-xs font-bold text-navy-300 hover:text-white pt-2"
                  >
                    <span>View Simplify in Demo Document</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-sans text-xs">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-mono text-[11px]">Executive Summary Preview</span>
                    <span className="text-[10px] bg-navy-900 text-navy-200 px-2 py-0.5 rounded">Simple Level</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    "This is an employment contract offering you the role of Senior Systems Architect with ₹28L fixed pay. You can terminate with 30 days notice, and your liability is capped at ₹5 Lakhs."
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block font-medium">Notice Period</span>
                      <span className="font-bold text-white">30 Days (Mutual)</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block font-medium">Liability Cap</span>
                      <span className="font-bold text-emerald-400">₹5,00,000 Max</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compare' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Side-by-Side Contract Comparison</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instantly contrast Version 1 vs Version 2. Detect added clauses, removed safeguards, modified timelines, monetary changes, and dangerous liability escalations.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Detects subtle shifts: 30 days notice → 90 days notice</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Highlights removed liability caps and added liquidated penalties</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Generates "Why It Matters" and strategic questions to ask</span>
                    </li>
                  </ul>
                  <Link
                    href="/compare"
                    className="inline-flex items-center gap-2 text-xs font-bold text-navy-300 hover:text-white pt-2"
                  >
                    <span>Launch Comparison Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-mono text-[11px]">Notice Period Shift</span>
                    <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800">Risk Increased</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Version 1 (Initial)</span>
                      <span className="font-semibold text-emerald-300">30 days mutual notice</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-red-900/60 bg-red-950/20">
                      <span className="text-slate-400 block">Version 2 (Revised)</span>
                      <span className="font-bold text-red-400">90 days employee notice / 0 days employer</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 text-slate-300 text-[11px] border border-slate-800">
                    <strong>Why It Matters:</strong> Triples your exit handover period while giving zero job protection.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'risks' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Risk Scanner & Document Attention Score</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Evaluates one-sided indemnities, automatic renewals, restrictive non-competes, and jurisdiction traps across 6 risk dimensions without declaring things "illegal" without review.
                  </p>
                  <Link
                    href="/risks"
                    className="inline-flex items-center gap-2 text-xs font-bold text-navy-300 hover:text-white pt-2"
                  >
                    <span>View Risk Scanner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400">CRITICAL ATTENTION REQUIRED</span>
                    <span className="text-xs font-mono font-bold bg-red-950 text-red-300 px-2 py-0.5 rounded">88 / 100</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-red-950/30 rounded-lg border border-red-900/60 text-red-200">
                      <span className="font-bold block">24-Month Pan-India Non-Compete</span>
                      <span className="text-[11px] text-red-300/80">Restrains software employment post-termination across India. Review under Sec 27 Contract Act.</span>
                    </div>
                    <div className="p-3 bg-red-950/30 rounded-lg border border-red-900/60 text-red-200">
                      <span className="font-bold block">Uncapped Personal Liability & ₹50L Penalty</span>
                      <span className="text-[11px] text-red-300/80">Liquidated damages for alleged breach of restrictive covenants.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ask' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Evidence-Grounded Legal Q&A</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ask any question about your contract. The system retrieves exact chunks, connects primary statutory authorities (India Code, Supreme Court), states uncertainty honestly, and suggests lawyer questions.
                  </p>
                  <Link
                    href="/ask"
                    className="inline-flex items-center gap-2 text-xs font-bold text-navy-300 hover:text-white pt-2"
                  >
                    <span>Open Ask LegalLens</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg text-slate-200 font-medium">
                    Q: "Can I resign with 30 days notice?"
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2">
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      "Under Section 3 (Page 1), the employee is required to provide ninety (90) days written notice prior to resignation."
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-navy-400 font-mono">
                      <FileText className="w-3 h-3" />
                      <span>Source: Page 1, Section 3</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'action' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Action Navigator & Checklist Generator</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Get an immediate, interactive checklist of documents to collect, timelines to track, and concrete negotiation options with pros and cons.
                  </p>
                  <Link
                    href="/action-plan"
                    className="inline-flex items-center gap-2 text-xs font-bold text-navy-300 hover:text-white pt-2"
                  >
                    <span>View Action Plans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Immediate Checklist</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-200 line-through">Preserve initial Version 1 offer copy</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <div className="w-4 h-4 rounded border border-slate-600" />
                      <span className="text-slate-200">Request counter-proposal for mutual 30-day notice</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <div className="w-4 h-4 rounded border border-slate-600" />
                      <span className="text-slate-200">Export Lawyer Brief for legal review</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lawyer' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Structured Lawyer Brief Preparation</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Save hours of expensive consultation time. LegalLens structures facts, timeline, key clauses, identified issues, missing documents, and strategic questions for your attorney.
                  </p>
                  <Link
                    href="/lawyer-prep"
                    className="inline-flex items-center gap-2 text-xs font-bold text-navy-300 hover:text-white pt-2"
                  >
                    <span>Open Lawyer Prep Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-300">Lawyer Consultation Brief</span>
                    <span className="text-[10px] text-amber-400 font-semibold">Printable & Exportable</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-400">
                    <div><strong>Parties:</strong> Nexus Tech India Pvt Ltd & Rohan Sharma</div>
                    <div><strong>Key Issue:</strong> Enforceability of 24-mo non-compete under Sec 27</div>
                    <div><strong>Priority Question:</strong> "How to propose a mutual 30-day notice without losing offer?"</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Multilingual Support Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-navy-600 dark:text-navy-400 uppercase tracking-wider">{t('multilingual')}</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nativeLanguage')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('multilingualDescription')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">English</span>
            <span className="px-3 py-1.5 rounded-lg bg-navy-50 dark:bg-navy-950 text-xs font-bold text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-800">हिंदी (Hindi)</span>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">తెలుగు (Telugu)</span>
          </div>
        </div>
      </section>

    </div>
  );
}
