'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Plus,
  Trash2,
  Search,
  Scale,
  Shield,
  Layers,
  ChevronRight,
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { LegalDocument } from '@/lib/types';
import AttentionScoreBadge from '@/components/AttentionScoreBadge';
import DocumentUploader from '@/components/DocumentUploader';
import PIIModal from '@/components/PIIModal';

function DocumentsRepositoryContent() {
  const searchParams = useSearchParams();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocForPII, setSelectedDocForPII] = useState<LegalDocument | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'upload') {
      setShowUpload(true);
    }
  }, [searchParams]);

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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this document from your session?')) return;

    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Legal Document Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access contracts, execute multi-stage audits, review PII redactions, and launch comparative diffs.
          </p>
        </div>

        <button
          onClick={() => setShowUpload(!showUpload)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Upload Box */}
      {showUpload && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Upload Contract / Agreement</h3>
            <button onClick={() => setShowUpload(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
          </div>
          <DocumentUploader onUploadSuccess={() => { setShowUpload(false); fetchDocuments(); }} />
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          type="text"
          placeholder="Filter by title, filename, or document type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
        />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-navy-500 shadow-sm transition-all hover:shadow-md flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-navy-50 dark:bg-navy-950 text-navy-700 dark:text-navy-300 border border-navy-100 dark:border-navy-900 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                
                <div className="flex items-center gap-1.5">
                  {doc.isSyntheticDemo && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      Synthetic Demo
                    </span>
                  )}
                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <Link href={`/documents/${doc.id}`} className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-navy-600 dark:group-hover:text-navy-400 block line-clamp-1">
                  {doc.title}
                </Link>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{doc.fileName} • {doc.pages?.length || 1} pages</p>
              </div>

              <div className="pt-1">
                <AttentionScoreBadge score={doc.attentionScore} variant="compact" />
              </div>

              {doc.summary && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {doc.summary.executiveSummary}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              {doc.sensitiveInfoDetected ? (
                <button
                  onClick={() => setSelectedDocForPII(doc)}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>PII Shield</span>
                </button>
              ) : <div />}

              <Link
                href={`/documents/${doc.id}`}
                className="inline-flex items-center gap-1 font-bold text-navy-700 dark:text-navy-300 hover:underline"
              >
                <span>Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* PII Modal */}
      {selectedDocForPII && (
        <PIIModal
          isOpen={!!selectedDocForPII}
          onClose={() => setSelectedDocForPII(null)}
          sensitiveInfo={selectedDocForPII.sensitiveInfoDetected}
        />
      )}

    </div>
  );
}

export default function DocumentsRepositoryPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <DocumentsRepositoryContent />
    </Suspense>
  );
}
