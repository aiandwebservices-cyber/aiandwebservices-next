'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, ChevronRight, ChevronLeft, Check, Camera, Upload,
  SkipForward, MessageSquare, FileText, TrendingUp, Mail, Star,
  Phone, MessageCircle, CreditCard, Bot,
} from 'lucide-react';
import { GOLD, Btn, Field, Input, Toggle } from './_internals';
import VinScanner from './VinScanner';

const TEAL = '#2AA5A0';
const TOTAL_STEPS = 6;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AI_AGENTS = [
  { key: 'aiSales',       label: 'AI Sales Agent',     desc: 'Responds to customer inquiries 24/7 with real inventory knowledge', icon: MessageSquare },
  { key: 'aiDescriptions',label: 'AI Description Writer', desc: 'Generates compelling listing descriptions automatically',         icon: FileText },
  { key: 'aiLeadScorer',  label: 'AI Lead Scorer',     desc: 'Ranks leads by purchase intent so you call the hot ones first',     icon: TrendingUp },
  { key: 'aiFollowUp',    label: 'AI Follow-Up Writer',desc: 'Creates personalized follow-up sequences',                            icon: Mail },
  { key: 'aiReviews',     label: 'AI Review Responder',desc: 'Drafts professional Google review responses',                         icon: Star },
];

