import { listCustomers } from '@/lib/colony/admin-queries'
import CustomerSearch from './components/CustomerSearch'

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const customers = await listCustomers()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: 'var(--colony-text-primary)' }}>
          Customers ({customers.length})
        </h2>
      </div>

      <CustomerSearch initial={customers} />
    </div>
  )
}
