import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/colony/admin'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  if (!admin) redirect('/colony')

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header
        className="mb-6 pb-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--colony-border)' }}
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--colony-text-primary)' }}>
            Colony Admin
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>
            Internal tools. Visible only to administrators.
          </p>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/colony/admin"
            className="hover:opacity-80 transition-opacity"
            style={{ color: 'var(--colony-text-secondary)' }}
          >
            Home
          </Link>
          <Link
            href="/colony/admin/onboard"
            className="hover:opacity-80 transition-opacity"
            style={{ color: 'var(--colony-text-secondary)' }}
          >
            Onboard
          </Link>
          <Link
            href="/colony/admin/audit"
            className="hover:opacity-80 transition-opacity"
            style={{ color: 'var(--colony-text-secondary)' }}
          >
            Audit Log
          </Link>
          <Link
            href="/colony"
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{
              background: 'var(--colony-bg-elevated)',
              border: '1px solid var(--colony-border)',
              color: 'var(--colony-text-secondary)',
            }}
          >
            Back to Colony
          </Link>
        </nav>
      </header>
      {children}
    </div>
  )
}
