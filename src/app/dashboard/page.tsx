'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Scale, 
  HelpCircle, 
  ShieldAlert, 
  CheckSquare, 
  Briefcase, 
  Plus, 
  ArrowRight, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { LegalDocument } from '@/lib/types';
import AttentionScoreBadge from '@/components/AttentionScoreBadge';
import DocumentUploader from '@/components/DocumentUploader';

export default function DashboardPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Collect all extracted deadlines across documents
  const allDeadlines = documents.flatMap(d => 
    (d.deadlines || []).map(dl => ({ ...dl, docTitle: d.title, docId: d.id }))
  ).slice(0, 5);

  // Count risks
  const totalRisks = documents.flatMap(d => d.risks || []);
  const criticalRisks = totalRisks.filter(r => r.riskLevel === 'CRITICAL');
  const highRisks = totalRisks.filter(r => r.riskLevel === 'HIGH');
  const mediumRisks = totalRisks.filter(r => r.riskLevel === 'MEDIUM');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Legal Document Intelligence Dashboard
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Active Workspace
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explain → Verify → Act. Audit contracts, extract obligations, scan risks, and prepare for legal counsel.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowUploadModal(!showUploadModal)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Analyze New Document</span>
          </button>
        </div>
      </div>

      {/* Upload Drawer / Modal */}
      {showUploadModal && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-navy-200 dark:border-navy-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Legal Document</h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
          <DocumentUploader onUploadSuccess={() => { setShowUploadModal(false); fetchDocuments(); }} />
        </div>
      )}

      {/* Primary Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/documents"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-navy-500 shadow-sm transition-all hover:shadow group"
        >
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 w-fit mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-navy-600 dark:group-hover:text-navy-400">
            Document Workspace
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {documents.length} contracts loaded
          </div>
        </Link>

        <Link
          href="/compare"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-navy-500 shadow-sm transition-all hover:shadow group"
        >
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 w-fit mb-3">
            <Scale className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
            Compare Contracts
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Side-by-side diff & shift audit
          </div>
        </Link>

        <Link
          href="/ask"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-navy-500 shadow-sm transition-all hover:shadow group"
        >
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 w-fit mb-3">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
            Ask LegalLens
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            RAG document grounding
          </div>
        </Link>

        <Link
          href="/lawyer-prep"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-navy-500 shadow-sm transition-all hover:shadow group"
        >
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 w-fit mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
            Lawyer Prep Studio
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Generate advocate brief
          </div>
        </Link>
      </div>

      {/* Overview Attention Summary & Risk Counters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Scanner Summary */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Active Risk Audit Breakdown</h2>
            </div>
            <Link href="/risks" className="text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline">
              View All Risks →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
              <span className="text-[11px] font-bold text-red-700 dark:text-red-300 block">CRITICAL RISKS</span>
              <span className="text-2xl font-black text-red-600">{criticalRisks.length}</span>
              <span className="text-[10px] text-red-600/80 block mt-1">Severe liability & non-competes</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block">HIGH RISKS</span>
              <span className="text-2xl font-black text-amber-600">{highRisks.length}</span>
              <span className="text-[10px] text-amber-600/80 block mt-1">Asymmetric notice & forfeiture</span>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-900/60">
              <span className="text-[11px] font-bold text-yellow-800 dark:text-yellow-200 block">MODERATE</span>
              <span className="text-2xl font-black text-yellow-600">{mediumRisks.length}</span>
              <span className="text-[10px] text-yellow-700/80 block mt-1">Standard review items</span>
            </div>
          </div>

          {/* Featured Attention Document */}
          {documents.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Highest Attention Contract:
              </div>
              <AttentionScoreBadge score={documents[1]?.attentionScore || documents[0]?.attentionScore} />
            </div>
          )}
        </div>

        {/* Upcoming Extracted Deadlines */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-navy-600 dark:text-navy-400" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Extracted Deadlines</h2>
            </div>
            <Link href="/action-plan" className="text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline">
              Checklists →
            </Link>
          </div>

          <div className="space-y-3">
            {allDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No deadlines detected yet.</p>
            ) : (
              allDeadlines.map((dl, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-navy-700 dark:text-navy-300">{dl.date}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Page {dl.sourcePage}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{dl.event}</p>
                  <p className="text-[11px] text-slate-500 truncate">{dl.docTitle}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Recent Documents Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Loaded Legal Documents</h2>
            <p className="text-xs text-slate-500">Click any document to open its full 9-tab workspace</p>
          </div>
          <Link href="/documents" className="text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline">
            Manage Documents →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 font-semibold">Document Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Attention Score</th>
                <th className="pb-3 font-semibold">Pages</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-navy-600 dark:text-navy-400 flex-shrink-0" />
                    <div>
                      <Link href={`/documents/${doc.id}`} className="hover:underline font-semibold block">
                        {doc.title}
                      </Link>
                      <span className="text-[10px] text-slate-400">{doc.fileName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium capitalize">
                      {doc.documentType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3">
                    <AttentionScoreBadge score={doc.attentionScore} variant="compact" />
                  </td>
                  <td className="py-3 text-slate-500">{doc.pages?.length || 1} pages</td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/documents/${doc.id}`}
                      className="inline-flex items-center gap-1 text-navy-600 dark:text-navy-400 font-semibold hover:underline"
                    >
                      <span>Open Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
