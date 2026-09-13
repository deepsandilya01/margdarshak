import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLabs } from '@/features/laboratories/hooks/useLabs';
import { useLanguage } from '@/hooks/useLanguage';
import { TechIdentifier, StatusPill } from '@/components/feedback/StatusPill';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function LabFinder() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterState, setFilterState] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('');
  const { saveItem, unsaveItem, isSaved, addToComparison, isInComparison } = useWorkspace();

  const q = searchParams.get('q') ?? '';
  const standardId = searchParams.get('standardId') ?? '';
  const { labs, states, disciplines } = useLabs({ search: q || undefined, state: filterState || undefined, discipline: filterDiscipline || undefined, standardId: standardId || undefined });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
          <span className="material-symbols-outlined text-[15px]">science</span>
          <span>NABL Accredited Laboratory Network</span>
        </div>
        <h1 className="text-h1 font-serif-hero text-on-surface tracking-tight mt-2 mb-2">{t('labs.title')}</h1>
        <p className="text-body-fluid text-on-surface-variant max-w-3xl">{t('labs.subtitle')}</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-surface border border-outline-variant/30 rounded-xl px-3 py-2 flex-1 md:max-w-md focus-within:border-secondary transition-all">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            type="text"
            defaultValue={q}
            onChange={e => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set('q', e.target.value); else next.delete('q');
              setSearchParams(next);
            }}
            placeholder="Search lab name, accreditation no, city…"
            className="flex-1 bg-transparent text-[14px] text-on-surface placeholder:text-on-surface-variant outline-none min-w-0"
          />
        </div>
        <select
          value={filterState}
          onChange={e => setFilterState(e.target.value)}
          className="px-3 py-2 bg-surface border border-outline-variant/30 rounded-xl text-[14px] text-on-surface outline-none focus:border-secondary transition-colors"
        >
          <option value="">{t('labs.filter_state')}</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterDiscipline}
          onChange={e => setFilterDiscipline(e.target.value)}
          className="px-3 py-2 bg-surface border border-outline-variant/30 rounded-xl text-[14px] text-on-surface outline-none focus:border-secondary transition-colors"
        >
          <option value="">{t('labs.filter_discipline')}</option>
          {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>



      {labs.length === 0 ? (
        <EmptyState icon="science" title="No labs found" description="Try adjusting your search filters." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {labs.map(lab => (
            <div
              key={lab.id}
              className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm p-5 hover:border-outline-variant transition-all cursor-pointer"
              onClick={() => navigate(`/laboratories/${lab.id}`)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <TechIdentifier code={lab.accreditationNumber} size="sm" />
                  <h3 className="text-[15px] font-semibold text-primary mt-1.5">{lab.name}</h3>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">{lab.city}, {lab.state}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusPill status={lab.nablStatus === 'Accredited' ? 'accredited' : 'expired'} size="sm" />
                  <span className="text-[11px] font-mono text-on-surface-variant">{lab.type}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {lab.disciplines.map(d => (
                  <span key={d} className="px-2 py-0.5 rounded-lg bg-surface-container-low font-mono text-[12px] text-on-surface-variant">{d}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {lab.turnaroundDays} {t('labs.days')} turnaround
                </span>
                <span className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">{lab.onlineBooking ? 'check_circle' : 'cancel'}</span>
                  {lab.onlineBooking ? 'Online booking' : 'Phone booking'}
                </span>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-outline-variant/30">
                <button type="button" onClick={e => { e.stopPropagation(); if (isSaved(lab.id)) unsaveItem(lab.id); else saveItem({ id: lab.id, type: 'lab', label: lab.accreditationNumber, title: lab.name }); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant/50 text-[13px] font-medium text-on-surface hover:bg-surface-container-low">
                  <span className="material-symbols-outlined text-[16px]">{isSaved(lab.id) ? 'bookmark' : 'bookmark_border'}</span>
                  {isSaved(lab.id) ? 'Saved' : 'Save'}
                </button>
                <button type="button" onClick={e => { e.stopPropagation(); addToComparison({ id: lab.id, type: 'lab', label: lab.accreditationNumber, title: lab.name, attributes: { City: lab.city, State: lab.state, Type: lab.type, Disciplines: lab.disciplines.join(', '), Turnaround: `${lab.turnaroundDays} days` } }); }} disabled={isInComparison(lab.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant/50 text-[13px] font-medium text-on-surface hover:bg-surface-container-low disabled:opacity-50">
                  <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                  {isInComparison(lab.id) ? 'Added' : 'Compare'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
