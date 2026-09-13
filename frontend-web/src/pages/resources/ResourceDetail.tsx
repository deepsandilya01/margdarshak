import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TranslatingText } from '@/components/common/TranslatingText';
import { formatDate } from '@/utils/formatDate';
import mockResources from '@/data/resources/resources.json';
import type { Resource } from '@/features/resources/types/resource';

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const resource = (mockResources as Resource[]).find(r => r.id === id) || mockResources[0];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-bg-base min-h-[calc(100vh-64px)]">
      {/* Breadcrumb / Back */}
      <div className="mb-6 sm:mb-8">
        <Link to="/resources" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-[14px] font-medium">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <TranslatingText text="Back to Resources Library" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8"
        >
          <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="p-6 sm:p-10 border-b border-outline-variant/30">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-surface-container-high rounded-lg text-[12px] font-bold uppercase tracking-wider text-on-surface">
                  {resource.category}
                </span>
                <span className="text-[13px] text-on-surface-variant font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {formatDate(resource.publishedDate, 'long')}
                </span>
              </div>
              
              <h1 className="text-h1 font-serif-hero text-on-surface mb-6 leading-[1.15]">
                <TranslatingText text={resource.title} />
              </h1>

              <p className="text-[16px] sm:text-[18px] leading-relaxed text-on-surface-variant font-medium">
                <TranslatingText text={resource.summary} />
              </p>
            </div>

            <div className="p-6 sm:p-10 bg-surface-container-lowest">
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-p:text-on-surface prose-p:leading-relaxed whitespace-pre-wrap">
                <TranslatingText text={resource.body} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 space-y-6"
        >
          {/* Actions */}
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-5 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Actions</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => window.print()} className="flex items-center gap-3 w-full px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors text-[14px] font-medium">
                <span className="material-symbols-outlined text-[20px]">print</span>
                <TranslatingText text="Print Resource" />
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3 bg-surface-container border border-outline-variant/50 text-on-surface rounded-xl hover:border-primary/40 transition-colors text-[14px] font-medium">
                <span className="material-symbols-outlined text-[20px]">bookmark_add</span>
                <TranslatingText text="Save to Workspace" />
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3 bg-surface-container border border-outline-variant/50 text-on-surface rounded-xl hover:border-primary/40 transition-colors text-[14px] font-medium">
                <span className="material-symbols-outlined text-[20px]">share</span>
                <TranslatingText text="Share Link" />
              </button>
            </div>
          </div>

          {/* Related Resources */}
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-5 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">library_books</span>
              <TranslatingText text="Related Resources" />
            </h3>
            <div className="flex flex-col gap-4">
              {mockResources.filter(r => r.id !== resource.id).slice(0, 3).map(related => (
                <Link key={related.id} to={`/resources/${related.id}`} className="group block">
                  <span className="text-[11px] font-bold text-primary mb-1 block uppercase tracking-wider">{related.category}</span>
                  <h4 className="text-[14px] font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    <TranslatingText text={related.title} />
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
