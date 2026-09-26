'use client';

import React from 'react';
import { EvidenceCitation } from '@/lib/types';
import { X, Search, FileText, ExternalLink, Bookmark, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  citations: EvidenceCitation[];
}

export default function EvidenceModal({ isOpen, onClose, title, citations }: Props) {
  if (!isOpen) return null;

  const allDocumentEvidenceVerified = citations
    .filter(citation => citation.sourceType === 'document')
    .every(citation => citation.verified !== false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-navy-100 dark:bg-navy-900/60 text-navy-700 dark:text-navy-300 rounded-lg">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                Document & Statutory Evidence
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {allDocumentEvidenceVerified ? 'Verified Trace' : 'Verification Required'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-md">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 bg-navy-50/50 dark:bg-navy-950/20 p-2.5 rounded-lg border border-navy-100 dark:border-navy-900/30">
            <ShieldCheck className="w-4 h-4 text-navy-600 flex-shrink-0" />
            <span>LegalLens Rule: <strong>No Evidence → No Confident Claim.</strong> The citations below ground the AI explanation in verbatim source text and official statutes.</span>
          </div>

          {citations.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No specific page citations attached for this item.
            </div>
          ) : (
            citations.map((cite, index) => {
              const isOfficial = cite.sourceType === 'official_legal_source';
              return (
                <div 
                  key={index}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {isOfficial ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          <Bookmark className="w-3 h-3" />
                          Primary Official Statute
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-navy-700 dark:text-navy-300 bg-navy-50 dark:bg-navy-950/60 px-2 py-0.5 rounded border border-navy-200 dark:border-navy-800">
                          <FileText className="w-3 h-3" />
                          Document Source: Page {cite.page || 1}
                        </span>
                      )}

                      {!isOfficial && cite.verified === false && (
                        <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Unverified quote
                        </span>
                      )}

                      {cite.section && (
                        <span className="text-slate-500 font-medium">
                          • {cite.section}
                        </span>
                      )}
                    </div>

                    {cite.documentTitle && (
                      <span className="text-slate-400 text-[11px] truncate max-w-[180px]">
                        {cite.documentTitle}
                      </span>
                    )}
                  </div>

                  {/* Verbatim quote snippet */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                    "{cite.evidenceText}"
                  </div>

                  {/* Official statutory authority link */}
                  {cite.officialSource && (
                    <div className="pt-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span className="truncate">Authority: {cite.officialSource.authority}</span>
                      {cite.officialSource.url && (
                        <a
                          href={cite.officialSource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-navy-600 dark:text-navy-400 hover:underline font-semibold flex-shrink-0"
                        >
                          View Official Source
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close Evidence Window
          </button>
        </div>
      </div>
    </div>
  );
}
