import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import FeatureBlock from './components/FeatureBlock'
import FAQItem from './components/FAQItem'
import RequestAccessForm from './components/RequestAccessForm'

export const metadata: Metadata = {
  title: 'Colony — AI Workforce Dashboard | AIandWEBservices',
  description:
    'Colony is the live operations dashboard for your AI agents. Watch leads arrive, track every outreach, and see your revenue pipeline move in real time.',
  openGraph: {
    title: 'Colony — AI Workforce Dashboard',
    description:
      'Watch your agents work, track every lead, see revenue move in real time.',
    url: 'https://www.aiandwebservices.com/product/colony',
    images: [{ url: '/colony-screenshots/home.png', width: 1280, height: 800 }],
  },
}

const FAQS = [
  {
    question: 'What data does Colony have access to?',
    answer:
      'Colony connects to the systems we already set up for your business during onboarding: your lead pipeline, your CRM records, and your AI agent activity logs. It reads and displays that data. It does not access your email inbox, financial accounts, or any data outside your AIandWEBservices setup.',
  },
  {
    question: 'How is this different from a CRM like HubSpot?',
    answer:
      'A traditional CRM is a place you manually log activity. Colony is a live feed of what your AI agents are doing right now. It surfaces leads the moment they arrive, shows you drafted outreach before it goes out, and tracks which agents ran and what they found. You are watching your workforce, not entering data.',
  },
  {
    question: 'Can I use my existing CRM alongside Colony?',
    answer:
      'Yes. Colony integrates with EspoCRM and can sit alongside whatever CRM you already use for human-driven activity. Your AI agents feed into Colony, and your team continues using the tools they already know.',
  },
  {
    question: 'What happens if I cancel?',
    answer:
      'If you cancel your Revenue Engine or AI-First plan, your Colony access ends. All your lead and activity data remains in your EspoCRM instance, which you can export at any time.',
  },
  {
    question: 'Is my data isolated from other customers?',
    answer:
      'Completely. Every Colony instance is scoped to a single cohort. Your agents, your leads, your reports. Nothing is shared, nothing is blended.',
  },
]

