import { Resend } from 'resend'

interface PreparedEmail {
  from: string
  replyTo: string
  to: string
  subject: string
  html: string
  text: string
  headers: Record<string, string>
}

interface Provider {
  name: 'resend' | 'ses'
  send(req: PreparedEmail): Promise<{ messageId: string }>
}

class ResendProvider implements Provider {
  name: 'resend' = 'resend'
  private client: Resend

  constructor(apiKey: string) {
    this.client = new Resend(apiKey)
  }

  async send(req: PreparedEmail): Promise<{ messageId: string }> {
    const { data, error } = await this.client.emails.send({
      from: req.from,
      to: req.to,
      replyTo: req.replyTo,
      subject: req.subject,
      html: req.html,
      text: req.text,
      headers: req.headers,
    })
    if (error) throw new Error(`Resend: ${error.message}`)
    if (!data?.id) throw new Error('Resend: no message ID returned')
    return { messageId: data.id }
  }
}

export type { PreparedEmail, Provider }

export function getProvider(): Provider {
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) return new ResendProvider(resendKey)
  throw new Error('No email provider configured. Set RESEND_API_KEY in .env.local.')
}
