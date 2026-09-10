import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TechIdentifier } from '../../components/shared/StatusPill';
import { EmptyState } from '../../components/shared/EmptyState';

export default function SavedItems() {
  const { t } = useLanguage();
  const { savedItems, unsaveItem } = useWorkspace();

  const typeRoute = (type: string) => ({ standard: '/standards', qco: '/qco', lab: '/laboratories', product: '/discover' })[type] ?? '/';

  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-8">
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
          <span className="material-symbols-outlined text-[15px]">bookmark</span>
          <span>Personal Library</span>
        </div>
        <h1 className="text-headline-lg text-primary tracking-tight">{t('nav.saved')}</h1>
        <p className="text-body-md text-on-surface-variant">Standards, QCOs, and labs you have bookmarked.</p>
      </div>

      {savedItems.length === 0 ? (
        <EmptyState
          icon="bookmark_border"
          title="Nothing saved yet"
          description="Bookmark standards, QCOs, and labs from the explorer pages to find them here quickly."
          action={<Link to="/standards" className="px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium">Browse Standards</Link>}
        />
      ) : (
        <div className="space-y-2">
          {savedItems.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-outline-variant/30 shadow-sm hover:border-outline-variant transition-all">
              <span className="material-symbols-outlined text-[24px] text-on-surface-variant">
                {item.type === 'standard' ? 'menu_book' : item.type === 'qco' ? 'gavel' : item.type === 'lab' ? 'science' : 'inventory_2'}
              </span>
              <div className="flex-1 min-w-0">
                <TechIdentifier code={item.label} size="md" />
                <p className="text-[14px] font-medium text-on-surface truncate mt-0.5">{item.title}</p>
                <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">Saved {new Date(item.savedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`${typeRoute(item.type)}/${item.id}`}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary font-mono text-[12px] transition-colors"
                >
                  View
                </Link>
                <button onClick={() => unsaveItem(item.id)} className="p-1.5 rounded-lg hover:bg-[#ffdad6] text-on-surface-variant hover:text-[var(--status-verify-text)] transition-colors">
                  <span className="material-symbols-outlined text-[16px]">bookmark_remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
