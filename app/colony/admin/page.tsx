import Link from 'next/link'
import { Users, ClipboardList, ArrowRight, Building2, GitMerge, Activity } from 'lucide-react'

const TOOLS = [
  {
    href: '/colony/admin/onboard',
    icon: Users,
    title: 'Onboard a new customer',
    description: 'Create Clerk account, assign cohort ID, provision EspoCRM, Square, and Qdrant in one flow.',
  },
  {
    href: '/colony/admin/customers',
    icon: Building2,
    title: 'Customers',
    description: 'List of every cohort with MRR, alerts, and impersonation. Drill in for lifecycle detail.',
  },
  {
    href: '/colony/admin/identity',
    icon: GitMerge,
    title: 'Identity merge queue',
    description: 'Candidate duplicate records across EspoCRM and Square. Merge actions are dry-run until Phase 12B.',
  },
  {
    href: '/colony/admin/system',
    icon: Activity,
    title: 'System health',
    description: 'Live ping against Tailscale, EspoCRM, Qdrant, Square, Clerk, PostHog.',
  },
  {
    href: '/colony/admin/audit',
    icon: ClipboardList,
    title: 'Onboarding audit log',
    description: 'Full history of every customer provisioned, with per-step results and rollback support.',
  },
]

export default function AdminHomePage() {
  return (
    <div>
      <p className="text-sm mb-8" style={{ color: 'var(--colony-text-secondary)' }}>
        Select a tool below. Each action is logged and idempotent — safe to re-run if something fails.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOOLS.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-3 p-5 rounded-xl transition-colors"
            style={{
              background: 'var(--colony-bg-elevated)',
              border: '1px solid var(--colony-border)',
            }}
          >
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,212,255,0.1)' }}
              >
                <Icon size={18} style={{ color: 'var(--colony-accent)' }} />
              </div>
              <ArrowRight
                size={16}
                className="opacity-0 group-hover:opacity-60 transition-opacity"
                style={{ color: 'var(--colony-text-secondary)' }}
              />
            </div>
            <div>
              <h2 className="font-semibold text-sm" style={{ color: 'var(--colony-text-primary)' }}>
                {title}
              </h2>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--colony-text-secondary)' }}>
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div
        className="mt-8 rounded-lg px-4 py-3 text-xs"
        style={{
          background: 'rgba(0,212,255,0.05)',
          border: '1px solid rgba(0,212,255,0.15)',
          color: 'var(--colony-text-secondary)',
        }}
      >
        Admin allow-list is in <code className="font-mono">lib/colony/admin.ts</code>. Add team members there when hiring.
        Logged in as an admin.
      </div>
    </div>
  )
}
