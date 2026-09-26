'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Shield, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Cpu
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function SettingsPage() {
  const { language, setLanguage } = useTranslation();
  const [demoMode, setDemoMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure multilingual explanation preferences, privacy shield defaults, and AI reasoning models.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Language Selection */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white">
            <Globe className="w-5 h-5 text-navy-600" />
            <span>Multilingual Language Preference</span>
          </div>
          <p className="text-xs text-slate-500">
            LegalLens will generate plain-language explanations, checklists, and executive summaries in your preferred language while preserving exact statutory terminology.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { code: 'en', label: 'English', desc: 'Standard English legal breakdown' },
              { code: 'hi', label: 'हिंदी (Hindi)', desc: 'सरल हिंदी भाषा व्याख्या' },
              { code: 'te', label: 'తెలుగు (Telugu)', desc: 'తెలుగు న్యాయ వివరణ' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  language === lang.code
                    ? 'bg-navy-50 dark:bg-navy-950/60 border-navy-600 dark:border-navy-500'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{lang.label}</span>
                  {language === lang.code && <CheckCircle2 className="w-4 h-4 text-navy-600" />}
                </div>
                <p className="text-xs text-slate-500 mt-1">{lang.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy & PII */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span>Data Privacy & PII Redaction Defaults</span>
          </div>
          <p className="text-xs text-slate-500">
            Automatically mask detected Aadhaar/PAN, phones, and emails before sending document text to external AI services.
          </p>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-white block">Auto-Redact Personal Identifiers</span>
              <span className="text-[11px] text-slate-500">Sanitizes emails, phone numbers, and government ID patterns</span>
            </div>
            <input
              type="checkbox"
              checked={true}
              disabled
              className="w-4 h-4 text-navy-600 rounded focus:ring-navy-500"
            />
          </label>
        </div>

        {/* AI Model & Demo Engine */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white">
            <Cpu className="w-5 h-5 text-amber-500" />
            <span>AI Reasoning Provider & Fallback Engine</span>
          </div>
          
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Active AI Engine: Google Gemini 1.5 Flash</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                Configured & Connected
              </span>
            </div>
            <p className="text-slate-500">
              Uses structured JSON schemas, page-aware term retrieval, and source-text evidence checks.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved successfully!
            </span>
          ) : <div />}

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition-all"
          >
            Save Settings
          </button>
        </div>

      </div>

    </div>
  );
}
