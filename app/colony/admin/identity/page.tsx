import IdentityQueueClient from './components/IdentityQueueClient'
import { scanIdentityCandidates } from '@/lib/colony/admin-queries'

export const dynamic = 'force-dynamic'

export default async function IdentityPage() {
  const candidates = await scanIdentityCandidates()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--colony-text-primary)' }}>
          Identity merge queue
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
          Candidate duplicate records across EspoCRM and Square. {' '}
          <strong>Merge execution is a dry-run in Phase 12.</strong> Actual writes require Phase 12B.
        </p>
      </div>

      <IdentityQueueClient initial={candidates} />
    </div>
  )
}
