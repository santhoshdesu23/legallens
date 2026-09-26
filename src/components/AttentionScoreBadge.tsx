'use client';

import React from 'react';
import { DocumentAttentionScore } from '@/lib/types';
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Props {
  score?: DocumentAttentionScore;
  variant?: 'compact' | 'full' | 'card';
}

export default function AttentionScoreBadge({ score, variant = 'full' }: Props) {
  if (!score) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
        <Info className="w-3.5 h-3.5" />
        <span>Document Attention Score: Pending Analysis</span>
      </div>
    );
  }

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-50 dark:bg-red-950/40',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-300',
          badge: 'bg-red-600 text-white',
          icon: ShieldAlert,
          label: 'CRITICAL ATTENTION REQUIRED'
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-700 dark:text-amber-300',
          badge: 'bg-amber-600 text-white',
          icon: AlertTriangle,
          label: 'HIGH ATTENTION RECOMMENDED'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950/40',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          badge: 'bg-yellow-600 text-white',
          icon: Info,
          label: 'MODERATE ATTENTION'
        };
      default:
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          border: 'border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-700 dark:text-emerald-300',
          badge: 'bg-emerald-600 text-white',
          icon: CheckCircle,
          label: 'STANDARD TERMS / BALANCED'
        };
    }
  };

  const style = getLevelStyles(score.overallLevel);
  const Icon = style.icon;

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${style.bg} ${style.border} ${style.text}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>Attention Level: {score.overallLevel} ({score.overallScore}/100)</span>
      </div>
    );
  }

  const dimensions = [
    { label: 'Financial Exposure', value: score.breakdown.financial },
    { label: 'Termination Asymmetry', value: score.breakdown.termination },
    { label: 'Liability & Indemnity', value: score.breakdown.liability },
    { label: 'Restrictive Covenants', value: score.breakdown.restrictions },
    { label: 'Deadlines & Notice', value: score.breakdown.deadlines },
    { label: 'Dispute Resolution', value: score.breakdown.disputeResolution },
  ];

  return (
    <div className={`p-5 rounded-xl border ${style.bg} ${style.border} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${style.badge} text-white`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Document Attention Score</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                {score.overallLevel} ({score.overallScore}/100)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{score.summary}</p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 bg-white/70 dark:bg-slate-900/70 px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 sm:text-right max-w-xs">
          AI review indicator highlighting risk density. Not a legal validity determination.
        </div>
      </div>

      {/* Breakdown Dimensions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
        {dimensions.map((dim, i) => (
          <div key={i} className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              <span>{dim.label}</span>
              <span className="font-bold text-slate-900 dark:text-white">{dim.value}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  dim.value > 70 ? 'bg-red-500' : dim.value > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${dim.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
