'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation, type Language } from '@/lib/i18n';
import { 
  Scale, 
  Search, 
  FileText, 
  Layers, 
  HelpCircle, 
  ShieldAlert, 
  CheckSquare, 
  Briefcase, 
  Globe, 
  Plus, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useTranslation();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Layers },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/compare', label: 'Compare', icon: Scale },
    { href: '/ask', label: 'Ask LegalLens', icon: HelpCircle },
    { href: '/risks', label: 'Risk Scanner', icon: ShieldAlert },
    { href: '/action-plan', label: 'Action Plans', icon: CheckSquare },
    { href: '/lawyer-prep', label: 'Lawyer Prep', icon: Briefcase },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 dark:from-navy-600 dark:to-slate-900 flex items-center justify-center text-white shadow-md shadow-navy-900/10 group-hover:scale-105 transition-transform">
              <div className="relative">
                <FileText className="w-5 h-5 text-navy-200" />
                <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">LegalLens</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-navy-100 dark:bg-navy-900/60 text-navy-800 dark:text-navy-300">v2.0</span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider font-medium uppercase hidden sm:block">Explain • Verify • Act</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-navy-50 dark:bg-navy-950 text-navy-900 dark:text-navy-200 border border-navy-200 dark:border-navy-800'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-navy-700 dark:text-navy-300' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="relative flex items-center">
              <label htmlFor="language-select" className="sr-only">Select Language</label>
              <Globe className="w-3.5 h-3.5 absolute left-2 text-slate-400 pointer-events-none" />
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Language selection"
                className="pl-7 pr-2 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-500"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="te">తెలుగు (TE)</option>
              </select>
            </div>

            {/* Quick Upload CTA */}
            <Link
              href="/documents?action=upload"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-navy-100 dark:bg-navy-900 text-navy-900 dark:text-navy-100 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-navy-600 dark:text-navy-400" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/documents?action=upload"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-navy-800 text-white text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Document</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
