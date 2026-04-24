import crypto from 'crypto'

const SECRET = process.env.COLONY_UNSUBSCRIBE_SECRET ?? 'change-me'

export function generateUnsubscribeToken(leadId: string, cohortId: string): string {
  const payload = `${cohortId}:${leadId}:${Date.now()}`
  const hmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex').slice(0, 16)
  return Buffer.from(`${payload}:${hmac}`).toString('base64url')
}

export function validateUnsubscribeToken(token: string): { cohortId: string; leadId: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const parts = decoded.split(':')
    if (parts.length !== 4) return null
    const [cohortId, leadId, ts, hmac] = parts
    const payload = `${cohortId}:${leadId}:${ts}`
    const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex').slice(0, 16)
    if (hmac !== expected) return null
    const age = Date.now() - parseInt(ts, 10)
    if (age > 365 * 24 * 60 * 60 * 1000) return null
    return { cohortId, leadId }
  } catch {
    return null
  }
}
