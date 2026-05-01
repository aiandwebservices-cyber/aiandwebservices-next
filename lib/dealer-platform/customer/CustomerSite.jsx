'use client';
/**
 * CustomerSite — thin shell that composes the dealer customer-facing site.
 *
 * Responsibilities:
 *   1. Provide CustomerConfigContext to all section components
 *   2. Hold the cross-section state (theme, language, saved vehicles,
 *      price alerts, recently viewed, drawer/modal toggles, body type
 *      filter, sort, accessibility)
 *   3. Compose extracted sections in order, gated by config.features
 *   4. Apply per-page CSS (animations, accessibility overrides, responsive)
 *
 * The actual section bodies live in sibling files under
 * lib/dealer-platform/customer/. Each section reads dealer values
 * (name/phone/address/colors) from CustomerConfigContext via
 * useCustomerConfig().
 */
import { useEffect, useState } from 'react';
import { defaultConfig } from '@/lib/dealer-platform/config/default-config';
import { CustomerConfigContext } from './CustomerConfigContext';
import { C, THEMES, FONT_BODY } from './_internals';
import { CustomerSiteStyles } from './CustomerSiteStyles';
import { DealerBanner }       from './DealerBanner';

import { SideRail }            from './NavBar';
import { Ticker }              from './Ticker';
import { TextUsButton }        from './TextUsButton';
import { Hero }                from './Hero';
import { BodyTypePicker }      from './BodyTypePicker';
import { Fleet }               from './InventoryGrid';
import { DetailDrawer }        from './VehicleDetailDrawer';
import { TradeIn }             from './TradeInEstimator';
import { Finance }             from './FinancePreApproval';
import { Charter }             from './Charter';
import { Process }             from './HowItWorks';
import { Voices }              from './Reviews';
import { Alerts }              from './InventoryAlerts';
import { Notebook }            from './Notebook';
import { Contact }             from './LocationContact';
import { Footer }              from './Footer';
import { MobileCallButton }    from './MobileCallButton';
import { BeatPriceBadge, BeatPriceModal } from './PriceMatchBadge';
import { AIChatWidget }        from './ChatWidget';
import { CompareModal }        from './ComparisonTool';
import { SavedPanel }          from './SavedVehicles';
import { DealWizard }          from './BuildYourDeal';
import { CountersBlock }       from './SocialProofCounters';
import { WhyPreOwned }         from './WhyBuyPreOwned';
import { RecentlyViewed }      from './RecentlyViewed';
import { ServiceSchedule }     from './ServiceScheduling';
import { Warranty }            from './WarrantyInfo';
import { MeetTheTeam }         from './MeetTheTeam';
import { ReserveModal }        from './ReserveVehicle';
import { AccessibilityWidget } from './AccessibilityWidget';

export function CustomerSite({ config: dealerConfig = {} }) {
  const config = { ...defaultConfig, ...dealerConfig };
  return (
    <CustomerConfigContext.Provider value={config}>
      <CustomerSiteBody config={config} />
    </CustomerConfigContext.Provider>
  );
}

export default CustomerSite;

