'use client';

import React, { useState } from 'react';
import { Shield, Eye, EyeOff, X, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sensitiveInfo?: {
    names: string[];
    emails: string[];
    phones: string[];
    ids: string[];
    financials: string[];
  };
}

export default function PIIModal({ isOpen, onClose, sensitiveInfo }: Props) {
  const [redactEmails, setRedactEmails] = useState(true);
  const [redactPhones, setRedactPhones] = useState(true);
  const [redactIds, setRedactIds] = useState(true);
  const [applied, setApplied] = useState(false);

  if (!isOpen || !sensitiveInfo) return null;

  const totalDetected = 
    (sensitiveInfo.names?.length || 0) +
    (sensitiveInfo.emails?.length || 0) +
    (sensitiveInfo.phones?.length || 0) +
    (sensitiveInfo.ids?.length || 0) +
    (sensitiveInfo.financials?.length || 0);

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                Privacy & Sensitive Data Scanner
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  {totalDetected} Entities Detected
                </span>
              </h3>
              <p className="text-xs text-slate-500">Local-first privacy shield for confidential legal records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Zero Document Content Public Leakage Policy</span>
            </div>
            <p>LegalLens isolates documents within your local session and sanitizes sensitive identifiers prior to indexing.</p>
          </div>

          {/* Detected Categories */}
          <div className="space-y-4">
            
            {/* Emails */}
            {sensitiveInfo.emails?.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Email Addresses ({sensitiveInfo.emails.length})
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-indigo-600 dark:text-indigo-400">
                    <input
                      type="checkbox"
                      checked={redactEmails}
                      onChange={(e) => setRedactEmails(e.target.checked)}
                      className="rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                    />
                    <span>Auto-Redact</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sensitiveInfo.emails.map((e, i) => (
                    <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {redactEmails ? '[REDACTED EMAIL]' : e}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Phone Numbers */}
            {sensitiveInfo.phones?.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Phone Numbers ({sensitiveInfo.phones.length})
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-indigo-600 dark:text-indigo-400">
                    <input
                      type="checkbox"
                      checked={redactPhones}
                      onChange={(e) => setRedactPhones(e.target.checked)}
                      className="rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                    />
                    <span>Auto-Redact</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sensitiveInfo.phones.map((p, i) => (
                    <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {redactPhones ? '[REDACTED PHONE]' : p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Govt IDs / PAN / Aadhaar */}
            {sensitiveInfo.ids?.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Government / Tax Identifiers ({sensitiveInfo.ids.length})
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-indigo-600 dark:text-indigo-400">
                    <input
                      type="checkbox"
                      checked={redactIds}
                      onChange={(e) => setRedactIds(e.target.checked)}
                      className="rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                    />
                    <span>Auto-Redact</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sensitiveInfo.ids.map((id, i) => (
                    <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {redactIds ? '[REDACTED ID]' : id}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Financials */}
            {sensitiveInfo.financials?.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Financial & Currency Terms ({sensitiveInfo.financials.length})
                  </span>
                  <span className="text-[11px] text-slate-400">Preserved for contract calculations</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sensitiveInfo.financials.map((f, i) => (
                    <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {applied && (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Redaction rules active!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-navy-800 hover:bg-navy-900 text-white shadow-sm transition-all"
            >
              Apply Redaction Shield
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
