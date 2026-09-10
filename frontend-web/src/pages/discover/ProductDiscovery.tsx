import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { TechIdentifier, StatusPill } from '../../components/shared/StatusPill';

const STEPS = [
  { id: 1, title: 'Industry Category', required: true },
  { id: 2, title: 'Environment & Duty', required: true },
  { id: 3, title: 'Material Parameters', required: false },
  { id: 4, title: 'Volume & Market', required: false },
];

const CATEGORIES = [
  { icon: 'devices', label: 'Consumer Electronics', key: 'Electronics & IT' },
  { icon: 'electric_car', label: 'Automotive & EV', key: 'Automotive & EV' },
  { icon: 'local_florist', label: 'Food & Agro', key: 'Agro & Food' },
  { icon: 'foundation', label: 'Building Materials', key: 'Structural Materials' },
  { icon: 'science', label: 'Chemicals', key: 'Chemicals & Polymers' },
  { icon: 'smart_toy', label: 'Toys & Juveniles', key: 'Consumer Toys' },
  { icon: 'medical_services', label: 'Medical Devices', key: 'Medical' },
  { icon: 'solar_power', label: 'Renewable Energy', key: 'Renewable' },
];

const ENVIRONMENTS = [
  { icon: 'home', label: 'Household / Domestic', key: 'Domestic' },
  { icon: 'factory', label: 'Commercial / Plant', key: 'Industrial' },
  { icon: 'medical_services', label: 'Critical / Medical', key: 'Critical' },
];

const MARKETS = [
  { icon: 'storefront', label: 'Domestic Sale', key: 'domestic' },
  { icon: 'local_shipping', label: 'Export Only', key: 'export' },
  { icon: 'public', label: 'Both', key: 'both' },
];

