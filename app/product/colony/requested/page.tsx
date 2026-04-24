import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request Received | Colony | AIandWEBservices',
  robots: { index: false },
}

export default function ColonyRequestedPage() {
  return (
    <div
      style={{ background: '#050a18', minHeight: '100vh' }}
      className="flex items-center justify-center px-6 py-24"
    >
      <div className="max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{
            background: 'rgba(42,165,160,.12)',
            border: '2px solid rgba(42,165,160,.4)',
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2AA5A0"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-white mb-4 leading-tight">
          Thanks. We will be in touch within 24 hours.
        </h1>

        <p className="text-base leading-relaxed mb-10" style={{ color: '#94a3b8' }}>
          David reviews every request personally. While you wait, feel free to book
          a call to talk through your business needs directly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://cal.com/aiandwebservices/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl px-6 py-3.5 font-bold text-white text-sm transition-all"
            style={{
              background: '#2AA5A0',
              boxShadow: '0 6px 22px rgba(42,165,160,.4)',
            }}
          >
            Book a call
          </a>
          <Link
            href="/"
            className="rounded-xl px-6 py-3.5 font-semibold text-sm transition-all"
            style={{
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Back to AIandWEBservices
          </Link>
        </div>
      </div>
    </div>
  )
}
