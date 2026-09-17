import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { EmptyState } from '@/components/feedback/EmptyState';

export default function HelpCenter() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const FAQS = [
    { q: 'How do I apply for an ISI Mark Licence?', a: 'You can apply for Scheme-I (ISI Mark) via the Manakonline portal or through the AI Sathi Dossier Builder which will prepare all necessary documentation for your application.' },
    { q: 'What is the difference between Scheme-I and Scheme-II?', a: 'Scheme-I is the traditional ISI Mark licensing which involves factory audits and product testing. Scheme-II is the Compulsory Registration Scheme (CRS) primarily for electronics, which relies on self-declaration backed by test reports from BIS-recognized labs.' },
    { q: 'How long does a NABL test report stay valid?', a: 'Test reports are generally valid for 90 days from the date of issue for the purpose of submitting a new BIS application.' },
    { q: 'Can foreign manufacturers apply for BIS certification?', a: 'Yes, under the Foreign Manufacturers Certification Scheme (FMCS), overseas manufacturers can obtain BIS certification to export products to India.' },
  ];

  return (
    <div className="w-full">
      {/* Header block */}
      <div className="w-full bg-primary py-16">
        <div className="max-w-[1440px] mx-auto px-8 text-center flex flex-col items-center">
          <h1 className="text-headline-lg text-white mb-4">How can we help you?</h1>
          <div className="w-full max-w-2xl flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-4 focus-within:border-white/50 focus-within:bg-white/20 transition-all">
            <span className="material-symbols-outlined text-white/50 text-[24px]">search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides, FAQs, error codes..."
              className="flex-1 bg-transparent text-[16px] text-white placeholder:text-white/50 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-12">
        {query ? (
          <EmptyState icon="search_off" title="No matching articles found" description="Try adjusting your search terms or contact support." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-headline-sm text-primary">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <details key={i} className="group bg-surface rounded-2xl border border-outline-variant/30 shadow-sm open:border-secondary">
                    <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
                      <h3 className="text-[15px] font-semibold text-primary">{faq.q}</h3>
                      <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="px-5 pb-5 pt-0 text-[14px] text-on-surface-variant leading-6 border-t border-surface-container-low mt-2">
                      <div className="pt-4">{faq.a}</div>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 text-center">
                <span className="material-symbols-outlined text-[32px] text-secondary mb-3">support_agent</span>
                <h3 className="text-[16px] font-semibold text-primary mb-2">Need direct support?</h3>
                <p className="text-[13px] text-on-surface-variant mb-4">Our compliance experts are available Monday to Friday, 9am to 6pm IST.</p>
                <button className="w-full px-4 py-2.5 rounded-xl bg-secondary text-white font-medium hover:bg-[#0039b5] transition-colors">
                  Contact Support
                </button>
              </div>
              <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm p-6">
                <h3 className="text-[14px] font-semibold text-primary mb-3">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['ISI Mark', 'CRS Registration', 'Factory Audit', 'Hallmarking', 'Import Customs', 'Penalty'].map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high cursor-pointer transition-colors text-[13px] text-on-surface">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
