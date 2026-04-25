/**
 * Bob — Case Study Writer data fetcher.
 * Reads from Bob's 5 Qdrant collections.
 */

interface BobSnapshot {
  taken_at?: string
  generated_at?: string
  total_pipeline_cost_usd?: number
  leads_count?: number
  customers_count?: number
  mrr_usd?: number
  collection_sizes?: Record<string, number>
  pipeline_stats?: Record<string, unknown>
  raw?: Record<string, unknown>
}

interface BobCaseStudy {
  id: string
  title?: string
  audience?: string
  variant_type?: string
  created_at?: string
  body_preview?: string
}

export interface BobProfile {
  bot_id: 'bob'
  display_name: 'Bob — Case Study Writer'
  emoji: '📝'
  status: 'active' | 'idle' | 'unknown'
  last_snapshot: BobSnapshot | null
  pending_drafts_count: number
  claim_sources_count: number
  recent_case_studies: BobCaseStudy[]
  collection_sizes: Record<string, number>
}

function qdrantUrl(): string {
  return (process.env.COLONY_QDRANT_URL || process.env.QDRANT_URL || 'http://localhost:6333').replace(/\/$/, '')
}

async function qdrantScroll<T = Record<string, unknown>>(
  collection: string,
  limit = 5,
  filter?: Record<string, unknown>
): Promise<Array<{ id: string | number; payload: T }>> {
  try {
    const body: Record<string, unknown> = { limit, with_payload: true, with_vector: false }
    if (filter) body.filter = filter

    const resp = await fetch(`${qdrantUrl()}/collections/${collection}/points/scroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!resp.ok) return []
    const data = await resp.json()
    return (data.result?.points || []).map((p: { id: string | number; payload: T }) => ({
      id: p.id,
      payload: p.payload,
    }))
  } catch {
    return []
  }
}

async function qdrantCount(collection: string): Promise<number> {
  try {
    const resp = await fetch(`${qdrantUrl()}/collections/${collection}`)
    if (!resp.ok) return 0
    const data = await resp.json()
    return data.result?.points_count || 0
  } catch {
    return 0
  }
}

export async function fetchBobProfile(cohortId = 'aiandwebservices'): Promise<BobProfile> {
  const cohortFilter = {
    must: [{ key: 'cohort_id', match: { value: cohortId } }],
  }

  const [
    snapshotPoints,
    caseStudyPoints,
    snapshotCount,
    caseStudiesCount,
    realExamplesCount,
    claimSourcesCount,
    marketingEngagementCount,
  ] = await Promise.all([
    qdrantScroll<BobSnapshot>('bob_snapshots', 1, cohortFilter),
    qdrantScroll<Record<string, unknown>>('case_studies', 5, cohortFilter),
    qdrantCount('bob_snapshots'),
    qdrantCount('case_studies'),
    qdrantCount('real_examples'),
    qdrantCount('claim_sources'),
    qdrantCount('marketing_engagement'),
  ])

  const lastSnapshot: BobSnapshot | null = (snapshotPoints[0]?.payload as BobSnapshot) || null

  let status: BobProfile['status'] = 'unknown'
  if (lastSnapshot?.taken_at || lastSnapshot?.generated_at) {
    const ts = lastSnapshot.taken_at || lastSnapshot.generated_at || ''
    const ageMs = Date.now() - new Date(ts).getTime()
    status = ageMs < 8 * 24 * 60 * 60 * 1000 ? 'active' : 'idle'
  }

  const recentDrafts = caseStudyPoints.filter((p) => {
    const s = p.payload?.status
    return s === 'draft' || s === 'pending'
  })

  return {
    bot_id: 'bob',
    display_name: 'Bob — Case Study Writer',
    emoji: '📝',
    status,
    last_snapshot: lastSnapshot,
    pending_drafts_count: recentDrafts.length,
    claim_sources_count: claimSourcesCount,
    recent_case_studies: caseStudyPoints.slice(0, 5).map((p) => ({
      id: String(p.id),
      title: p.payload?.title as string | undefined,
      audience: p.payload?.audience as string | undefined,
      variant_type: p.payload?.variant_type as string | undefined,
      created_at: p.payload?.created_at as string | undefined,
      body_preview: ((p.payload?.body as string) || '').slice(0, 200),
    })),
    collection_sizes: {
      bob_snapshots: snapshotCount,
      case_studies: caseStudiesCount,
      real_examples: realExamplesCount,
      claim_sources: claimSourcesCount,
      marketing_engagement: marketingEngagementCount,
    },
  }
}