export default function ProductDiscovery() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const setAnswer = (key: string, val: unknown) => setAnswers(prev => ({ ...prev, [key]: val }));
  const getAnswer = (key: string): string | undefined => {
    const value = answers[key];
    return typeof value === 'string' ? value : undefined;
  };

  const goNext = () => {
    if (currentStep < 4) setCurrentStep(s => s + 1);
    else navigate('/discover/results', { state: answers });
  };
  const goBack = () => setCurrentStep(s => Math.max(1, s - 1));
  const skip = () => setCurrentStep(s => Math.min(4, s + 1));

  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
          <span className="material-symbols-outlined text-[15px]">radar</span>
          <span>{t('discover.overline')}</span>
        </div>
        <h1 className="text-headline-lg text-primary tracking-tight">{t('discover.title')}</h1>
        <p className="text-body-md text-on-surface-variant">{t('discover.subtitle')}</p>
      </div>

      {/* Step progress bar */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[13px] font-semibold transition-all ${
                  step.id < currentStep ? 'bg-secondary text-white cursor-pointer hover:bg-[#0039b5]'
                  : step.id === currentStep ? 'bg-primary text-white ring-4 ring-[#dce1ff]'
                  : 'bg-surface-container-high text-on-surface-variant cursor-default'
                }`}
              >
                {step.id < currentStep ? <span className="material-symbols-outlined text-[15px]">check</span> : step.id}
              </button>
              <span className={`hidden sm:block text-[13px] font-medium ${step.id === currentStep ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                {step.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 rounded-full ${step.id < currentStep ? 'bg-secondary' : 'bg-surface-container-high'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main step content */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-outline-variant/30 shadow-sm p-6">
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-headline-sm text-primary flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white font-mono text-[12px] flex items-center justify-center">1</span>
                  {t('discover.step1')}
                </h2>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">{t('discover.required')}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setAnswer('category', cat.key)}
                    className={`p-4 rounded-xl flex flex-col gap-2 items-start text-left transition-all ${
                      getAnswer('category') === cat.key
                        ? 'bg-surface-container-high border-2 border-secondary text-primary'
                        : 'bg-surface-container-low border-2 border-transparent text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]" style={{ color: getAnswer('category') === cat.key ? '#1d4ed8' : undefined }}>{cat.icon}</span>
                    <span className="text-[13px] font-medium leading-4">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-headline-sm text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white font-mono text-[12px] flex items-center justify-center">2</span>
                {t('discover.step2')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ENVIRONMENTS.map(env => (
                  <button
                    key={env.key}
                    onClick={() => setAnswer('environment', env.key)}
                    className={`p-4 rounded-xl flex items-center gap-3 text-left transition-all ${
                      getAnswer('environment') === env.key
                        ? 'bg-surface-container-high border-2 border-secondary text-primary'
                        : 'bg-surface-container-low border-2 border-transparent text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{env.icon}</span>
                    <span className="text-[14px] font-medium">{env.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-headline-sm text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white font-mono text-[12px] flex items-center justify-center">3</span>
                {t('discover.step3')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Lithium-ion cells / Polymer Matrix',
                  'Enclosure Rating: Flame-Retardant ABS',
                  'High Voltage (above 48V AC/DC)',
                  'Integrated Wireless Telemetry (RF)',
                  'Rechargeable Battery Pack',
                  'UL Listed Components',
                ].map((param, i) => (
                  <label key={param} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
                    <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 rounded accent-[#00162d]" />
                    <span className="text-[13px] text-on-surface">{param}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-headline-sm text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white font-mono text-[12px] flex items-center justify-center">4</span>
                Target Market
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MARKETS.map(m => (
                  <button
                    key={m.key}
                    onClick={() => setAnswer('market', m.key)}
                    className={`p-4 rounded-xl flex items-center gap-3 text-left transition-all ${
                      getAnswer('market') === m.key
                        ? 'bg-surface-container-high border-2 border-secondary text-primary'
                        : 'bg-surface-container-low border-2 border-transparent text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{m.icon}</span>
                    <span className="text-[14px] font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-surface-container-low">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-outline-variant/30 text-primary text-[14px] font-medium hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  {t('discover.back')}
                </button>
              )}
              {!STEPS[currentStep - 1].required && (
                <button onClick={skip} className="text-[13px] text-on-surface-variant hover:text-on-surface transition-colors px-2">
                  {t('discover.skip')}
                </button>
              )}
            </div>
            <button
              onClick={goNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-[14px] font-semibold hover:bg-primary-container transition-colors"
            >
              {currentStep === 4 ? t('discover.launch') : t('discover.continue')}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Dynamic resolution card */}
        <div className="lg:col-span-5 bg-primary-container text-white p-6 rounded-2xl shadow-md flex flex-col gap-5 lg:sticky lg:top-36">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#7a93b5]">{t('discover.resolution_title')}</span>
            <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px] text-white/80 animate-pulse">{t('discover.resolution_label')}</span>
          </div>
          {getAnswer('category') ? (
            <div className="space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#7a93b5] mb-1">Selected Category</p>
                <p className="text-white font-semibold">{getAnswer('category') as string}</p>
              </div>
              {getAnswer('environment') && (
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#7a93b5] mb-1">Environment</p>
                  <p className="text-white font-semibold">{getAnswer('environment') as string}</p>
                </div>
              )}
              <div className="p-4 rounded-xl bg-white/10 space-y-2">
                <div className="font-mono text-[12px]">
                  <span className="text-[#7a93b5]">Resolved Mandate: </span>
                  <span className="text-white font-bold">IS 16046 (Part 2):2018</span>
                </div>
                <div className="font-mono text-[12px]">
                  <span className="text-[#7a93b5]">Scheme: </span>
                  <span className="text-white font-bold">Scheme-II (CRS)</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[#7a93b5] text-[14px]">Select your industry category to see the regulatory resolution...</p>
          )}
          <div className="flex items-center gap-2 text-[#7a93b5] font-mono text-[12px]">
            <span className="material-symbols-outlined text-[15px] text-[#b7c4ff]">check_circle</span>
            <span>Dossier Checklist auto-configured upon completion.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
