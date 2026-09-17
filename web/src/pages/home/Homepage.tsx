import React, { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT as useTranslation } from '@/hooks/useTranslation';
import { useStandards } from '@/features/standards/hooks/useStandards';
import { StatusPill, TechIdentifier } from '@/components/feedback/StatusPill';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** BIS-SATHI Flagship Homepage — faithfully implements Stitch screen 5cecde37... */



const CATEGORIES = [
  { icon: 'devices', label: 'Consumer Electronics', key: 'Electronics & IT' },
  { icon: 'electric_car', label: 'Automotive & EV', key: 'Automotive & EV' },
  { icon: 'local_florist', label: 'Food & Agro', key: 'Agro & Food' },
  { icon: 'foundation', label: 'Building Materials', key: 'Structural Materials' },
  { icon: 'science', label: 'Chemicals', key: 'Chemicals & Polymers' },
  { icon: 'smart_toy', label: 'Toys & Juveniles', key: 'Consumer Toys' },
];

const ENVIRONMENTS = [
  { icon: 'home', label: 'Household / Domestic', key: 'Domestic' },
  { icon: 'factory', label: 'Commercial / Plant', key: 'Industrial' },
  { icon: 'medical_services', label: 'Critical / Medical', key: 'Critical' },
];

const FEATURE_CARDS = [
  { icon: 'dataset', title: 'Standards Intelligence', desc: 'Full-text search across 22,000+ Indian Standards with QCO linkage and lab network mapping.', color: 'var(--primary)' },
  { icon: 'auto_awesome', title: 'AI Sathi Research', desc: 'Ask natural language questions about compliance paths, gazette orders, and testing protocols.', color: 'var(--secondary)' },
  { icon: 'science', title: 'Laboratory Network', desc: 'Find NABL-accredited labs by discipline, state, turnaround time, and testing scope.', color: 'var(--tech-id-text)' },
  { icon: 'space_dashboard', title: 'Compliance Workspace', desc: 'Build audit-ready compliance dossiers with document management and evidence tracking.', color: 'var(--tertiary)' },
];

