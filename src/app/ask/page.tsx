'use client';

import React, { useEffect, useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  Search, 
  FileText, 
  Loader2, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { LegalDocument, QAMessage } from '@/lib/types';
import EvidenceModal from '@/components/EvidenceModal';

export default function AskPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [loading, setLoading] = useState(false);

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
      const docs = data.documents || [];
      setDocuments(docs);
      if (docs.length > 0) {
        setSelectedDocId(docs[1]?.id || docs[0]?.id);
      }
    } catch (err) {
      console.error('Error loading documents for Q&A:', err);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim() || loading || !selectedDocId) return;

    const userQ = question;
    setQuestion('');
    setLoading(true);

    const tempMsg: QAMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      question: userQ
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: selectedDocId, question: userQ })
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
      }
    } catch (err) {
      console.error('Ask error:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeDoc = documents.find(d => d.id === selectedDocId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Ask LegalLens
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Grounded RAG Assistant
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Strict epistemic standard: Answers strictly grounded in your contract and official statutory authorities.
          </p>
        </div>

        {/* Document Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Active Contract:</label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold text-slate-400 self-center">Try asking:</span>
        <button
          onClick={() => { setQuestion('What is the notice period required for resignation?'); }}
          className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium hover:border-navy-500 text-slate-700 dark:text-slate-300"
        >
          "What is the notice period?"
        </button>
        <button
          onClick={() => { setQuestion('Are there any non-compete or restrictive covenants post-termination?'); }}
          className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium hover:border-navy-500 text-slate-700 dark:text-slate-300"
        >
          "Are there non-compete restrictions?"
        </button>
        <button
          onClick={() => { setQuestion('What is my maximum liability exposure under this agreement?'); }}
          className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium hover:border-navy-500 text-slate-700 dark:text-slate-300"
        >
          "What is my liability cap?"
        </button>
      </div>

      {/* Chat Thread Area */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[480px] flex flex-col justify-between space-y-6">
        
        <div className="space-y-4 overflow-y-auto max-h-[550px] pr-2">
          {messages.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 dark:bg-navy-950 text-navy-600 dark:text-navy-400 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Ready to answer questions for "{activeDoc?.title || 'Contract'}"
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Every factual claim includes direct page and clause citations. No hallucinations.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.sender === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-navy-800 text-white p-3.5 rounded-2xl rounded-tr-none text-xs max-w-lg shadow-sm font-medium">
                      {msg.question}
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
                    
                    {/* Direct Answer */}
                    <div className="font-semibold text-slate-900 dark:text-white text-sm leading-relaxed">
                      {msg.answer}
                    </div>

                    {/* Based on document */}
                    {msg.basedOnDocument && (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-slate-900 dark:text-white block mb-1">FACT - Based on your document:</span>
                        <p className="leading-relaxed">{msg.basedOnDocument}</p>
                      </div>
                    )}

                    {/* Evidence & Citations */}
                    {msg.evidence && msg.evidence.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEvidenceTitle('Q&A Supporting Evidence');
                            setCitations(msg.evidence || []);
                            setEvidenceOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Show Evidence ({msg.evidence.length} Sources Attached)</span>
                        </button>
                      </div>
                    )}

                    {/* Uncertainty Warning */}
                    {msg.whatRemainsUncertain && (
                      <div className="text-[11px] text-slate-500 italic">
                        <strong>What remains uncertain:</strong> {msg.whatRemainsUncertain}
                      </div>
                    )}

                    {/* Lawyer Questions */}
                    {msg.considerAskingLawyer && msg.considerAskingLawyer.length > 0 && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-900 dark:text-amber-200 space-y-1">
                        <span className="font-bold">Consider asking a legal professional:</span>
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

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-navy-600" />
              <span>Retrieving page-aware document evidence and generating an answer...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask a question grounded in ${activeDoc?.title || 'contract'}...`}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="p-3 rounded-xl bg-navy-800 text-white hover:bg-navy-900 disabled:opacity-50 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

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
