import { generateUnsubscribeToken } from './unsubscribe'

export function escapeHTML(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function buildEmailBody(params: {
  bodyText: string
  bodyHTML?: string
  leadId: string
  cohortId: string
  senderName?: string
}): { html: string; text: string; unsubscribeToken: string } {
  const token = generateUnsubscribeToken(params.leadId, params.cohortId)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aiandwebservices.com'
  const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${token}`

  const bodyHtmlEscaped = params.bodyHTML ?? escapeHTML(params.bodyText).replace(/\n/g, '<br>')
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; line-height: 1.5;">
      <div>${bodyHtmlEscaped}</div>
      <div style="margin-top: 32px; padding-top: 12px; border-top: 1px solid #e5e5e5; font-size: 11px; color: #999;">
        You're receiving this because ${escapeHTML(params.senderName ?? 'David Pulis')} reached out about your business.
        <a href="${unsubscribeUrl}" style="color: #999; text-decoration: underline;">Unsubscribe</a>
      </div>
    </div>
  `.trim()

  const text = `${params.bodyText}\n\n---\nUnsubscribe: ${unsubscribeUrl}`

  return { html, text, unsubscribeToken: token }
}
