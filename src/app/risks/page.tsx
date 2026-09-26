'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Filter, 
  Search, 
  FileText, 
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { LegalDocument, RiskFinding } from '@/lib/types';
import EvidenceModal from '@/components/EvidenceModal';

export default function RisksPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  
  // Evidence modal state
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [citations, setCitations] = useState<any[]>([]);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Error fetching risks:', err);
    }
  };

  // Flatten all risks across documents
  const allRisks = documents.flatMap(doc => 
    (doc.risks || []).map(r => ({ ...r, docTitle: doc.title, docId: doc.id }))
  );

  const filtered = allRisks.filter(r => {
    if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
    if (selectedSeverity !== 'ALL' && r.riskLevel !== selectedSeverity) return false;
    return true;
  });

  const categories = ['ALL', 'Financial', 'Termination', 'Liability', 'Restrictions', 'Deadlines', 'Dispute Resolution'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Global Risk Scanner
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300">
              {allRisks.length} Audit Findings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Examines contracts for one-sided indemnities, uncapped liabilities, non-compete covenants, and asymmetric terms.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-navy-800 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No risk findings match the selected filters.
          </div>
        ) : (
          filtered.map((risk) => {
            const isCrit = risk.riskLevel === 'CRITICAL';
            const isHigh = risk.riskLevel === 'HIGH';
            return (
              <div
                key={risk.id}
                className={`p-6 rounded-2xl border space-y-3.5 transition-all ${
                  isCrit
                    ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                    : isHigh
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                      isCrit ? 'bg-red-600' : isHigh ? 'bg-amber-600' : 'bg-yellow-600'
                    }`}>
                      {risk.riskLevel}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {risk.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{risk.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Link
                      href={`/documents/${risk.docId}`}
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium truncate max-w-[200px]"
                    >
                      {risk.docTitle}
                    </Link>
                    <span>•</span>
                    <button
                      onClick={() => {
                        setEvidenceTitle(risk.title);
                        setCitations([{
                          sourceType: 'document',
                          documentTitle: risk.docTitle,
                          page: risk.page,
                          evidenceText: risk.evidence,
                          verified: risk.evidenceVerified !== false
                        }]);
                        setEvidenceOpen(true);
                      }}
                      className="font-semibold text-navy-700 dark:text-navy-300 hover:underline"
                    >
                      Show Evidence (Page {risk.page})
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div><strong>{risk.evidenceVerified ? 'FACT - Source evidence:' : 'UNKNOWN - Source evidence:'}</strong> {risk.evidence ? `"${risk.evidence}"` : 'No exact supporting quote was returned.'}</div>
                  <div><strong>AI Interpretation - Why Flagged:</strong> {risk.whyFlagged}</div>
                  <div><strong>AI Interpretation - Potential Implication:</strong> {risk.potentialImplication}</div>
                </div>

                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-indigo-900 dark:text-indigo-300">
                  <span className="font-bold text-indigo-700 dark:text-indigo-400">Ask your lawyer: </span>
                  "{risk.questionForLawyer}"
                </div>
              </div>
            );
          })
        )}
      </div>

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
