import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TrustDisclaimer from "@/components/TrustDisclaimer";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "LegalLens — Understand. Compare. Verify. Act.",
  description: "AI-powered legal document understanding, risk audit, comparative analysis, and lawyer preparation assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-navy-700 selection:text-white">
        <I18nProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
        </I18nProvider>
        <TrustDisclaimer variant="banner" />
        <footer className="w-full py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">LegalLens</span>
              <span>— AI-powered legal document understanding and navigation</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/about" className="hover:text-slate-800 dark:hover:text-slate-300">About</a>
              <a href="/how-it-works" className="hover:text-slate-800 dark:hover:text-slate-300">How It Works</a>
              <a href="/security" className="hover:text-slate-800 dark:hover:text-slate-300">Security & Privacy</a>
              <a href="/legal-safety" className="hover:text-slate-800 dark:hover:text-slate-300">Legal Safety</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
