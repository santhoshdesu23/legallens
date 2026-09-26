'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowRight,
  ListTodo
} from 'lucide-react';
import { LegalDocument } from '@/lib/types';

export default function ActionPlanPage() {
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

  const toggleItem = async (itemId: string, currentStatus: boolean) => {
    if (!activeDoc || !activeDoc.actionPlan) return;

    const updatedChecklist = activeDoc.actionPlan.immediateChecklist.map(i => 
      i.id === itemId ? { ...i, completed: !currentStatus } : i
    );

    setDocuments(prev => prev.map(d => 
      d.id === activeDoc.id ? {
        ...d,
        actionPlan: {
          ...d.actionPlan!,
          immediateChecklist: updatedChecklist
        }
      } : d
    ));

    try {
      await fetch('/api/action-plan/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: activeDoc.id, itemId, completed: !currentStatus })
      });
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const checklist = activeDoc?.actionPlan?.immediateChecklist || [];
  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Action Plan & Execution Navigator
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-navy-300">
              Interactive Checklist
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Turn dense legal terms into concrete next steps, required documentation, and deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Document:</label>
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

      {activeDoc?.actionPlan ? (
        <div className="space-y-6">
          
          {/* Situation Brief */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Situation Context</h3>
              <Link href={`/documents/${activeDoc.id}`} className="text-xs font-semibold text-navy-600 dark:text-navy-400 hover:underline">
                Open Workspace →
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeDoc.actionPlan.whatAppearsToBeHappening}
            </p>
          </div>

          {/* Interactive Checklist & Progress */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-navy-600" />
                  Immediate Action Checklist
                </h3>
                <p className="text-xs text-slate-500">{completedCount} of {checklist.length} actions verified</p>
              </div>

              <div className="w-full sm:w-48 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id, item.completed)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-navy-500 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-navy-600 focus:ring-navy-500"
                    />
                    <span className={`text-xs ${item.completed ? 'line-through text-slate-400' : 'font-semibold text-slate-900 dark:text-white'}`}>
                      {item.text}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents to Collect & Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Required Records */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Required Documents & Records
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {activeDoc.actionPlan.documentsToCollect.map((d, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Options */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Strategic Options
              </h3>
              <div className="space-y-3">
                {activeDoc.actionPlan.options.map((opt) => (
                  <div key={opt.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{opt.title}</span>
                    <p className="text-slate-600 dark:text-slate-400">{opt.purpose}</p>
                    <div className="text-[11px] text-slate-500 pt-1">
                      <strong>When to consult counsel:</strong> {opt.whenProfessionalAdviceUseful}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          No action plan generated for this document yet.
        </div>
      )}

    </div>
  );
}