export function OnboardingWizard({ dealerId, settings, setSettings, onComplete }) {
  const [step, setStep] = useState(() => Math.min(TOTAL_STEPS, Math.max(1, settings?.onboardingStep || 1)));
  const [direction, setDirection] = useState('forward');

  // step 1
  const [dealerName, setDealerName] = useState(settings?.dealerName || '');

  // step 2
  const [biz, setBiz] = useState(() => ({
    businessName: settings?.businessName || settings?.dealerName || '',
    address:      settings?.address || '',
    phone:        settings?.phone || '',
    email:        settings?.email || '',
    website:      settings?.website || '',
    logoUrl:      settings?.logoUrl || '',
  }));
  const [hours, setHours] = useState(() =>
    settings?.businessHours || DAYS.reduce((acc, d) => ({
      ...acc,
      [d]: { open: d === 'Sun' ? '11:00' : '09:00', close: d === 'Sun' ? '17:00' : (d === 'Sat' ? '18:00' : '20:00'), closed: false },
    }), {})
  );

  // step 3
  const [vehicleCount, setVehicleCount] = useState(settings?.onboardingVehicleCount || 0);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  // step 4
  const [integrationsConnected, setIntegrationsConnected] = useState(() => ({
    twilio: !!settings?.integrations?.twilio?.connected,
    resend: !!settings?.integrations?.resend?.connected,
    stripe: !!settings?.integrations?.stripe?.connected,
  }));
  const [activeIntegration, setActiveIntegration] = useState(null);
  const [integrationFields, setIntegrationFields] = useState({});
  const [integrationStatus, setIntegrationStatus] = useState(null);
  const [integrationTesting, setIntegrationTesting] = useState(false);

  // step 5
  const [aiToggles, setAiToggles] = useState(() => {
    const seed = {};
    AI_AGENTS.forEach(a => { seed[a.key] = settings?.[a.key] !== false; });
    return seed;
  });

  // persist progress on step change
  useEffect(() => {
    setSettings(s => ({ ...s, onboardingStep: step }));
  }, [step, setSettings]);

  const next = useCallback(() => {
    setDirection('forward');
    setStep(s => Math.min(TOTAL_STEPS, s + 1));
  }, []);
  const back = useCallback(() => {
    setDirection('backward');
    setStep(s => Math.max(1, s - 1));
  }, []);

  // step 2 → save dealership info into settings
  const saveBusinessInfo = () => {
    setSettings(s => ({
      ...s,
      dealerName: dealerName || biz.businessName,
      businessName: biz.businessName,
      address: biz.address,
      phone: biz.phone,
      email: biz.email,
      website: biz.website,
      logoUrl: biz.logoUrl,
      businessHours: hours,
    }));
    next();
  };

  // step 3 → VIN scanner
  const onVinDetected = async (vin) => {
    setVehicleCount(c => {
      const newCount = c + 1;
      setSettings(s => ({ ...s, onboardingVehicleCount: newCount }));
      return newCount;
    });
    if (vehicleCount + 1 >= 3) setScannerOpen(false);
  };

  const onCsvImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`/api/dealer/${dealerId}/admin/import`, { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const added = Number(data.imported || data.count || 0);
        setVehicleCount(c => {
          const newCount = c + added;
          setSettings(s => ({ ...s, onboardingVehicleCount: newCount }));
          return newCount;
        });
        setImportMsg(`✓ Imported ${added} vehicle${added === 1 ? '' : 's'}`);
      } else {
        setImportMsg(data.error || 'Import failed — check CSV format');
      }
    } catch {
      setImportMsg('Network error during import');
    } finally {
      setImporting(false);
    }
  };

  // step 4 → integrations
  const integrationDefs = {
    twilio: {
      name: 'Twilio',
      desc: 'SMS notifications to customers and staff',
      icon: MessageCircle, color: '#F22F46',
      fields: [
        { name: 'accountSid', label: 'Account SID', placeholder: 'AC…' },
        { name: 'authToken',  label: 'Auth Token',  type: 'password' },
        { name: 'phoneNumber',label: 'Twilio Phone Number', placeholder: '+1305…' },
      ],
    },
    resend: {
      name: 'Resend',
      desc: 'Transactional email — alerts, review requests, follow-ups',
      icon: Mail, color: '#000',
      fields: [
        { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 're_…' },
      ],
    },
    stripe: {
      name: 'Stripe',
      desc: 'Subscription billing and online deposits',
      icon: CreditCard, color: '#635BFF',
      fields: [
        { name: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_live_…' },
        { name: 'secretKey',      label: 'Secret Key', type: 'password', placeholder: 'sk_live_…' },
      ],
    },
  };

  const openIntegration = (key) => {
    setActiveIntegration(key);
    setIntegrationFields(settings?.integrations?.[key] || {});
    setIntegrationStatus(null);
  };

  const validateIntegration = async () => {
    if (!activeIntegration) return;
    setIntegrationTesting(true);
    setIntegrationStatus(null);
    try {
      const res = await fetch(`/api/dealer/${dealerId}/admin/validate-integration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integration: activeIntegration, credentials: integrationFields }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.valid) {
        setSettings(s => ({
          ...s,
          integrations: {
            ...(s.integrations || {}),
            [activeIntegration]: { ...integrationFields, connected: true, connectedAt: new Date().toISOString() },
          },
        }));
        setIntegrationsConnected(c => ({ ...c, [activeIntegration]: true }));
        setIntegrationStatus({ ok: true, msg: data.details || 'Connected' });
        setTimeout(() => setActiveIntegration(null), 1000);
      } else {
        setIntegrationStatus({ ok: false, msg: data.error || 'Validation failed' });
      }
    } catch {
      setIntegrationStatus({ ok: false, msg: 'Network error' });
    } finally {
      setIntegrationTesting(false);
    }
  };

  // step 5 → AI toggles
  const toggleAi = (key) => setAiToggles(a => ({ ...a, [key]: !a[key] }));

  const saveAiAndContinue = () => {
    setSettings(s => ({ ...s, ...aiToggles }));
    next();
  };

  // step 6 → finish
  const finish = () => {
    setSettings(s => ({ ...s, onboardingComplete: true, onboardingFinishedAt: new Date().toISOString() }));
    onComplete?.();
  };

  const connectedCount = Object.values(integrationsConnected).filter(Boolean).length;
  const enabledAiCount = Object.values(aiToggles).filter(Boolean).length;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(8,8,10,0.86)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, overflow: 'auto',
      }}
    >
      <style>{`
        @keyframes onboardSlideIn { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes onboardSlideInBack { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes onboardCheck { 0% { transform: scale(0); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
        .onboard-step-content { animation: ${direction === 'forward' ? 'onboardSlideIn' : 'onboardSlideInBack'} 280ms ease-out; }
      `}</style>

      <div
        style={{
          background: '#FFFFFF', color: '#1A1A1A',
          maxWidth: 640, width: '100%', maxHeight: 'calc(100vh - 48px)',
          borderRadius: 12, boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Progress indicator */}
        <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid #F1F2F4' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: '#6B7280' }}>
                Setup · Step {step} of {TOTAL_STEPS}
              </span>
            </div>
            <span className="text-[11px] tabular" style={{ color: '#9CA3AF' }}>
              {Math.round((step / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(n => (
              <div
                key={n}
                style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: n <= step ? TEAL : '#E5E7EB',
                  transition: 'background-color 280ms',
                }}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="onboard-step-content" key={step} style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
          {step === 1 && (
            <Step1
              dealerName={dealerName} setDealerName={setDealerName}
            />
          )}
          {step === 2 && (
            <Step2
              biz={biz} setBiz={setBiz}
              hours={hours} setHours={setHours}
            />
          )}
          {step === 3 && (
            <Step3
              vehicleCount={vehicleCount}
              onScan={() => setScannerOpen(true)}
              onCsv={onCsvImport}
              importing={importing} importMsg={importMsg}
            />
          )}
          {step === 4 && (
            <Step4
              defs={integrationDefs}
              connected={integrationsConnected}
              onOpen={openIntegration}
            />
          )}
          {step === 5 && (
            <Step5
              toggles={aiToggles} onToggle={toggleAi}
              enabledCount={enabledAiCount}
            />
          )}
          {step === 6 && (
            <Step6
              dealerName={dealerName || biz.businessName}
              vehicleCount={vehicleCount}
              integrationCount={connectedCount}
              aiCount={enabledAiCount}
            />
          )}
        </div>

        {/* Footer / nav */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid #F1F2F4', background: '#FAFAFA' }}>
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={back}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: '#6B7280' }}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center gap-2">
              {(step === 3 || step === 4) && (
                <button
                  onClick={next}
                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded transition"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#6B7280'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
                >
                  <SkipForward className="w-3.5 h-3.5" /> Skip for now
                </button>
              )}
              {step === 1 && (
                <Btn variant="gold" onClick={next} icon={ChevronRight} disabled={!dealerName.trim()}>
                  Get Started
                </Btn>
              )}
              {step === 2 && (
                <Btn variant="gold" onClick={saveBusinessInfo} icon={ChevronRight}
                     disabled={!biz.businessName.trim()}>
                  Save & Continue
                </Btn>
              )}
              {step === 3 && (
                <Btn variant="gold" onClick={next} icon={ChevronRight}>Continue</Btn>
              )}
              {step === 4 && (
                <Btn variant="gold" onClick={next} icon={ChevronRight}>Continue</Btn>
              )}
              {step === 5 && (
                <Btn variant="gold" onClick={saveAiAndContinue} icon={ChevronRight}>Continue</Btn>
              )}
              {step === 6 && (
                <Btn variant="gold" onClick={finish} icon={Check}>Go to Dashboard</Btn>
              )}
            </div>
          </div>
        </div>
      </div>

      {scannerOpen && (
        <VinScanner
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onVinDetected={onVinDetected}
        />
      )}

      {activeIntegration && (
        <IntegrationModal
          def={integrationDefs[activeIntegration]}
          values={integrationFields}
          setValues={setIntegrationFields}
          status={integrationStatus}
          testing={integrationTesting}
          onCancel={() => setActiveIntegration(null)}
          onConnect={validateIntegration}
        />
      )}
    </div>
  );
}

export default OnboardingWizard;

/* ─────────── Step 1 — Welcome ─────────── */
function Step1({ dealerName, setDealerName }) {
  return (
    <div>
      <div className="mb-1 text-[11px] uppercase tracking-wider font-semibold" style={{ color: TEAL }}>
        Welcome
      </div>
      <h2 className="font-display text-3xl font-semibold tracking-tight mb-2">Welcome to LotPilot!</h2>
      <p className="text-sm mb-7" style={{ color: '#6B7280' }}>
        Let's get your dealership set up in 5 minutes. We'll walk through your business info,
        inventory, integrations, and AI features so you're ready to sell.
      </p>
      <Field label="Dealership Name" required>
        <Input
          autoFocus
          value={dealerName}
          onChange={e => setDealerName(e.target.value)}
          placeholder="Acme Auto Group"
        />
      </Field>
    </div>
  );
}

/* ─────────── Step 2 — Dealership Info ─────────── */
function Step2({ biz, setBiz, hours, setHours }) {
  const update = (k, v) => setBiz(b => ({ ...b, [k]: v }));
  const updateHours = (day, k, v) =>
    setHours(h => ({ ...h, [day]: { ...h[day], [k]: v } }));

  return (
    <div>
      <div className="mb-1 text-[11px] uppercase tracking-wider font-semibold" style={{ color: TEAL }}>
        Dealership Info
      </div>
      <h2 className="font-display text-2xl font-semibold tracking-tight mb-1">Tell us about your business</h2>
      <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
        These appear on your customer-facing site and in lead notifications.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <Field label="Business Name" required>
          <Input value={biz.businessName} onChange={e => update('businessName', e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={biz.phone} onChange={e => update('phone', e.target.value)} placeholder="(305) 555-0199" />
        </Field>
        <Field label="Email">
          <Input value={biz.email} onChange={e => update('email', e.target.value)} placeholder="sales@acme.com" />
        </Field>
        <Field label="Website">
          <Input value={biz.website} onChange={e => update('website', e.target.value)} placeholder="https://acme.com" />
        </Field>
        <Field label="Address" className="sm:col-span-2">
          <Input value={biz.address} onChange={e => update('address', e.target.value)} placeholder="123 Main St, Miami, FL 33101" />
        </Field>
        <Field label="Logo URL" hint="You can upload later in Settings" className="sm:col-span-2">
          <Input value={biz.logoUrl} onChange={e => update('logoUrl', e.target.value)} placeholder="https://…/logo.png" />
        </Field>
      </div>

      <div className="mt-2">
        <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: '#6B7280' }}>
          Business Hours
        </div>
        <div className="space-y-1.5">
          {DAYS.map(d => (
            <div key={d} className="flex items-center gap-2 text-sm">
              <div className="w-12 font-medium" style={{ color: '#374151' }}>{d}</div>
              {hours[d].closed ? (
                <span className="flex-1 text-xs italic" style={{ color: '#9CA3AF' }}>Closed</span>
              ) : (
                <>
                  <input type="time" value={hours[d].open} onChange={e => updateHours(d, 'open', e.target.value)}
                    className="px-2 py-1 text-xs border rounded font-mono tabular"
                    style={{ borderColor: '#E5E7EB' }} />
                  <span style={{ color: '#9CA3AF' }}>–</span>
                  <input type="time" value={hours[d].close} onChange={e => updateHours(d, 'close', e.target.value)}
                    className="px-2 py-1 text-xs border rounded font-mono tabular"
                    style={{ borderColor: '#E5E7EB' }} />
                </>
              )}
              <button onClick={() => updateHours(d, 'closed', !hours[d].closed)}
                className="ml-auto text-[11px] font-medium px-2 py-1 rounded"
                style={{ color: '#6B7280' }}>
                {hours[d].closed ? 'Open' : 'Mark closed'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Step 3 — Inventory Quick Start ─────────── */
function Step3({ vehicleCount, onScan, onCsv, importing, importMsg }) {
  return (
    <div>
      <div className="mb-1 text-[11px] uppercase tracking-wider font-semibold" style={{ color: TEAL }}>
        Inventory
      </div>
      <h2 className="font-display text-2xl font-semibold tracking-tight mb-1">Add some vehicles</h2>
      <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
        Pick whichever's fastest. You can keep adding more anytime from the Inventory tab.
      </p>

      {vehicleCount > 0 && (
        <div className="mb-4 px-3 py-2 rounded-md text-sm font-semibold inline-flex items-center gap-2"
          style={{ background: '#ECFDF5', color: '#15803D' }}>
          <Check className="w-4 h-4" strokeWidth={2.5} />
          {vehicleCount} vehicle{vehicleCount === 1 ? '' : 's'} added
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <button onClick={onScan}
          className="text-left p-5 rounded-lg border-2 transition hover:shadow-md"
          style={{ borderColor: '#E5E7EB' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
            style={{ background: TEAL + '15' }}>
            <Camera className="w-5 h-5" style={{ color: TEAL }} />
          </div>
          <div className="font-display font-semibold mb-1">Scan VINs</div>
          <div className="text-xs" style={{ color: '#6B7280' }}>
            Point your camera at the VIN barcode. Decodes year, make, model, trim automatically.
          </div>
        </button>

        <label
          className="text-left p-5 rounded-lg border-2 transition hover:shadow-md cursor-pointer"
          style={{ borderColor: '#E5E7EB' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
            style={{ background: TEAL + '15' }}>
            <Upload className="w-5 h-5" style={{ color: TEAL }} />
          </div>
          <div className="font-display font-semibold mb-1">Import CSV</div>
          <div className="text-xs" style={{ color: '#6B7280' }}>
            Upload a spreadsheet from your DMS or vAuto. We'll match the columns automatically.
          </div>
          <input type="file" accept=".csv,text/csv" onChange={onCsv} disabled={importing}
            className="hidden" />
        </label>
      </div>

      {importing && (
        <div className="mt-3 text-xs" style={{ color: '#6B7280' }}>Importing…</div>
      )}
      {importMsg && (
        <div className="mt-3 text-xs font-medium"
          style={{ color: importMsg.startsWith('✓') ? '#15803D' : '#DC2626' }}>
          {importMsg}
        </div>
      )}

      <div className="mt-5 text-[11px]" style={{ color: '#9CA3AF' }}>
        Or skip — you can add vehicles anytime from the Inventory tab.
      </div>
    </div>
  );
}

/* ─────────── Step 4 — Integrations ─────────── */
function Step4({ defs, connected, onOpen }) {
  return (
    <div>
      <div className="mb-1 text-[11px] uppercase tracking-wider font-semibold" style={{ color: TEAL }}>
        Integrations
      </div>
      <h2 className="font-display text-2xl font-semibold tracking-tight mb-1">Connect your tools</h2>
      <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
        Optional — you can always set these up later in Settings.
      </p>

      <div className="space-y-2.5">
        {Object.entries(defs).map(([key, def]) => {
          const Icon = def.icon;
          const isConnected = connected[key];
          return (
            <div key={key} className="flex items-start gap-3 p-3 rounded-lg border"
              style={{ borderColor: '#E5E7EB' }}>
              <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                style={{ background: def.color + '15', color: def.color }}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-sm">{def.name}</div>
                  {isConnected && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: '#ECFDF5', color: '#15803D' }}>
                      ✓ Connected
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{def.desc}</div>
              </div>
              <Btn size="sm" variant={isConnected ? 'ghost' : 'outlineGold'} onClick={() => onOpen(key)}>
                {isConnected ? 'Edit' : 'Connect'}
              </Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── Step 5 — AI Configuration ─────────── */
function Step5({ toggles, onToggle, enabledCount }) {
  return (
    <div>
      <div className="mb-1 text-[11px] uppercase tracking-wider font-semibold" style={{ color: TEAL }}>
        AI Configuration
      </div>
      <h2 className="font-display text-2xl font-semibold tracking-tight mb-1">Turn on your AI agents</h2>
      <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
        Each one runs independently — toggle anytime from Settings.
      </p>

      <div className="space-y-2">
        {AI_AGENTS.map(a => {
          const Icon = a.icon;
          const on = toggles[a.key];
          return (
            <div key={a.key}
              onClick={() => onToggle(a.key)}
              className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition"
              style={{
                borderColor: on ? TEAL : '#E5E7EB',
                background: on ? TEAL + '08' : '#FFFFFF',
              }}
            >
              <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: on ? TEAL : '#F3F4F6', color: on ? '#FFFFFF' : '#6B7280' }}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{a.label}</div>
                <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{a.desc}</div>
              </div>
              <div onClick={(e) => e.stopPropagation()} className="mt-1">
                <Toggle checked={on} onChange={() => onToggle(a.key)} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 px-4 py-3 rounded-lg text-sm flex items-start gap-3"
        style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
        <Bot className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#B45309' }} />
        <div>
          <div className="font-semibold" style={{ color: '#92400E' }}>
            Estimated AI cost: ~$20–$30/month
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#92400E' }}>
            For all {enabledCount} enabled feature{enabledCount === 1 ? '' : 's'}. Pay only for what your customers actually use.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Step 6 — Complete ─────────── */
function Step6({ dealerName, vehicleCount, integrationCount, aiCount }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: TEAL,
          animation: 'onboardCheck 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
      <h2 className="font-display text-3xl font-semibold tracking-tight mb-2">You're all set!</h2>
      <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
        {dealerName ? `${dealerName} is ` : 'Your dealership is '}ready to sell with LotPilot.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto">
        <SummaryCard label="Vehicles" value={vehicleCount} />
        <SummaryCard label="Integrations" value={integrationCount} />
        <SummaryCard label="AI Features" value={aiCount} />
      </div>

      <p className="text-xs" style={{ color: '#9CA3AF' }}>
        Need to change anything? Visit the Settings tab anytime.
      </p>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
      <div className="font-display text-2xl font-semibold tabular" style={{ color: TEAL }}>{value}</div>
      <div className="text-[11px] uppercase tracking-wider font-medium mt-0.5" style={{ color: '#6B7280' }}>{label}</div>
    </div>
  );
}

/* ─────────── Integration Modal ─────────── */
function IntegrationModal({ def, values, setValues, status, testing, onCancel, onConnect }) {
  const Icon = def.icon;
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 110,
        background: 'rgba(8,8,10,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF', maxWidth: 420, width: '100%',
          borderRadius: 12, padding: 24,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-md flex items-center justify-center"
            style={{ background: def.color + '15', color: def.color }}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-semibold">Connect {def.name}</div>
            <div className="text-xs" style={{ color: '#6B7280' }}>{def.desc}</div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {def.fields.map(f => (
            <Field key={f.name} label={f.label}>
              <Input
                type={f.type || 'text'}
                value={values[f.name] || ''}
                onChange={(e) => setValues(v => ({ ...v, [f.name]: e.target.value }))}
                placeholder={f.placeholder}
              />
            </Field>
          ))}
        </div>

        {status && (
          <div className="text-xs mb-3 px-2 py-1.5 rounded"
            style={{
              background: status.ok ? '#ECFDF5' : '#FEF2F2',
              color: status.ok ? '#15803D' : '#DC2626',
            }}>
            {status.ok ? '✓ ' : '✗ '}{status.msg}
          </div>
        )}

        <div className="flex items-center gap-2 justify-end">
          <Btn variant="ghost" size="sm" onClick={onCancel}>Cancel</Btn>
          <Btn variant="gold" size="sm" onClick={onConnect} disabled={testing}>
            {testing ? 'Testing…' : 'Connect'}
          </Btn>
        </div>
      </div>
    </div>
  );
}
