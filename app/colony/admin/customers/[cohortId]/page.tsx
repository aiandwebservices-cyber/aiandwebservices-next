import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCustomerDetail } from '@/lib/colony/admin-queries'
import CustomerDetailPanel from '../components/CustomerDetailPanel'

export const dynamic = 'force-dynamic'

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ cohortId: string }>
}) {
  const { cohortId } = await params
  const detail = await getCustomerDetail(cohortId)

  return (
    <div>
      <Link
        href="/colony/admin/customers"
        className="inline-flex items-center gap-1 text-sm mb-4 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--colony-text-secondary)' }}
      >
        <ArrowLeft size={14} /> Back to customers
      </Link>
      <CustomerDetailPanel detail={detail} />
    </div>
  )
}