function CustomerSiteBody({ config }) {
  const features = config.features || {};

  /* ---------- cross-section state ---------- */
  const [priceMode, setPriceMode]   = useState('price');
  const [active, setActive]         = useState(null);
  const [section, setSection]       = useState('top');
  const [theme, setTheme]           = useState('dark');
  const [lang, setLang]             = useState('en');
  const [saved, setSaved]           = useState(() => new Set());
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showSaved, setShowSaved]   = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [dealVehicle, setDealVehicle] = useState(null);
  const [showBeatPrice, setShowBeatPrice] = useState(false);
  const [showChat, setShowChat]     = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(() => new Set());
  const [reserveVehicle, setReserveVehicle] = useState(null);
  const [reserved, setReserved]     = useState(() => new Set());
  const [a11y, setA11y]             = useState({ largeFont: false, highContrast: false, noMotion: false });
  const [bodyType, setBodyType]     = useState('all');
  const [sortBy, setSortBy]         = useState('recent');

  /* ---------- handlers ---------- */
  const toggleSaved = (id) => setSaved((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const togglePriceAlert = (id) => setPriceAlerts((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const reserveOne = (id) => setReserved((p) => { const n = new Set(p); n.add(id); return n; });
  const handleView = (v) => {
    setActive(v);
    setRecentlyViewed((prev) => [v, ...prev.filter((x) => x.id !== v.id)].slice(0, 8));
  };
  const jump = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  /* ---------- effects: body-scroll lock + active-section observer ---------- */
  const anyOverlayOpen = active || dealVehicle || showCompare || showSaved || showBeatPrice || reserveVehicle;
  useEffect(() => {
    document.body.style.overflow = anyOverlayOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [anyOverlayOpen]);

  useEffect(() => {
    const ids = ['top', 'fleet', 'detail', 'trade', 'finance', 'why', 'process', 'voices', 'alerts', 'notebook', 'contact'];
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setSection(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div
      data-fontscale={a11y.largeFont ? 'lg' : ''}
      data-hc={a11y.highContrast ? 'true' : ''}
      data-noanim={a11y.noMotion ? 'true' : ''}
      style={{
        ...THEMES[theme],
        background: C.bg, color: C.ink, minHeight: '100vh',
        fontFamily: FONT_BODY,
        transition: 'background-color 300ms ease, color 300ms ease',
      }}>
      <DealerBanner />
      <SideRail
        active={section} onJump={jump}
        theme={theme} onThemeToggle={() => features.darkMode !== false && setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        lang={lang} onLangToggle={() => features.espanol !== false && setLang((l) => (l === 'en' ? 'es' : 'en'))}
        savedCount={saved.size} onShowSaved={() => setShowSaved(true)}
      />
      <Ticker />
      <TextUsButton />

      <main style={{ marginLeft: 96, paddingTop: 28 }} className="page-main">
        <Hero onCTA={jump} lang={lang} />
        <BodyTypePicker value={bodyType} onChange={setBodyType} />
        <Fleet
          priceMode={priceMode} setPriceMode={setPriceMode}
          onView={handleView}
          onBuildDeal={features.buildYourDeal !== false ? setDealVehicle : null}
          saved={saved} onToggleSave={toggleSaved}
          priceAlerts={priceAlerts} onTogglePriceAlert={togglePriceAlert}
          onCompare={features.comparison !== false ? () => setShowCompare(true) : null}
          reserved={reserved}
          bodyType={bodyType}
          sortBy={sortBy} setSortBy={setSortBy}
        />
        <WhyPreOwned />
        {features.financePreApproval !== false && <Finance />}
        {features.tradeIn          !== false && <TradeIn />}
        {features.serviceScheduling !== false && <ServiceSchedule />}
        <Warranty />
        <Charter />
        <CountersBlock />
        <Process />
        <Voices />
        <MeetTheTeam />
        {features.inventoryAlerts !== false && <Alerts />}
        {features.blog && <Notebook />}
        <Contact />
        {features.recentlyViewed !== false && recentlyViewed.length > 0 && (
          <RecentlyViewed items={recentlyViewed} onView={handleView} onBuildDeal={setDealVehicle} />
        )}
        <Footer />
      </main>

      {active && (
        <DetailDrawer
          v={active}
          onClose={() => setActive(null)}
          onBuildDeal={(v) => { setActive(null); features.buildYourDeal !== false && setDealVehicle(v); }}
          onReserve={(v) => { setActive(null); features.reserveVehicle !== false && setReserveVehicle(v); }}
          isReserved={reserved.has(active.id)}
        />
      )}
      {dealVehicle && features.buildYourDeal !== false && (
        <DealWizard vehicle={dealVehicle} onClose={() => setDealVehicle(null)} />
      )}
      {reserveVehicle && features.reserveVehicle !== false && (
        <ReserveModal vehicle={reserveVehicle} onClose={() => setReserveVehicle(null)} onReserve={reserveOne} />
      )}
      {showCompare && features.comparison !== false && (
        <CompareModal onClose={() => setShowCompare(false)} initialIds={Array.from(saved)} />
      )}
      {showSaved && features.savedVehicles !== false && (
        <SavedPanel
          saved={saved}
          onClose={() => setShowSaved(false)}
          onToggleSave={toggleSaved}
          onView={handleView}
          onCompare={() => { setShowSaved(false); setShowCompare(true); }}
        />
      )}
      {showBeatPrice && features.priceMatch !== false && (
        <BeatPriceModal onClose={() => setShowBeatPrice(false)} />
      )}

      {features.priceMatch    !== false && <BeatPriceBadge onClick={() => setShowBeatPrice(true)} />}
      {features.chatWidget    !== false && <AIChatWidget open={showChat} onToggle={() => setShowChat((s) => !s)} />}
      {features.accessibility !== false && <AccessibilityWidget a11y={a11y} setA11y={setA11y} />}
      <MobileCallButton />

      <CustomerSiteStyles />
    </div>
  );
}
