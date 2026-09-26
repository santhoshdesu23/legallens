'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  FileCheck2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface Props {
  onUploadSuccess?: (docId: string) => void;
  className?: string;
}

export default function DocumentUploader({ onUploadSuccess, className = '' }: Props) {
  const router = useRouter();
  const { language } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openFilePicker = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  const pipelineStages = [
    'Parsing document streams & structure...',
    'Running page-aware boundary detection...',
    'Performing PII & sensitive data audit...',
    'Indexing page-aware clauses and source evidence...',
    'Running LegalLens multi-stage AI reasoning audit...'
  ];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // File validation
    const validExtensions = ['.pdf', '.docx', '.txt', '.md'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setErrorMessage('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File exceeds 25MB limit. Please upload a smaller document.');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setProgressPercent(10);
    setPipelineStep(pipelineStages[0]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isDemo', 'false');

      // Progress animation simulation
      const interval = setInterval(() => {
        setProgressPercent(prev => {
          if (prev >= 85) {
            clearInterval(interval);
            return prev;
          }
          const next = prev + 18;
          const stageIdx = Math.min(Math.floor((next / 100) * pipelineStages.length), pipelineStages.length - 1);
          setPipelineStep(pipelineStages[stageIdx]);
          return next;
        });
      }, 400);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload document.');
      }

      setPipelineStep('Running LegalLens multi-stage AI reasoning audit...');
      setProgressPercent(90);

      const analysisRes = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: data.documentId, language }),
      });
      const analysisData = await analysisRes.json();
      if (!analysisRes.ok || !analysisData.success) {
        throw new Error(analysisData.error || 'Document analysis failed.');
      }

      setProgressPercent(100);
      setPipelineStep('Analysis complete! Opening your workspace...');

      setTimeout(() => {
        if (onUploadSuccess) {
          onUploadSuccess(data.documentId);
        } else {
          router.push(`/documents/${data.documentId}`);
        }
      }, 700);

    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during processing.');
      setIsUploading(false);
      setProgressPercent(0);
    }
  };

  const loadSyntheticDemo = (demoId: string) => {
    setIsUploading(true);
    setProgressPercent(40);
    setPipelineStep('Loading synthetic demo document...');
    setTimeout(() => {
      setProgressPercent(100);
      setPipelineStep('Indexed! Opening workspace...');
      setTimeout(() => {
        router.push(`/documents/${demoId}`);
      }, 400);
    }, 600);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Drag and Drop Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={openFilePicker}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-navy-600 bg-navy-50/70 dark:bg-navy-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-navy-500 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
        } ${isUploading ? 'pointer-events-none opacity-90' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {!isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-navy-50 dark:bg-navy-950/80 border border-navy-200 dark:border-navy-800 flex items-center justify-center text-navy-700 dark:text-navy-300 shadow-inner">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-bold text-slate-900 dark:text-white">
                Drag and drop your legal document here
              </p>
              <p className="text-xs text-slate-500">
                Supports PDF, DOCX, TXT up to 25MB • Local PII sanitization enabled
              </p>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openFilePicker();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-navy-800 text-white hover:bg-navy-900 shadow-sm"
            >
              Browse Computer
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-2xl bg-navy-100 dark:bg-navy-900 flex items-center justify-center text-navy-700 dark:text-navy-300 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>

            <div className="space-y-2 w-full max-w-md">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="truncate pr-2">{pipelineStep}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-navy-600 to-navy-800 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Pipeline: Extract → OCR Check → PII Redaction → Chunking → RAG Index → Multi-stage Audit
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
          <div>
            <span className="font-semibold">Upload Error: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Quick Try Demo Preset Bar */}
      <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Try Preloaded Synthetic Demo Documents:</span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">1-Click Instant Load</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => loadSyntheticDemo('demo_emp_v1')}
            className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-navy-500 text-left transition-colors group"
          >
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-navy-600 dark:group-hover:text-navy-400">
                Employment v1 (Offer)
              </div>
              <div className="text-[10px] text-slate-500">30-day notice • ₹5L cap</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => loadSyntheticDemo('demo_emp_v2')}
            className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 text-left transition-colors group"
          >
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600">
                Employment v2 (Critical)
              </div>
              <div className="text-[10px] text-slate-500">90-day notice • ₹50L penalty</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => loadSyntheticDemo('demo_rental_agreement')}
            className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-navy-500 text-left transition-colors group"
          >
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-navy-600 dark:group-hover:text-navy-400">
                Residential Lease
              </div>
              <div className="text-[10px] text-slate-500">6-mo lockin • ₹2.5L deposit</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => loadSyntheticDemo('demo_nda')}
            className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-navy-500 text-left transition-colors group"
          >
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-navy-600 dark:group-hover:text-navy-400">
                Mutual NDA
              </div>
              <div className="text-[10px] text-slate-500">2-yr confidentiality</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
