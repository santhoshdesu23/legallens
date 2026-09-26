'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Layers, 
  HelpCircle, 
  ShieldAlert, 
  CheckSquare, 
  Briefcase, 
  Calendar, 
  Scale, 
  Search, 
  Shield, 
  Printer, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  ArrowLeft,
  ChevronRight,
  Send,
  Loader2,
  ExternalLink,
  Lock
} from 'lucide-react';
import { LegalDocument, QAMessage, EvidenceCitation } from '@/lib/types';
import AttentionScoreBadge from '@/components/AttentionScoreBadge';
import EvidenceModal from '@/components/EvidenceModal';
import PIIModal from '@/components/PIIModal';
import HighRiskBanner from '@/components/HighRiskBanner';
import { useTranslation } from '@/lib/i18n';

export default function DocumentWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { language } = useTranslation();

  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'simplify' | 'clauses' | 'risks' | 'deadlines' | 'ask' | 'evidence' | 'action' | 'lawyer'>('overview');
  const [readingLevel, setReadingLevel] = useState<'simple' | 'detailed' | 'professional'>('simple');

  // Evidence Modal State
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [activeEvidenceTitle, setActiveEvidenceTitle] = useState('');
  const [activeCitations, setActiveCitations] = useState<EvidenceCitation[]>([]);

  // PII Modal State
  const [piiModalOpen, setPiiModalOpen] = useState(false);

  // Q&A State
  const [qaThread, setQaThread] = useState<QAMessage[]>([]);
  const [questionInput, setQuestionInput] = useState('');
  const [qaLoading, setQaLoading] = useState(false);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const fetchDoc = async () => {
      try {
        const res = await fetch(`/api/documents/${id}`);
        const data = await res.json();
        if (data.document) {
          setDocument(data.document);
          
          if (!qaThread.length) {
            const qaRes = await fetch(`/api/ask?documentId=${id}`);
            const qaData = await qaRes.json();
            setQaThread(qaData.thread || []);
          }

          if (data.document.analysisStatus === 'PENDING' || data.document.analysisStatus === 'ANALYZING') {
            // Keep polling
            pollInterval = setTimeout(fetchDoc, 3000);
          }
        }
      } catch (err) {
        console.error('Failed to load document workspace:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();

    return () => {
      if (pollInterval) clearTimeout(pollInterval);
    };
  }, [id]);

  const handleAskQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!questionInput.trim() || qaLoading) return;

    const userQ = questionInput;
    setQuestionInput('');
    setQaLoading(true);

    const tempUserMsg: QAMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      question: userQ
    };
    setQaThread(prev => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id, question: userQ, language })
      });
      const data = await res.json();
      if (data.message) {
        setQaThread(prev => [...prev, data.message]);
      }
    } catch (err) {
      console.error('QA failed:', err);
    } finally {
      setQaLoading(false);
    }
  };

  const handleToggleChecklist = async (itemId: string, currentStatus: boolean) => {
    if (!document || !document.actionPlan) return;

    // Optimistic UI update
    const updatedChecklist = document.actionPlan.immediateChecklist.map(i => 
      i.id === itemId ? { ...i, completed: !currentStatus } : i
    );
    setDocument({
      ...document,
      actionPlan: {
        ...document.actionPlan,
        immediateChecklist: updatedChecklist
      }
    });

    try {
      await fetch('/api/action-plan/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id, itemId, completed: !currentStatus })
      });
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const openEvidence = (title: string, citations: EvidenceCitation[]) => {
    setActiveEvidenceTitle(title);
    setActiveCitations(citations);
    setEvidenceModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-navy-600" />
        <p className="text-xs text-slate-500 font-medium">Loading LegalLens Document Workspace...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Document Not Found</h2>
        <p className="text-xs text-slate-500">The requested document could not be retrieved.</p>
        <Link href="/documents" className="px-4 py-2 bg-navy-800 text-white rounded-lg text-xs font-semibold">
          Return to Documents
        </Link>
      </div>
    );
  }

  if (document.analysisStatus === 'PENDING' || document.analysisStatus === 'ANALYZING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-navy-600" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analyzing Document...</h2>
        <p className="text-sm text-slate-500">LegalLens AI is extracting clauses, identifying risks, and generating your action plan.</p>
        <p className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded">Status: {document.analysisStatus}</p>
      </div>
    );
  }

  if (document.analysisStatus === 'FAILED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 max-w-lg mx-auto text-center">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Failed</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {document.analysisError || 'The AI was unable to complete the analysis. Please check your API key and connection.'}
        </p>
        <button 
          onClick={() => {
            fetch('/api/documents/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documentId: id, language }) });
            setDocument({...document, analysisStatus: 'PENDING'});
          }} 
          className="px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-semibold mt-4"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  const isCritical = document.attentionScore?.overallLevel === 'CRITICAL';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/documents" className="text-slate-400 hover:text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {document.title}
            </h1>
            {document.isSyntheticDemo && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Synthetic Demo
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="font-mono">{document.fileName}</span>
            <span>•</span>
            <span className="capitalize">{document.documentType.replace('_', ' ')}</span>
            <span>•</span>
            <span>{document.pages?.length || 1} Pages Detected</span>
            <span>•</span>
            <span>Uploaded {new Date(document.uploadedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {document.sensitiveInfoDetected && (
            <button
              onClick={() => setPiiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>PII Shield</span>
            </button>
          )}

          <Link
            href={`/compare?docA=${document.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold hover:bg-purple-100"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare With...</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* High-Risk Banner if Critical */}
      {isCritical && (
        <HighRiskBanner
          title="Critical Attention Terms Flagged"
          description="Contains restrictive covenants, uncapped liability, or asymmetric termination requiring strict legal negotiation."
        />
      )}

      {/* 9 Workspace Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        {[
          { id: 'overview', label: '📊 Overview', icon: Layers },
          { id: 'simplify', label: '🧠 Simplify', icon: BookOpen },
          { id: 'clauses', label: '📜 Clauses', icon: FileText },
          { id: 'risks', label: '🚨 Risks', icon: ShieldAlert },
          { id: 'deadlines', label: '⏰ Deadlines', icon: Calendar },
          { id: 'ask', label: '💬 Ask LegalLens', icon: HelpCircle },
          { id: 'evidence', label: '🔎 Evidence', icon: Search },
          { id: 'action', label: '📋 Action Plan', icon: CheckSquare },
          { id: 'lawyer', label: '👨‍⚖️ Lawyer Prep', icon: Briefcase },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <AttentionScoreBadge score={document.attentionScore} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Executive summary block */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Document Brief</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {document.summary?.executiveSummary || 'Document summary available in the Simplify tab.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('simplify')}
                  className="text-xs font-bold text-navy-700 dark:text-navy-300 hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore 3 reading levels</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick stats & top findings */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Key Audit Metrics</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block">Extracted Clauses</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{document.clauses?.length || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block">Identified Risks</span>
                  <span className="text-lg font-bold text-red-600">{document.risks?.length || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block">Tracked Dates</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{document.deadlines?.length || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block">Indexed Chunks</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{document.chunks?.length || 0}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: SIMPLIFY */}
      {activeTab === 'simplify' && document.summary && (
        <div className="space-y-6">
          
          {/* Reading Level Selector */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Plain-Language Explanation</h3>
                <p className="text-xs text-slate-500">Select reading complexity • AI-generated plain-language breakdown</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['simple', 'detailed', 'professional'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setReadingLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      readingLevel === lvl
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-navy-50/50 dark:bg-navy-950/30 border border-navy-100 dark:border-navy-900 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {document.summary.readingLevels?.[readingLevel] || 'Reading level summary is not available.'}
            </div>
          </div>

          {/* Key Points Grid */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Key Contractual Pillars</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Identified Parties</span>
                <p className="font-semibold text-slate-900 dark:text-white">{document.summary.keyPoints?.parties || 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Core Purpose</span>
                <p className="font-semibold text-slate-900 dark:text-white">{document.summary.keyPoints?.purpose || 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Term & Duration</span>
                <p className="font-semibold text-slate-900 dark:text-white">{document.summary.keyPoints?.term || 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Payment & Financials</span>
                <p className="font-semibold text-slate-900 dark:text-white">{document.summary.keyPoints?.payment || 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Termination Grounds</span>
                <p className="font-semibold text-slate-900 dark:text-white">{document.summary.keyPoints?.termination || 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Dispute Resolution</span>
                <p className="font-semibold text-slate-900 dark:text-white">{document.summary.keyPoints?.disputeResolution || 'N/A'}</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: CLAUSES */}
      {activeTab === 'clauses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Extracted Clauses</h3>
              <p className="text-xs text-slate-500">{document.clauses?.length || 0} categorized clauses with page citations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(document.clauses || []).map((clause) => (
              <div
                key={clause.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {clause.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{clause.title}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">FACT</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Page {clause.sourcePage} • {clause.sourceSection || 'General'}</span>
                    <button
                      onClick={() => openEvidence(clause.title, [{
                        sourceType: 'document',
                        documentTitle: document.title,
                        page: clause.sourcePage,
                        section: clause.sourceSection,
                        evidenceText: clause.sourceClauseText,
                        verified: clause.evidenceVerified !== false
                      }])}
                      className="px-2.5 py-1 rounded bg-navy-50 dark:bg-navy-950 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-800 font-semibold text-[11px] hover:bg-navy-100"
                    >
                      Show Evidence
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>AI Interpretation:</strong> {clause.plainLanguageExplanation}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">AI Interpretation - Potential Implication: </span>
                  {clause.potentialImplication}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RISKS */}
      {activeTab === 'risks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Contract Risk Audit</h3>
              <p className="text-xs text-slate-500">Flagged potential concerns and strategic questions for counsel</p>
            </div>
          </div>

          <div className="space-y-4">
            {(document.risks || []).map((risk) => {
              const isCrit = risk.riskLevel === 'CRITICAL';
              const isHigh = risk.riskLevel === 'HIGH';
              return (
                <div
                  key={risk.id}
                  className={`p-5 rounded-2xl border space-y-3.5 ${
                    isCrit 
                      ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                      : isHigh
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                        isCrit ? 'bg-red-600' : isHigh ? 'bg-amber-600' : 'bg-yellow-600'
                      }`}>
                        {risk.riskLevel}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{risk.title}</h4>
                    </div>
                    <button
                      onClick={() => openEvidence(risk.title, [{
                        sourceType: 'document',
                        documentTitle: document.title,
                        page: risk.page,
                        evidenceText: risk.evidence,
                        verified: risk.evidenceVerified !== false
                      }])}
                      className="text-xs font-semibold text-navy-700 dark:text-navy-300 hover:underline"
                    >
                      View Source Evidence (Page {risk.page})
                    </button>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <div><strong>{risk.evidenceVerified ? 'FACT - Source evidence:' : 'UNKNOWN - Source evidence:'}</strong> {risk.evidence ? `"${risk.evidence}"` : 'No exact supporting quote was returned.'}</div>
                    <div><strong>AI Interpretation - Why Flagged:</strong> {risk.whyFlagged}</div>
                    <div><strong>AI Interpretation - Potential Implication:</strong> {risk.potentialImplication}</div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-indigo-900 dark:text-indigo-300">
                    <span className="font-bold text-indigo-700 dark:text-indigo-400">Question for your Lawyer: </span>
                    "{risk.questionForLawyer}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: DEADLINES */}
      {activeTab === 'deadlines' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Extracted Deadlines & Timelines</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(document.deadlines || []).map((dl) => (
              <div key={dl.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-navy-700 dark:text-navy-300">{dl.date}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                    Page {dl.sourcePage}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{dl.event}</h4>
                <p className="text-xs text-slate-500">{dl.potentialImportance}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ASK LEGALLENS */}
      {activeTab === 'ask' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-navy-600" />
              Document-Grounded Q&A Workspace
            </h3>

            {/* Q&A Thread */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {qaThread.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                  <p>Ask any question regarding this agreement (e.g. "What is the notice period?", "Is the liability capped?").</p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <button
                      onClick={() => { setQuestionInput('What is the notice period for termination?'); }}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200"
                    >
                      "What is the notice period?"
                    </button>
                    <button
                      onClick={() => { setQuestionInput('What are my liability obligations?'); }}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200"
                    >
                      "What are my liabilities?"
                    </button>
                  </div>
                </div>
              ) : (
                qaThread.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    {msg.sender === 'user' ? (
                      <div className="flex justify-end">
                        <div className="bg-navy-800 text-white p-3.5 rounded-2xl rounded-tr-none text-xs max-w-lg shadow-sm">
                          {msg.question}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                        <div className="font-semibold text-slate-900 dark:text-white leading-relaxed">
                          {msg.answer}
                        </div>

                        {msg.basedOnDocument && (
                          <div className="text-slate-600 dark:text-slate-400">
                            <strong>FACT - Based on your document:</strong> {msg.basedOnDocument}
                          </div>
                        )}

                        {/* Evidence Buttons */}
                        {msg.evidence && msg.evidence.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                              onClick={() => openEvidence('Q&A Answer Citations', msg.evidence || [])}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold"
                            >
                              <Search className="w-3 h-3" />
                              <span>Show Evidence ({msg.evidence.length} Citations)</span>
                            </button>
                          </div>
                        )}

                        {/* Lawyer Questions */}
                        {msg.considerAskingLawyer && msg.considerAskingLawyer.length > 0 && (
                          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-[11px] space-y-1">
                            <span className="font-bold">Consider asking a lawyer:</span>
                            <ul className="list-disc list-inside space-y-0.5">
                              {msg.considerAskingLawyer.map((q, i) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}

              {qaLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-navy-600" />
                  <span>Retrieving exact document chunks and generating evidence-grounded answer...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleAskQuestion} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask a question grounded in this document..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
              <button
                type="submit"
                disabled={qaLoading || !questionInput.trim()}
                className="p-2.5 rounded-xl bg-navy-800 text-white disabled:opacity-50 hover:bg-navy-900 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 7: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Document Source Index</h3>
          <p className="text-xs text-slate-500">Page-aware source chunks retained for this document</p>

          <div className="space-y-3">
            {(document.chunks || []).map((chk) => (
              <div key={chk.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-navy-700 dark:text-navy-300">Page {chk.page} • {chk.section || 'General'}</span>
                  <span className="font-mono">{chk.id}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                  {chk.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: ACTION PLAN */}
      {activeTab === 'action' && document.actionPlan && (
        <div className="space-y-6">
          
          {/* Situation block */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Current Situation Overview</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {document.actionPlan.whatAppearsToBeHappening}
            </p>
          </div>

          {/* Checklist */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Actionable Next Steps Checklist</h3>
            
            <div className="space-y-2">
              {(document.actionPlan.immediateChecklist || []).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id, item.completed)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-70'
                      : 'bg-white dark:bg-slate-900 border-navy-200 dark:border-navy-900 hover:border-navy-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}} // Handled by container click
                      className="w-4 h-4 rounded text-navy-600 focus:ring-navy-500"
                    />
                    <span className={`text-xs ${item.completed ? 'line-through text-slate-400' : 'font-medium text-slate-900 dark:text-white'}`}>
                      {item.text}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 capitalize">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents to collect */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Documents to Collect</h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {(document.actionPlan.documentsToCollect || []).map((d, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-navy-600 flex-shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 9: LAWYER PREP */}
      {activeTab === 'lawyer' && document.lawyerBrief && (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lawyer Briefing Package</h3>
                <p className="text-xs text-slate-500">Structured summary prepared for advocate / legal counsel consultation</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs shadow"
              >
                Export / Print Brief
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">1. Situation Summary</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{document.lawyerBrief.situationSummary}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">2. Identified Parties</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {(document.lawyerBrief.parties || []).map((p, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                      <span className="block text-slate-500">{p.role} • {p.obligationsSummary}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">3. Key Issues for Legal Review</h4>
                <div className="space-y-2 pt-1">
                  {(document.lawyerBrief.potentialIssuesForReview || []).map((issue, i) => (
                    <div key={i} className="p-3 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/60">
                      <span className="font-bold text-red-900 dark:text-red-200">{issue.issue}</span>
                      <p className="text-red-800/80 dark:text-red-300/80 mt-0.5">{issue.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">4. Priority Questions for Lawyer</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pt-1">
                  {(document.lawyerBrief.questionsForLawyer || []).map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">5. Checklist of Documents to Bring</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pt-1">
                  {(document.lawyerBrief.documentsToBring || []).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        title={activeEvidenceTitle}
        citations={activeCitations}
      />

      {/* PII Modal */}
      {document.sensitiveInfoDetected && (
        <PIIModal
          isOpen={piiModalOpen}
          onClose={() => setPiiModalOpen(false)}
          sensitiveInfo={document.sensitiveInfoDetected}
        />
      )}

    </div>
  );
}
