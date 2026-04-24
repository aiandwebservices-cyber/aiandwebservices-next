import { auth, currentUser } from '@clerk/nextjs/server'

export const COLONY_ADMIN_EMAILS = [
  'david@aiandwebservices.com',
  'aiandwebservices@gmail.com',
]

export async function requireAdmin(): Promise<{ userId: string; email: string } | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress
  if (!email || !COLONY_ADMIN_EMAILS.includes(email.toLowerCase())) return null
  return { userId, email }
}
