import { SquareClient, SquareEnvironment } from 'square'
import { ColonyFetchError } from './contracts'

function getCredentials() {
  const isProduction = process.env.SQUARE_ENVIRONMENT === 'production'
  const token = isProduction
    ? process.env.SQUARE_PRODUCTION_ACCESS_TOKEN
    : process.env.SQUARE_SANDBOX_ACCESS_TOKEN
  const locationId = isProduction
    ? process.env.SQUARE_PRODUCTION_LOCATION_ID
    : process.env.SQUARE_SANDBOX_LOCATION_ID

  if (!token) throw new ColonyFetchError('unknown', null, 'Square not configured: missing access token')
  if (!locationId) throw new ColonyFetchError('unknown', null, 'Square not configured: missing location ID')

  return { token, locationId, isProduction }
}

function getSquareClient() {
  const { token, isProduction } = getCredentials()
  return new SquareClient({
    token,
    environment: isProduction ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
  })
}

function centsToUSD(amount: bigint | null | undefined): number {
  return amount ? Number(amount) / 100 : 0
}

export type SquareSubscription = {
  id: string
  customer_id: string
  plan_id: string
  plan_name: string
  status: 'ACTIVE' | 'PAUSED' | 'CANCELED' | 'DEACTIVATED'
  started_at: string
  monthly_amount: number
  metadata?: Record<string, string>
}

export type SquarePayment = {
  id: string
  customer_id: string
  amount: number
  type: 'setup_fee' | 'subscription' | 'one_time'
  created_at: string
  status: 'COMPLETED' | 'FAILED' | 'REFUNDED'
}

export type SquareCanceledSub = {
  subscription_id: string
  canceled_at: string
  monthly_amount: number
}

export async function squareFetchActiveSubscriptions(): Promise<SquareSubscription[]> {
  const client = getSquareClient()
  const { locationId } = getCredentials()

  const response = await client.subscriptions.search({
    query: {
      filter: {
        locationIds: [locationId],
      },
    },
  })

  const rawSubs = response.subscriptions ?? []
  const activeSubs = rawSubs.filter(s => s.status === 'ACTIVE')

  // Batch-fetch catalog objects to get plan names + prices
  const planVariationIds = [...new Set(activeSubs.map(s => s.planVariationId).filter(Boolean) as string[])]
  const planMap = new Map<string, { name: string; monthly_amount: number }>()

  if (planVariationIds.length > 0) {
    try {
      const catalog = await client.catalog.batchGet({ objectIds: planVariationIds })
      for (const obj of catalog.objects ?? []) {
        if (obj.type === 'SUBSCRIPTION_PLAN_VARIATION' && obj.id) {
          const variation = (obj as { subscriptionPlanVariationData?: { name: string; phases: Array<{ recurringPriceMoney?: { amount?: bigint | null } }> } }).subscriptionPlanVariationData
          if (variation) {
            const phase = variation.phases?.[0]
            planMap.set(obj.id, {
              name: variation.name,
              monthly_amount: centsToUSD(phase?.recurringPriceMoney?.amount),
            })
          }
        }
      }
    } catch {
      // Non-fatal: catalog fetch failed, amounts will default to 0
    }
  }

  return activeSubs.map(s => ({
    id: s.id ?? '',
    customer_id: s.customerId ?? '',
    plan_id: s.planVariationId ?? '',
    plan_name: planMap.get(s.planVariationId ?? '')?.name ?? 'Unknown Plan',
    status: (s.status as SquareSubscription['status']) ?? 'ACTIVE',
    started_at: s.startDate ?? '',
    monthly_amount: planMap.get(s.planVariationId ?? '')?.monthly_amount ?? 0,
    metadata: undefined,
  }))
}

export async function squareFetchPaymentsThisMonth(): Promise<SquarePayment[]> {
  const client = getSquareClient()
  const { locationId } = getCredentials()

  const firstOfMonth = new Date()
  firstOfMonth.setUTCDate(1)
  firstOfMonth.setUTCHours(0, 0, 0, 0)

  const payments: SquarePayment[] = []
  for await (const payment of await client.payments.list({
    beginTime: firstOfMonth.toISOString(),
    locationId,
  })) {
    const amount = centsToUSD(payment.amountMoney?.amount)
    // sourceType 'SQUARE_ACCOUNT' indicates subscription charge; others are one-time
    const type: SquarePayment['type'] = payment.sourceType === 'SQUARE_ACCOUNT'
      ? 'subscription'
      : 'one_time'
    const status: SquarePayment['status'] =
      payment.status === 'COMPLETED' ? 'COMPLETED'
      : payment.status === 'FAILED' ? 'FAILED'
      : payment.status === 'CANCELED' ? 'REFUNDED'
      : 'COMPLETED'

    payments.push({
      id: payment.id ?? '',
      customer_id: payment.customerId ?? '',
      amount,
      type,
      created_at: payment.createdAt ?? '',
      status,
    })
  }
  return payments
}

export async function squareFetchCanceledSubscriptionsThisMonth(): Promise<SquareCanceledSub[]> {
  const client = getSquareClient()
  const { locationId } = getCredentials()

  const firstOfMonth = new Date()
  firstOfMonth.setUTCDate(1)
  firstOfMonth.setUTCHours(0, 0, 0, 0)

  const response = await client.subscriptions.search({
    query: {
      filter: {
        locationIds: [locationId],
      },
    },
  })

  const canceledThisMonth = (response.subscriptions ?? []).filter(s => {
    if (s.status !== 'CANCELED' && s.status !== 'DEACTIVATED') return false
    if (!s.canceledDate) return false
    return new Date(s.canceledDate) >= firstOfMonth
  })

  // Batch-fetch plan amounts
  const planVariationIds = [...new Set(canceledThisMonth.map(s => s.planVariationId).filter(Boolean) as string[])]
  const amountMap = new Map<string, number>()

  if (planVariationIds.length > 0) {
    try {
      const catalog = await client.catalog.batchGet({ objectIds: planVariationIds })
      for (const obj of catalog.objects ?? []) {
        if (obj.type === 'SUBSCRIPTION_PLAN_VARIATION' && obj.id) {
          const variation = (obj as { subscriptionPlanVariationData?: { phases: Array<{ recurringPriceMoney?: { amount?: bigint | null } }> } }).subscriptionPlanVariationData
          const phase = variation?.phases?.[0]
          amountMap.set(obj.id, centsToUSD(phase?.recurringPriceMoney?.amount))
        }
      }
    } catch {
      // Non-fatal
    }
  }

  return canceledThisMonth.map(s => ({
    subscription_id: s.id ?? '',
    canceled_at: s.canceledDate ?? '',
    monthly_amount: amountMap.get(s.planVariationId ?? '') ?? 0,
  }))
}
