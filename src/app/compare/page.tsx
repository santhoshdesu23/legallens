'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Scale, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  HelpCircle, 
  Loader2, 
  Sparkles,
  ArrowRightLeft,
  Search,
  ExternalLink
} from 'lucide-react';
import { LegalDocument, ComparisonResult, ComparisonDiffItem } from '@/lib/types';
import EvidenceModal from '@/components/EvidenceModal';
import { useTranslation } from '@/lib/i18n';

function CompareContent() {
  const searchParams = useSearchParams();
  const initialDocA = searchParams.get('docA') || '';
  const initialDocB = searchParams.get('docB') || '';
  const { language } = useTranslation();

  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [docAId, setDocAId] = useState(initialDocA);
  const [docBId, setDocBId] = useState(initialDocB);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Evidence modal state
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [citations, setCitations] = useState<any[]>([]);

  useEffect(() => {
    fetchDocsAndCompare();
  }, []);

  const fetchDocsAndCompare = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data.documents || []);

      if (data.documents && data.documents.length >= 2) {
        const uploaded = data.documents.filter((doc: LegalDocument) => !doc.isSyntheticDemo);
        const available = uploaded.length >= 2 ? uploaded : data.documents;
        const docA = initialDocA || available[0]?.id;
        const docB = initialDocB || available[1]?.id;
        setDocAId(docA);
        setDocBId(docB);
        runComparison(docA, docB);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const runComparison = async (aId: string, bId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docAId: aId, docBId: bId, language })
      });
      const data = await res.json();
      if (data.comparison) {
        setComparison(data.comparison);
      }
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = docAId;
    setDocAId(docBId);
    setDocBId(temp);
    runComparison(docBId, temp);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Comparative Contract Audit
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
              Diff & Risk Shift Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare clauses, obligations, risks, and changes between any two uploaded documents.
          </p>
        </div>

        {/* 1-Click Demo Scenarios */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDocAId('demo_emp_v1');
              setDocBId('demo_emp_v2');
              runComparison('demo_emp_v1', 'demo_emp_v2');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-navy-50 dark:bg-navy-950 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-800 text-xs font-bold hover:bg-navy-100 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Load Employment v1 vs v2 Demo</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
          
          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Document A (Baseline)</label>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-navy-500"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-0">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
              title="Swap documents"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Document B (Modified / Proposed)</label>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-navy-500"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={() => runComparison(docAId, docBId)}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
            <span>Run Comparative Audit</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-xs text-slate-500">Comparing page-aware clauses and risk shifts...</p>
        </div>
      ) : comparison ? (
        <div className="space-y-6">
          
          {/* Summary Banner */}
          <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-purple-950 dark:text-purple-200">
                Comparison Executive Brief
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200">
                {comparison.keyDifferencesCount} Key Differences Flagged
              </span>
            </div>
            <p className="text-xs sm:text-sm text-purple-900/90 dark:text-purple-200/90 leading-relaxed">
              {comparison.executiveSummary}
            </p>
          </div>

          {/* High-Risk Shifts Alert */}
          {comparison.highRiskShifts && comparison.highRiskShifts.length > 0 && (
            <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2">
              <span className="text-[11px] font-bold text-red-700 dark:text-red-300 uppercase tracking-wider block">
                🚨 High-Risk Clause Escalations:
              </span>
              <ul className="space-y-1 text-xs text-red-900 dark:text-red-200">
                {comparison.highRiskShifts.map((shift, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{shift}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Differences List */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Side-by-Side Clause Modifications</h3>

            {comparison.differences.map((diff) => {
              const isRiskIncreased = diff.riskShift === 'increased';
              return (
                <div
                  key={diff.id}
                  className={`p-6 rounded-2xl border space-y-4 ${
                    isRiskIncreased
                      ? 'bg-red-50/30 dark:bg-red-950/10 border-red-200 dark:border-red-900/40'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                        isRiskIncreased ? 'bg-red-600' : 'bg-emerald-600'
                      }`}>
                        {isRiskIncreased ? 'RISK INCREASED' : 'BALANCED / NEUTRAL'}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{diff.clauseName}</h4>
                    </div>

                    <button
                      onClick={() => {
                        setEvidenceTitle(`Comparison Evidence: ${diff.clauseName}`);
                        setCitations([
                          { sourceType: 'document', documentTitle: comparison.docATitle, page: diff.docAPage || 1, evidenceText: diff.docAText || '' },
                          { sourceType: 'document', documentTitle: comparison.docBTitle, page: diff.docBPage || 1, evidenceText: diff.docBText || '' }
                        ]);
                        setEvidenceOpen(true);
                      }}
                      className="text-xs font-semibold text-navy-700 dark:text-navy-300 hover:underline"
                    >
                      Show Verbatim Evidence
                    </button>
                  </div>

                  {/* Side by side box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="font-sans font-bold text-slate-500 text-[10px] block">
                        Doc A ({comparison.docATitle}) — Page {diff.docAPage || 1}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200">{diff.docAText || 'Clause not present.'}</p>
                    </div>

                    <div className={`p-3.5 rounded-xl border space-y-1 ${
                      isRiskIncreased 
                        ? 'bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-900/60' 
                        : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                    }`}>
                      <span className="font-sans font-bold text-slate-500 text-[10px] block">
                        Doc B ({comparison.docBTitle}) — Page {diff.docBPage || 1}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-bold">{diff.docBText || 'Clause removed.'}</p>
                    </div>
                  </div>

                  {/* Impact & Question */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Why It Matters:</span>
                      <p className="text-slate-600 dark:text-slate-400">{diff.whyItMatters}</p>
                    </div>

                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/60">
                      <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">Recommended Question:</span>
                      <p className="text-indigo-800 dark:text-indigo-200">"{diff.questionToAsk}"</p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : null}

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        title={evidenceTitle}
        citations={citations}
      />

    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-navy-600" />
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
