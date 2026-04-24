import { currentUser } from '@clerk/nextjs/server'

export async function getCohortId(): Promise<string> {
  const user = await currentUser()
  const cohortFromMeta = user?.publicMetadata?.cohort_id as string | undefined
  return cohortFromMeta ?? 'aiandwebservices'
}
