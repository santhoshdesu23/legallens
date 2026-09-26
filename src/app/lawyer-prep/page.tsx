'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Printer, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  ShieldAlert,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';
import { LegalDocument } from '@/lib/types';

export default function LawyerPrepPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      const docs = data.documents || [];
      setDocuments(docs);
      if (docs.length > 0) {
        setSelectedDocId(docs[1]?.id || docs[0]?.id);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    }
  };

  const activeDoc = documents.find(d => d.id === selectedDocId);
  const brief = activeDoc?.lawyerBrief;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header (Hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Lawyer Consultation Preparation Studio
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              Advocate Briefing Package
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Structured briefing report to optimize your legal consultation and save billable hours.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {brief ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0">
          
          {/* Brief Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-navy-600 dark:text-navy-400">
                LegalLens Legal Briefing Document
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Generated: {new Date().toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Client Consultation Brief: {activeDoc?.title}
            </h2>
            <p className="text-xs text-slate-500 italic">
              AI-generated preparation material for review with qualified legal counsel.
            </p>
          </div>

          {/* Section 1: Situation Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-l-4 border-navy-600 pl-2">
              1. Situation Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-3">
              {brief.situationSummary}
            </p>
          </div>

          {/* Section 2: Parties */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-l-4 border-navy-600 pl-2">
              2. Identified Parties & Roles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3 pt-1">
              {brief.parties.map((party, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{party.name}</span>
                  <span className="block text-slate-500 mt-0.5">{party.role} • {party.obligationsSummary}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Potential Issues for Review */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-l-4 border-red-600 pl-2">
              3. Potential Issues Flagged for Counsel
            </h3>
            <div className="space-y-2 pl-3 pt-1">
              {brief.potentialIssuesForReview.map((issue, i) => (
                <div key={i} className="p-3.5 bg-red-50/40 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900 dark:text-red-200">{issue.issue}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-red-800/80 dark:text-red-300/80">{issue.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Questions for Lawyer */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-l-4 border-navy-600 pl-2">
              4. Strategic Questions to Ask Your Advocate
            </h3>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 dark:text-slate-300 pl-3 pt-1">
              {brief.questionsForLawyer.map((q, i) => (
                <li key={i} className="font-medium">{q}</li>
              ))}
            </ul>
          </div>

          {/* Section 5: Documents to Bring */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-l-4 border-navy-600 pl-2">
              5. Checklist of Documents to Bring to Consultation
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-3 pt-1">
              {brief.documentsToBring.map((doc, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Disclaimer:
            </div>
            <p>
              This brief is generated by LegalLens for informational and preparation purposes only. It does not constitute formal legal advice or an advocate-client relationship. Please verify all facts and citations directly with your advocate.
            </p>
          </div>

        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          No lawyer brief generated for this document yet.
        </div>
      )}

    </div>
  );
}