export default function ColonyMarketingPage() {
  return (
    <div style={{ background: '#050a18', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        className="relative px-6 pt-24 pb-20 lg:pt-32 lg:pb-28"
        style={{
          background:
            'radial-gradient(ellipse 90% 50% at 50% 0%, rgba(42,165,160,.13) 0%, transparent 60%)',
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
            <div className="lg:flex-1 lg:max-w-[560px]">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 uppercase tracking-widest"
                style={{
                  border: '1px solid rgba(42,165,160,.3)',
                  background: 'rgba(42,165,160,.1)',
                  color: '#2AA5A0',
                }}
              >
                Included with Revenue Engine + AI-First
              </div>
              <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-5 lg:text-5xl xl:text-6xl">
                Your AI workforce, finally visible.
              </h1>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: '#94a3b8' }}
              >
                Colony is the live operations dashboard we built for ourselves — now available to Revenue Engine and AI-First customers. Watch your agents work, track every lead, see revenue move in real time.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#request-access"
                  className="rounded-xl px-7 py-3.5 font-bold text-white text-sm transition-all"
                  style={{
                    background: '#2AA5A0',
                    boxShadow: '0 6px 22px rgba(42,165,160,.4)',
                  }}
                >
                  Request Access
                </a>
                <a
                  href="https://cal.com/aiandwebservices/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl px-7 py-3.5 font-semibold text-sm transition-all"
                  style={{
                    color: '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  Book a call
                </a>
              </div>
            </div>

            <div className="mt-12 lg:mt-0 lg:flex-1">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: '1px solid rgba(42,165,160,.15)',
                  boxShadow:
                    '0 0 0 1px rgba(42,165,160,.06), 0 40px 80px rgba(0,0,0,.75)',
                }}
              >
                <Image
                  src="/colony-screenshots/home.png"
                  alt="Colony dashboard showing live activity feed and revenue pipeline"
                  width={960}
                  height={640}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black text-white mb-3 lg:text-4xl">
            What you get
          </h2>
          <p className="text-lg mb-16 max-w-xl" style={{ color: '#64748b' }}>
            Three views that give you full visibility into your AI-powered operation.
          </p>
          <div className="space-y-24">
            <FeatureBlock
              screenshot="/colony-screenshots/bot-profile.png"
              alt="Agent profile panel showing Bill Nye's weekly activity and track record"
              title="Meet your crew"
              description="Your AI agents are not invisible code anymore. Each one has a name, a role, and a transparent track record. Click any agent to see exactly what they have done for your business this week."
            />
            <FeatureBlock
              screenshot="/colony-screenshots/inbox.png"
              alt="Lead inbox with temperature filters and prospect list"
              title="Every lead in one place"
              description="Your prospects show up the moment they arrive. Filter by temperature, niche, source. Drill into any lead and see the drafted outreach email before you send it."
              reverse
            />
            <FeatureBlock
              screenshot="/colony-screenshots/lead-detail.png"
              alt="Lead detail panel with signals, drafts, and activity history"
              title="The story behind every lead"
              description="Signals, drafts, activity history, and a single-click Mark Contacted action. No more jumping between EspoCRM, Google Sheets, and sticky notes."
            />
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section
        className="px-6 py-20 lg:py-24"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(42,165,160,.06) 0%, transparent 70%)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black text-white mb-6 lg:text-4xl">
            Who Colony is for
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: '#94a3b8' }}>
            Colony is designed for small businesses with 1 to 20 employees — dental
            offices, insurance agencies, restaurants, law firms, any service business
            where every lead matters and every minute counts.
          </p>
        </div>
      </section>

      {/* Pricing anchor */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base" style={{ color: '#64748b' }}>
            Colony is included with our{' '}
            <span className="font-semibold text-white">
              Revenue Engine ($249/month)
            </span>{' '}
            and{' '}
            <span className="font-semibold text-white">AI-First ($349/month)</span>{' '}
            plans.{' '}
            <Link
              href="/services/compare"
              className="underline underline-offset-2 transition-opacity hover:opacity-80"
              style={{ color: '#2AA5A0' }}
            >
              See full AIandWEBservices pricing &#x2192;
            </Link>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        className="px-6 py-20 lg:py-28"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black text-white mb-3 lg:text-4xl">
            How it works
          </h2>
          <p className="text-lg mb-14" style={{ color: '#64748b' }}>
            From zero to a live AI workforce in three steps.
          </p>
          <div className="space-y-10">
            {[
              'We install your agent system and connect it to your business.',
              'Your agents run on a schedule, finding leads and drafting outreach 24 hours a day, seven days a week.',
              'You log into Colony each morning to see what they did and what needs your attention today.',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-6">
                <div
                  className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                  style={{
                    background: 'rgba(42,165,160,.15)',
                    border: '1px solid rgba(42,165,160,.35)',
                    color: '#2AA5A0',
                  }}
                >
                  {i + 1}
                </div>
                <p
                  className="text-lg leading-relaxed pt-1.5"
                  style={{ color: '#94a3b8' }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="px-6 py-20 lg:py-28"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black text-white mb-10 lg:text-4xl">
            Questions
          </h2>
          <div>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Request Access Form */}
      <section
        id="request-access"
        className="px-6 py-20 lg:py-28"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black text-white mb-3 lg:text-4xl">
            Request Access
          </h2>
          <p className="text-base mb-10" style={{ color: '#64748b' }}>
            David reviews every request personally. Tell us about your business and
            he will reach out within 24 hours.
          </p>
          <div
            className="rounded-2xl p-6 lg:p-8"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <RequestAccessForm />
          </div>
        </div>
      </section>
    </div>
  )
}