export default function Homepage() {
  const { t } = useTranslation(['home', 'common']);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Electronics & IT');
  const [selectedEnv, setSelectedEnv] = useState<string | null>('Domestic');
  const { standards } = useStandards();
  
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ── Hero Entrance Sequence (spring physics) ──
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-badge', { y: 24, opacity: 0, duration: 0.55, scale: 0.94 })
      .from('.hero-headline', { y: 36, opacity: 0, duration: 0.65, ease: 'expo.out' }, '-=0.3')
      .from('.tricolor-bar', { scaleX: 0, duration: 0.7, transformOrigin: 'left', ease: 'expo.out' }, '-=0.45')
      .from('.hero-subheading', { y: 22, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.hero-ctas', { y: 22, opacity: 0, duration: 0.5 }, '-=0.35')
      .from('.hero-stat-card', { x: 40, opacity: 0, duration: 0.65, ease: 'expo.out' }, '-=0.5')
      .from('.hero-search', { y: 28, opacity: 0, duration: 0.5 }, '-=0.3');

    // ── Stat bar fill animation (0 → target width) ──
    gsap.utils.toArray<HTMLElement>('.stat-bar-fill').forEach((bar) => {
      const targetW = bar.dataset.width ?? '100%';
      gsap.fromTo(bar,
        { width: '0%' },
        { width: targetW, duration: 1.2, ease: 'expo.out', delay: 0.9 }
      );
    });

    // ── Scroll-triggered: Pipeline nodes stagger in ──
    gsap.from('.journey-node', {
      scrollTrigger: {
        trigger: '.journey-container',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      y: 32,
      opacity: 0,
      stagger: 0.07,
      duration: 0.55,
      ease: 'power2.out',
    });

    // ── Scroll-triggered: Section headings slide up ──
    gsap.utils.toArray<HTMLElement>('.section-reveal').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        y: 28,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    });

    // ── Scroll-triggered: Feature cards stagger ──
    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: '.feature-cards-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
    });

  }, { scope: container });


  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(`/standards?q=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, navigate]);

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden" ref={container}>

      {/* ════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════ */}
      <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-10 flex flex-col gap-6 md:gap-10 overflow-hidden">
        {/* Ambient glows for the new Tricolour Semantic Theme */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-fixed opacity-20 blur-[100px] pointer-events-none" />
        <div className="absolute top-48 -left-20 w-80 h-80 rounded-full bg-tertiary-fixed opacity-20 blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-10 xl:gap-12 relative z-10">
          {/* Left — headline */}
          <div className="flex flex-col gap-4 min-w-0">
            {/* Overline badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-primary text-[11px] font-semibold uppercase tracking-widest w-fit border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-dot" />
              <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
              <span>{t('hero.overline')}</span>
            </div>

            {/* H1 — Headline */}
            <h1 className="hero-headline text-hero font-serif-hero text-on-surface tracking-tight">
              {t('hero.headline')}
            </h1>

            <div className="h-1.5 tricolor-bar max-w-sm mb-2" />

            {/* Subheading */}
            <p className="hero-subheading text-body-fluid text-on-surface-variant max-w-2xl">
              {t('hero.subheading')}
            </p>

            {/* CTAs */}
            <div className="hero-ctas flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/standards"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-on-primary text-[16px] font-semibold hover:brightness-110 transition-all shadow-md"
              >
                <span>{t('hero.cta_standards')}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <Link
                to="/ai-sathi"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-surface-container-lowest text-primary text-[16px] font-semibold hover:bg-surface-container-low transition-all shadow-sm border border-outline-variant"
              >
                <span className="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
                <span>{t('hero.cta_ai')}</span>
              </Link>
            </div>

            <div className="hero-trust-strip flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-secondary">check</span>22,481 Standards Indexed</span>
              <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-secondary">check</span>1,486 QCO Mandates</span>
              <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-secondary">check</span>Source-backed Citations</span>
            </div>
          </div>

          {/* Right — Statutory Concordance metric card */}
          <div className="hero-stat-card glossy-card flex flex-col gap-6 p-8 rounded-2xl justify-between relative w-full min-w-0 h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Statutory Concordance</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-mono text-[10px] font-bold tracking-wider shrink-0 ml-2"><span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-dot" />LIVE SYNC</span>
            </div>
            <div className="flex flex-col gap-5 flex-1 justify-center">
              {[
                { label: 'Indexed Standards', value: '22,481', pct: 100, color: 'var(--primary)' },
                { label: 'Active QCO Mandates', value: '1,486', pct: 84, color: 'var(--secondary)' },
                { label: 'NABL Labs Mapped', value: '824', pct: 62, color: 'var(--tertiary)' },
              ].map(({ label, value, pct, color }, index) => (
                <div key={label} className={index > 0 ? 'border-t border-surface-container pt-5' : ''}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-on-surface">{label}</span>
                    <span className="font-mono font-bold text-[14px]" style={{ color }}>{value}</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                    <div
                      className="stat-bar-fill h-full rounded-full"
                      data-width={`${pct}%`}
                      style={{ backgroundColor: color, boxShadow: `2px 0 6px -1px ${color}` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 mt-auto border-t border-surface-container flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Gazette Vol. 2025/11
              </span>
              <span>Verified 12m ago</span>
            </div>
          </div>
        </div>

        {/* Universal Search Console */}
        <div className="hero-search glossy-card flex flex-col gap-3 w-full p-5 rounded-2xl mt-4 md:mt-6 mb-4 md:mb-8 relative overflow-hidden">
          <div className="flex items-center gap-3 bg-surface-container-lowest rounded-xl px-5 py-3.5 focus-within:bg-surface-container-lowest transition-colors border border-outline-variant/50 focus-within:border-secondary focus-within:shadow-[0_0_0_3px_var(--color-secondary-fixed)]">
            <span className="material-symbols-outlined text-primary text-[24px] shrink-0">manage_search</span>
            <input
              id="universal-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKey}
              className="bg-transparent w-full text-primary placeholder:text-on-surface-variant focus:outline-none text-[15px] font-medium"
              placeholder={t('search.placeholder')}
            />
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <kbd className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-mono text-[11px] rounded shadow-sm border border-outline-variant">Ctrl + K</kbd>
              <button
                onClick={handleSearch}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary text-[14px] font-semibold hover:brightness-110 transition-colors shadow-sm"
              >
                {t('search.btn')}
              </button>
            </div>
          </div>
          {/* Quick suggestion chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mr-1">{t('search.popular')}</span>
            {[
              { label: 'Electric Vehicles (IS 17017)', icon: 'electric_bolt', q: 'IS 17017' },
              { label: 'Packaged Drinking Water', icon: 'water_drop', q: 'IS 14543' },
              { label: 'Solar Inverters', icon: 'solar_power', q: 'solar' },
              { label: 'Medical Devices', icon: 'medical_services', q: 'medical' },
              { label: 'Toys (Safety QCO)', icon: 'smart_toy', q: 'IS 9873' },
              { label: 'Gold Jewelry (Hallmark)', icon: 'diamond', q: 'hallmark' },
            ].map(chip => (
              <button
                key={chip.q}
                onClick={() => setSearchQuery(chip.q)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-mono text-[12px] transition-colors border border-transparent hover:border-outline-variant"
              >
                <span className="material-symbols-outlined text-[14px] text-secondary">{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          SECTION 2 — STATUTORY PIPELINE
      ════════════════════════════════════════ */}
      <section className="w-full bg-surface-container-low py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col gap-5">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
                <span className="material-symbols-outlined text-[15px]">account_tree</span>
                <span>Statutory Lineage Architecture</span>
              </div>
              <h2 className="section-reveal text-h1 font-serif-hero text-on-surface tracking-tight mt-2 mb-2">Product-to-Audit Statutory Pipeline</h2>
              <p className="text-body-fluid text-on-surface-variant max-w-xl">Every manufacturing input resolves systematically into gazetted testing mandates, lab execution scopes, and certification licensing.</p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[12px] bg-surface px-3 py-2 rounded-xl border border-outline-variant/30 shadow-sm shrink-0">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-on-surface">Archetype: EV Battery Energy Storage Pack</span>
            </div>
          </div>

          {/* Horizontal stepper pipeline */}
          <div className="journey-container bg-surface rounded-2xl border border-outline-variant/30 shadow-sm px-4 py-4 overflow-x-auto">
            <div className="flex items-start w-max min-w-full pb-2 md:pb-0">

              {/* NODE 01 */}
              <div className="journey-node flex flex-col items-center gap-2 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center bg-surface shadow-sm shrink-0 z-10" style={{ borderColor: 'var(--primary)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--primary)' }}>inventory_2</span>
                </div>
                <div className="flex flex-col items-center text-center gap-0.5">
                  <span className="font-mono text-[8px] text-on-surface-variant uppercase tracking-wider leading-tight">Input Product</span>
                  <span className="text-[11px] font-bold text-on-surface leading-tight">Li-Ion Pack</span>
                  <span className="font-mono text-[8px] leading-tight" style={{ color: 'var(--primary)' }}>Class M1/N1</span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex items-center shrink-0 w-6 mt-5">
                <div className="h-[2px] flex-1" style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
                <span className="material-symbols-outlined text-[12px] -ml-0.5 shrink-0" style={{ color: 'var(--secondary)' }}>chevron_right</span>
              </div>

              {/* NODE 02 */}
              <div className="journey-node flex flex-col items-center gap-2 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center bg-surface shadow-sm shrink-0 z-10" style={{ borderColor: 'var(--secondary)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--secondary)' }}>menu_book</span>
                </div>
                <div className="flex flex-col items-center text-center gap-0.5">
                  <span className="font-mono text-[8px] text-on-surface-variant uppercase tracking-wider leading-tight">Standard Ref</span>
                  <span className="text-[11px] font-bold text-on-surface leading-tight">IS 16046-2</span>
                  <span className="font-mono text-[8px] leading-tight" style={{ color: 'var(--secondary)' }}>Edition 2018</span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex items-center shrink-0 w-6 mt-5">
                <div className="h-[2px] flex-1" style={{ background: 'linear-gradient(90deg, var(--secondary), var(--primary))' }} />
                <span className="material-symbols-outlined text-[12px] -ml-0.5 shrink-0" style={{ color: 'var(--primary)' }}>chevron_right</span>
              </div>

              {/* NODE 03 */}
              <div className="journey-node flex flex-col items-center gap-2 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center bg-surface shadow-sm shrink-0 z-10" style={{ borderColor: 'var(--primary)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--primary)' }}>rule</span>
                </div>
                <div className="flex flex-col items-center text-center gap-0.5">
                  <span className="font-mono text-[8px] text-on-surface-variant uppercase tracking-wider leading-tight">Applicability</span>
                  <span className="text-[11px] font-bold text-on-surface leading-tight">Mandatory</span>
                  <span className="font-mono text-[8px] leading-tight" style={{ color: 'var(--primary)' }}>100% Commercial</span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex items-center shrink-0 w-6 mt-5">
                <div className="h-[2px] flex-1" style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
                <span className="material-symbols-outlined text-[12px] -ml-0.5 shrink-0" style={{ color: 'var(--secondary)' }}>chevron_right</span>
              </div>

              {/* NODE 04 */}
              <div className="journey-node flex flex-col items-center gap-2 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center bg-surface shadow-sm shrink-0 z-10" style={{ borderColor: 'var(--secondary)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--secondary)' }}>gavel</span>
                </div>
                <div className="flex flex-col items-center text-center gap-0.5">
                  <span className="font-mono text-[8px] text-on-surface-variant uppercase tracking-wider leading-tight">QCO Order</span>
                  <span className="text-[11px] font-bold text-on-surface leading-tight">MeitY CRO</span>
                  <span className="font-mono text-[8px] leading-tight" style={{ color: 'var(--secondary)' }}>Phase V</span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex items-center shrink-0 w-6 mt-5">
                <div className="h-[2px] flex-1" style={{ background: 'linear-gradient(90deg, var(--secondary), var(--primary))' }} />
                <span className="material-symbols-outlined text-[12px] -ml-0.5 shrink-0" style={{ color: 'var(--primary)' }}>chevron_right</span>
              </div>

              {/* NODE 05 */}
              <div className="journey-node flex flex-col items-center gap-2 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center bg-surface shadow-sm shrink-0 z-10" style={{ borderColor: 'var(--primary)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--primary)' }}>biotech</span>
                </div>
                <div className="flex flex-col items-center text-center gap-0.5">
                  <span className="font-mono text-[8px] text-on-surface-variant uppercase tracking-wider leading-tight">Testing Scope</span>
                  <span className="text-[11px] font-bold text-on-surface leading-tight">12 Protocols</span>
                  <span className="font-mono text-[8px] leading-tight" style={{ color: 'var(--primary)' }}>Thermal</span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex items-center shrink-0 w-6 mt-5">
                <div className="h-[2px] flex-1" style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
                <span className="material-symbols-outlined text-[12px] -ml-0.5 shrink-0" style={{ color: 'var(--secondary)' }}>chevron_right</span>
              </div>

              {/* NODE 06 */}
              <div className="journey-node flex flex-col items-center gap-2 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center bg-surface shadow-sm shrink-0 z-10" style={{ borderColor: 'var(--secondary)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--secondary)' }}>science</span>
                </div>
                <div className="flex flex-col items-center text-center gap-0.5">
                  <span className="font-mono text-[8px] text-on-surface-variant uppercase tracking-wider leading-tight">NABL Labs</span>
                  <span className="text-[11px] font-bold text-on-surface leading-tight">14 Centers</span>
                  <span className="font-mono text-[8px] leading-tight" style={{ color: 'var(--secondary)' }}>Queue &lt; 21d</span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex items-center shrink-0 w-6 mt-5">
                <div className="h-[2px] flex-1" style={{ background: 'linear-gradient(90deg, var(--secondary), var(--primary))' }} />
                <span className="material-symbols-outlined text-[12px] -ml-0.5 shrink-0" style={{ color: 'var(--primary)' }}>chevron_right</span>
              </div>

              {/* NODE 07 */}
              <div className="journey-node flex flex-col items-center gap-2 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center bg-surface shadow-sm shrink-0 z-10" style={{ borderColor: 'var(--primary)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--primary)' }}>badge</span>
                </div>
                <div className="flex flex-col items-center text-center gap-0.5">
                  <span className="font-mono text-[8px] text-on-surface-variant uppercase tracking-wider leading-tight">Certification</span>
                  <span className="text-[11px] font-bold text-on-surface leading-tight">CRS Reg.</span>
                  <span className="font-mono text-[8px] leading-tight" style={{ color: 'var(--primary)' }}>Scheme II</span>
                </div>
              </div>

              {/* Connector to OUTPUT */}
              <div className="flex items-center shrink-0 w-6 mt-5">
                <div className="h-[2px] flex-1" style={{ background: 'linear-gradient(90deg, var(--primary), var(--tertiary))' }} />
                <span className="material-symbols-outlined text-[12px] -ml-0.5 shrink-0" style={{ color: 'var(--tertiary)' }}>chevron_right</span>
              </div>

              {/* OUTPUT — green terminal node */}
              <div className="journey-node flex flex-col items-center gap-2 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-md shrink-0 z-10" style={{ backgroundColor: 'var(--tertiary)' }}>
                  <span className="material-symbols-outlined text-[18px] text-white">verified</span>
                </div>
                <div className="flex flex-col items-center text-center gap-0.5">
                  <span className="font-mono text-[8px] uppercase tracking-wider font-bold leading-tight" style={{ color: 'var(--tertiary)' }}>Output</span>
                  <span className="text-[11px] font-bold text-on-surface leading-tight">Conforming</span>
                  <span className="font-mono text-[8px] text-on-surface-variant leading-tight">Gazette Valid</span>
                </div>
              </div>

            </div>
          </div>

          {/* Context card */}
          <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[32px]">battery_charging_full</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-[14px] text-primary">Industrial Lithium Secondary Cells and Batteries</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[11px] text-primary">HS Code 8507.60</span>
                </div>
                <p className="text-[13px] text-on-surface-variant max-w-2xl">Applicable under Section 16 of the Bureau of Indian Standards Act 2016 for secondary cells and batteries containing alkaline or other non-acid electrolytes.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Concordance Score</span>
                <span className="font-mono font-bold text-[14px] text-secondary">99.8% Match</span>
              </div>
              <Link
                to="/standards/IS-16046-P2-2018"
                className="px-4 py-2 bg-surface-container-low hover:bg-surface-container-high text-primary rounded-xl text-[13px] font-semibold transition-colors flex items-center gap-2"
              >
                <span>Explore Lineage Graph</span>
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3 — PRODUCT DISCOVERY WIDGET
      ════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 flex flex-col gap-8">
        <div className="flex flex-col gap-1 max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
            <span className="material-symbols-outlined text-[15px]">radar</span>
            <span>{t('discover.overline')}</span>
          </div>
          <h2 className="section-reveal text-h1 font-serif-hero text-on-surface tracking-tight mt-2 mb-2">{t('discover.title')}</h2>
          <p className="text-body-fluid text-on-surface-variant">{t('discover.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Steps panel */}
          <div className="lg:col-span-7 bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-6">
            {/* Step 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-[16px] font-semibold text-primary flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white font-mono text-[12px] flex items-center justify-center">1</span>
                  <span>{t('discover.step1')}</span>
                </label>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">{t('discover.required')}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`p-3 rounded-xl flex flex-col gap-1.5 items-start text-left transition-all text-[13px] font-medium ${
                      selectedCategory === cat.key
                        ? 'bg-surface-container-high text-primary border border-secondary font-semibold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ color: selectedCategory === cat.key ? '#1d4ed8' : undefined }}>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-3">
              <label className="text-[16px] font-semibold text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white font-mono text-[12px] flex items-center justify-center">2</span>
                <span>{t('discover.step2')}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ENVIRONMENTS.map(env => (
                  <button
                    key={env.key}
                    onClick={() => setSelectedEnv(env.key)}
                    className={`p-3 rounded-xl flex items-center gap-2 text-left transition-all text-[13px] font-medium ${
                      selectedEnv === env.key
                        ? 'bg-surface-container-high text-primary border border-secondary font-semibold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ color: selectedEnv === env.key ? '#1d4ed8' : undefined }}>{env.icon}</span>
                    <span>{env.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-3">
              <label className="text-[16px] font-semibold text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white font-mono text-[12px] flex items-center justify-center">3</span>
                <span>{t('discover.step3')}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Lithium-ion cells / Polymer Matrix',
                  'Enclosure Rating: Flame-Retardant ABS',
                  'High Voltage (above 48V AC/DC)',
                  'Integrated Wireless Telemetry (RF)',
                ].map((param, i) => (
                  <label key={param} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked={i !== 2}
                      className="w-4 h-4 rounded accent-[#00162d]"
                    />
                    <span className="text-[13px] text-on-surface">{param}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time resolution card */}
          <div className="lg:col-span-5 p-6 rounded-2xl shadow-md flex flex-col justify-between gap-6 lg:sticky lg:top-36" style={{ background: '#17161A' }}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">{t('discover.resolution_title')}</span>
                <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px] text-white/70">{t('discover.resolution_label')}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">{t('discover.resolved_mandate')}</span>
                <h3 className="text-headline-md text-white font-bold">IS 16046 (Part 2) : 2018</h3>
                <p className="text-[13px] text-white/60">Secondary cells and batteries containing alkaline or other non-acid electrolytes — Portable sealed secondary lithium cells and batteries.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.07] space-y-2">
                {[
                  ['Mandatory Order:', 'MeitY CRO Phase V'],
                  ['Scheme Architecture:', 'Scheme-II (CRS Registration)'],
                  ['Applicable Test Protocols:', '4 Clauses Triggered'],
                  ['Testing Window:', '15-28 Calendar Days'],
                ].map(([key, val]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between font-mono text-[12px] gap-1 sm:gap-0">
                    <span className="text-white/50">{key}</span>
                    <span className="text-white font-bold">{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-white/50 font-mono text-[12px]">
                <span className="material-symbols-outlined text-[15px] text-tertiary">check_circle</span>
                <span>Dossier Checklist automatically configured for upload.</span>
              </div>
            </div>
            <Link
              to="/discover"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary text-[16px] font-semibold hover:brightness-110 transition-colors shadow-sm"
            >
              <span>{t('discover.launch')}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 4 — STANDARDS REGISTRY PREVIEW
      ════════════════════════════════════════ */}
      <section className="w-full bg-surface-container-low py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
                <span className="material-symbols-outlined text-[15px]">dataset</span>
                <span>Indian Standards Registry v2025</span>
              </div>
              <h2 className="section-reveal text-h1 font-serif-hero text-on-surface tracking-tight mt-2 mb-2">Curated Technical Standards Registry</h2>
              <p className="text-body-fluid text-on-surface-variant max-w-xl">Searchable statutory baseline covering active Quality Control Orders (QCOs) and Compulsory Registration Schemes (CRS).</p>
            </div>
            <div className="flex flex-wrap items-center gap-1 bg-surface p-1 rounded-xl border border-outline-variant/30 shadow-sm">
              {[
                { label: t('standards.filter_all'), active: true },
                { label: t('standards.filter_mandatory') },
                { label: t('standards.filter_electro') },
                { label: t('standards.filter_mechanical') },
                { label: t('standards.filter_civil') },
              ].map(({ label, active }) => (
                <button
                  key={label}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                    active ? 'bg-primary text-white font-semibold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Standards table */}
          <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  {[
                    t('standards.identifier'),
                    t('standards.title_col'),
                    t('standards.division'),
                    t('standards.legal_status'),
                    t('standards.lab_network'),
                    t('standards.actions'),
                  ].map((h, i) => (
                    <th key={h} className={`py-3 px-5 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant ${i === 5 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {standards.slice(0, 5).map(s => (
                  <tr key={s.id} className="hover:bg-background transition-colors border-b border-surface-container-low last:border-0">
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${s.status === 'mandatory_qco' ? 'bg-secondary' : s.status === 'superseded' ? 'bg-[#ba1a1a]' : 'bg-[var(--status-compliant-dot)]'}`} />
                        <TechIdentifier code={s.code} size="md" onClick={() => navigate(`/standards/${s.id}`)} />
                      </div>
                      {s.concordance && (
                        <span className="font-mono text-[11px] text-on-surface-variant mt-0.5 block">Concordance: {s.concordance}</span>
                      )}
                    </td>
                    <td className="py-4 px-5 max-w-xs">
                      <span className="text-[15px] font-semibold text-primary block leading-5">{s.shortTitle}</span>
                      <span className="text-[12px] text-on-surface-variant line-clamp-1">{s.description.slice(0, 80)}…</span>
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[12px] text-on-surface-variant">{s.division}</span>
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <StatusPill status={s.status} size="sm" />
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="font-mono text-[12px] text-primary font-medium">{s.accreditedLabs} Accredited Labs</span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          to={`/standards/${s.id}`}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary font-mono text-[12px] transition-colors"
                        >
                          {t('standards.view_scope')}
                        </Link>
                        <button className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors" title="Bookmark">
                          <span className="material-symbols-outlined text-[17px]">bookmark_border</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center">
            <Link
              to="/standards"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-outline-variant/30 bg-surface text-primary text-[14px] font-semibold hover:bg-surface-container-low transition-colors shadow-sm"
            >
              <span>{t('common.view_all')} — 22,481 Standards</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 4b — EVIDENCE / TRUST CARDS
      ════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10">
        <div className="flex flex-col gap-2 max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>Zero Hallucination Guarantee</span>
          </div>
          <h2 className="section-reveal text-h1 font-serif-hero text-on-surface tracking-tight mt-2 mb-2">
            Every insight anchored in{' '}
            <em className="not-italic text-primary">verifiable source context</em>
          </h2>
          <p className="text-body-fluid text-on-surface-variant max-w-xl">
            Regulatory intelligence is only as dependable as its legal foundation. BIS-SATHI provides tamper-evident statutory tracking for every clause.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {([
            {
              badge: 'Gazette Verified',
              badgeColor: 'text-secondary bg-secondary-fixed',
              icon: 'gavel',
              title: 'Official Gazette Orders',
              desc: 'Linked to Gazette of India CS-OL-15/2023. Authenticated by Ministry of Commerce legislative repository.',
              meta: [['Section:', 'Sec 3.1 CL. 8'], ['Enacted:', '15 Feb 2021']],
            },
            {
              badge: 'Source-Backed',
              badgeColor: 'text-secondary bg-secondary-fixed',
              icon: 'article',
              title: 'Standards Revision Notice',
              desc: 'Amendment 2 to IS 1293/2018 captured with tracked redlines. Harmonized testing modifications updated across all labs.',
              meta: [['BIS Notif:', 'BIS Notif 40 48'], ['Effective:', 'Immediately']],
            },
            {
              badge: 'NABL Accredited',
              badgeColor: 'text-secondary bg-secondary-fixed',
              icon: 'science',
              title: 'Laboratory Scope Tracking',
              desc: 'National Accreditation Board for Testing Laboratories (NABL), valid scope TC-8102 for high voltage safety evaluation.',
              meta: [['Certificate:', 'TC-8102-Cap36'], ['Coverage:', '1685 Clauses']],
            },
            {
              badge: 'Critical Window',
              badgeColor: 'text-error bg-error-container',
              icon: 'warning',
              title: 'QCO Transition Window',
              desc: 'DPFT notification CG-410S grace period expires in 45 days. Manufacturing without valid ISI mark prohibits dispatch.',
              meta: [['Expires:', '31 Dec 2025'], ['Penal Code:', 'BIS Act Sec 24']],
            },
          ] as Array<{ badge: string; badgeColor: string; icon: string; title: string; desc: string; meta: [string, string][] }>).map((card) => (
            <div
              key={card.title}
              className="glossy-card bg-surface flex flex-col gap-4 p-5 rounded-2xl border border-outline-variant/30 shadow-sm"
            >
              {/* Top row: icon left, badge right */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                </div>
                <span className={`px-2 py-1 rounded font-mono text-[9px] font-bold uppercase tracking-wider shrink-0 ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
              {/* Title + desc */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-[15px] font-semibold text-on-surface leading-tight">{card.title}</h3>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">{card.desc}</p>
              </div>
              {/* Metadata rows pinned to bottom */}
              <div className="flex flex-col gap-1 pt-3 border-t border-surface-container mt-auto">
                {card.meta.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-on-surface-variant">{label}</span>
                    <span className="font-bold text-on-surface">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 5 — FEATURE CAPABILITY GRID
      ════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-24 lg:pb-32">
        <div className="flex flex-col gap-2 max-w-2xl mb-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
            <span className="material-symbols-outlined text-[15px]">apps</span>
            <span>Platform Capabilities</span>
          </div>
          <h2 className="section-reveal text-h1 font-serif-hero text-on-surface tracking-tight mt-1 mb-0">Built for India's Regulatory Ecosystem</h2>
        </div>
        <div className="feature-cards-grid grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {FEATURE_CARDS.map((card, index) => (
            <div
              key={card.title}
              className="feature-card group relative h-full overflow-hidden flex items-start gap-4 bg-surface p-5 lg:p-6 rounded-lg border border-outline-variant/40 border-l-4 shadow-[0_5px_18px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-1 hover:bg-surface-container-lowest hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
              style={{ borderLeftColor: card.color }}
            >
              <div className="pointer-events-none absolute right-5 top-4 font-mono text-[10px] font-bold tracking-[0.18em] text-on-surface-variant/50">
                NODE 0{index + 1}
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105"
                style={{ backgroundColor: card.color }}
              >
                <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
              </div>
              <div className="flex flex-col flex-1">
                <div className="mb-1.5 flex items-center gap-2 pr-16 font-mono text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: card.color }}>
                  <span className="h-px w-5 bg-current" />
                  <span>{index === 0 ? 'Discover' : index === 1 ? 'Reason' : index === 2 ? 'Validate' : 'Execute'}</span>
                </div>
                <h3 className="text-[17px] font-semibold text-primary mb-1.5 leading-tight">{card.title}</h3>
                <p className="text-[14px] text-on-surface-variant leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 6 — AI SATHI PROMO
      ════════════════════════════════════════ */}
      <section className="w-full pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-24" style={{ background: '#17161A' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-xl">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/50">
              <span className="material-symbols-outlined text-[15px] text-secondary">auto_awesome</span>
              <span>Intelligent Research Assistant</span>
            </div>
            <h2 className="text-h1 font-serif-hero text-white tracking-tight mt-2 mb-2">AI Sathi — Your BIS Compliance Research Partner</h2>
            <p className="text-body-fluid text-white/60">
              Ask natural language questions like "What labs can test IS 1293 in Maharashtra?" or "What's the penalty for non-compliance with the Toys QCO?" — AI Sathi synthesizes answers from indexed BIS data.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/ai-sathi"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary text-[14px] font-semibold hover:brightness-110 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>Launch AI Sathi</span>
              </Link>
              <Link
                to="/ai-sathi/history"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white text-[14px] font-medium hover:bg-white/20 transition-colors border border-white/10"
              >
                <span>Research History</span>
              </Link>
            </div>
          </div>
          {/* Mock AI chat preview */}
          <div className="w-full lg:w-96 bg-white/[0.07] rounded-2xl p-5 border border-white/10 space-y-3">
            {[
              { role: 'user', text: 'What is the penalty for selling non-ISI toys?' },
              { role: 'ai', text: 'Under BIS Act 2016 Section 17, selling toys without ISI mark carries imprisonment up to 2 years or fine up to ₹2 lakhs for first offence.' },
              { role: 'user', text: 'Which labs can test IS 9873 in Chennai?' },
              { role: 'ai', text: 'NABL-TC-6671 (WTCSTC, Mumbai) and 3 more accredited labs offer IS 9873 testing — closest to Chennai: 450km away.' },
            ].map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-white text-[14px]">auto_awesome</span>
                  </div>
                )}
                <div className={`max-w-xs px-3 py-2 rounded-xl text-[12px] leading-5 ${msg.role === 'ai' ? 'bg-white/[0.12] text-white' : 'bg-secondary text-on-secondary'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 bg-white/[0.07] rounded-lg px-3 py-2 text-[12px] text-white/40">Ask a compliance question…</div>
              <button className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:brightness-110 transition-colors">
                <span className="material-symbols-outlined text-on-primary text-[16px]">send</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* ════════════════════════════════════════
          CTA BANNER (Bottom)
      ════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-10 mt-9">
        <div className="w-full bg-surface-container-highest rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl border border-outline-variant/20">
          {/* Background watermark pattern */}
          <div className="absolute -right-20 -top-20 w-[400px] h-[400px] opacity-[0.03] pointer-events-none">
            <span className="material-symbols-outlined text-[400px] text-on-surface">verified</span>
          </div>

          <div className="flex flex-col gap-5 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surface text-on-surface-variant text-[10px] font-bold uppercase tracking-widest w-fit border border-outline-variant/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              NATIONAL QUALITY ARCHITECTURE 2025
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif-hero text-on-surface tracking-tight leading-tight">
              Start with your product.<br />
              Let BIS-SATHI guide the way.
            </h2>
            
            <p className="text-on-surface-variant text-[15px] leading-relaxed max-w-xl">
              Whether you are an enterprise manufacturer, an agile hardware startup, or an international brand importing into India, secure statutory certainty with verifiable compliance intelligence.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-2 text-on-surface-variant text-[13px] font-medium">
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-secondary">check</span> 22,480+ Standards Indexed</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-secondary">check</span> 1,480+ QCO Mandates</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-secondary">check</span> 100% Traceable Citations</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto z-10 shrink-0">
            <Link to="/discover" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-on-primary rounded-lg font-semibold text-[14px] hover:brightness-110 transition-colors shadow-lg whitespace-nowrap">
              Start Product Discovery Flow
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-surface text-on-surface rounded-lg font-semibold text-[14px] hover:bg-surface-container-low transition-colors border border-outline-variant/30 whitespace-nowrap shadow-sm">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              Book Officer Consultation / Helpdesk
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
