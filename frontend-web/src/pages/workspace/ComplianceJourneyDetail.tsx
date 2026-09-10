import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TranslatingText } from '../../components/shared/TranslatingText';
import { EvidenceBadge, EvidenceDrawer } from '../../components/shared/EvidenceBadge';
import mockJourneys from '../../data/complianceJourneys.json';
import type { ComplianceJourney, ComplianceStep, StepStatus } from '../../types/complianceJourney';
import type { Evidence } from '../../types/evidence';

const statusConfig: Record<StepStatus, { color: string; icon: string }> = {
  'Not Started': { color: 'text-on-surface-variant bg-surface-container border-outline-variant/30', icon: 'radio_button_unchecked' },
  'In Progress': { color: 'text-status-pending-spec bg-status-pending-spec/10 border-status-pending-spec/30', icon: 'pending' },
  'Verified': { color: 'text-status-verified bg-status-verified/10 border-status-verified/30', icon: 'verified' },
  'Needs Review': { color: 'text-status-error bg-status-error/10 border-status-error/30', icon: 'error' },
  'Completed': { color: 'text-white bg-primary border-primary', icon: 'check_circle' }
};

export default function ComplianceJourneyDetail() {
  const { id } = useParams<{ id: string }>();
  const journey = (mockJourneys as ComplianceJourney[]).find(j => j.id === id) || mockJourneys[0];
  
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  // Find active step index
  const activeStepIndex = journey.steps.findIndex(s => s.status === 'In Progress' || s.status === 'Needs Review');
  const displayIndex = activeStepIndex >= 0 ? activeStepIndex : journey.steps.length - 1;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-bg-base min-h-[calc(100vh-64px)]">
      {/* Breadcrumb / Header */}
      <div className="mb-8">
        <Link to="/workspace" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-[14px] font-medium mb-4">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <TranslatingText text="Back to Workspace" />
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 bg-surface-container-high rounded text-[11px] font-mono text-on-surface">{journey.id}</span>
              <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[11px] font-bold uppercase tracking-wider">
                <TranslatingText text={journey.currentStage} />
              </span>
            </div>
            <h1 className="text-h1 font-serif-hero text-on-surface">
              <TranslatingText text={journey.productName} />
            </h1>
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all font-medium text-[14px]">
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <TranslatingText text="Add Step Note" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Timeline */}
        <div className="lg:col-span-8">
          <div className="relative border-l-2 border-outline-variant/30 ml-4 sm:ml-6 pb-8 space-y-10">
            {journey.steps.map((step, idx) => {
              const cfg = statusConfig[step.status as StepStatus];
              const isActive = idx === displayIndex;
              
              return (
                <motion.div 
                  key={step.stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-8 sm:pl-10"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-surface ${cfg.color}`}>
                    <span className="material-symbols-outlined text-[16px]">{cfg.icon}</span>
                  </div>

                  {/* Step Card */}
                  <div className={`bg-surface rounded-2xl border transition-all ${isActive ? 'border-primary shadow-[0_8px_24px_rgba(30,75,143,0.12)] ring-1 ring-primary/20' : 'border-outline-variant/30 shadow-sm'}`}>
                    <div className="p-5 sm:p-6 border-b border-outline-variant/30 bg-surface-container-lowest rounded-t-2xl flex justify-between items-center cursor-pointer hover:bg-surface-container transition-colors">
                      <div>
                        <h3 className="text-[16px] sm:text-[18px] font-bold text-on-surface mb-1">
                          <TranslatingText text={step.stage} />
                        </h3>
                        <p className="text-[13px] text-on-surface-variant font-medium">
                          <TranslatingText text={step.status} />
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant">
                        {isActive ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>

                    {/* Step Details (expanded for active/completed) */}
                    {(isActive || step.status === 'Completed' || step.status === 'Verified') && (
                      <div className="p-5 sm:p-6 space-y-6">
                        <p className="text-[15px] leading-relaxed text-on-surface">
                          <TranslatingText text={step.description} />
                        </p>

                        {/* Evidence & Documents */}
                        {(step.evidence.length > 0 || step.documents.length > 0) && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {step.evidence.length > 0 && (
                              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Evidence</h4>
                                <ul className="space-y-3">
                                  {step.evidence.map(ev => (
                                    <li key={ev.id} className="flex flex-col gap-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[13px] font-semibold text-on-surface truncate pr-2">{ev.source}</span>
                                        <EvidenceBadge status={ev.status} onClick={() => setSelectedEvidence(ev as any)} />
                                      </div>
                                      <span className="text-[12px] text-on-surface-variant truncate">{ev.document}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {step.documents.length > 0 && (
                              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Documents</h4>
                                <ul className="space-y-2">
                                  {step.documents.map((doc, i) => (
                                    <li key={i}>
                                      <a href={doc.url} className="flex items-center gap-2 text-[13px] text-primary hover:underline font-medium p-2 hover:bg-primary/5 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">description</span>
                                        <span className="truncate"><TranslatingText text={doc.name} /></span>
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Notes & Next Action */}
                        <div className="space-y-4 pt-2">
                          {step.notes && (
                            <div className="p-4 bg-status-pending-spec/5 border-l-2 border-status-pending-spec rounded-r-lg">
                              <p className="text-[12px] font-bold uppercase tracking-widest text-status-pending-spec mb-1">Notes</p>
                              <p className="text-[14px] text-on-surface"><TranslatingText text={step.notes} /></p>
                            </div>
                          )}
                          {step.nextAction && (
                            <div className="p-4 bg-primary/5 border-l-2 border-primary rounded-r-lg">
                              <p className="text-[12px] font-bold uppercase tracking-widest text-primary mb-1">Next Action</p>
                              <p className="text-[14px] text-on-surface font-medium"><TranslatingText text={step.nextAction} /></p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-surface rounded-2xl border border-outline-variant/30 p-5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-6">
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Journey Progress</h3>
              
              {/* Tricolor Progress Bar */}
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-2 flex">
                <div 
                  className="h-full bg-accent-saffron transition-all duration-1000"
                  style={{ width: `${(displayIndex / (journey.steps.length - 1)) * 33}%` }}
                />
                <div 
                  className="h-full bg-border-strong transition-all duration-1000"
                  style={{ width: `${(displayIndex / (journey.steps.length - 1)) * 34}%` }}
                />
                <div 
                  className="h-full bg-accent-green transition-all duration-1000"
                  style={{ width: `${(displayIndex / (journey.steps.length - 1)) * 33}%` }}
                />
              </div>
              <div className="flex justify-between text-[12px] font-medium text-on-surface-variant">
                <span><TranslatingText text="Start" /></span>
                <span>{Math.round((displayIndex / (journey.steps.length - 1)) * 100)}%</span>
                <span><TranslatingText text="Certification" /></span>
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">quick_reference_all</span>
                <TranslatingText text="Quick Actions" />
              </h3>
              <div className="flex flex-col gap-3">
                <button className="flex items-center gap-3 w-full px-4 py-3 bg-surface-container border border-outline-variant/50 text-on-surface rounded-xl hover:border-primary/40 hover:bg-surface-container-high transition-colors text-[14px] font-medium text-left">
                  <span className="material-symbols-outlined text-[20px]">upload_file</span>
                  <TranslatingText text="Upload Document" />
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-3 bg-surface-container border border-outline-variant/50 text-on-surface rounded-xl hover:border-primary/40 hover:bg-surface-container-high transition-colors text-[14px] font-medium text-left">
                  <span className="material-symbols-outlined text-[20px]">science</span>
                  <TranslatingText text="Find Testing Lab" />
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-3 bg-surface-container border border-outline-variant/50 text-on-surface rounded-xl hover:border-primary/40 hover:bg-surface-container-high transition-colors text-[14px] font-medium text-left">
                  <span className="material-symbols-outlined text-[20px]">contact_support</span>
                  <TranslatingText text="Ask AI Sathi" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EvidenceDrawer
        evidence={selectedEvidence as any}
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}
