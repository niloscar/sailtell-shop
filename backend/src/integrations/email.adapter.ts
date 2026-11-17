
import { z } from 'zod'

const API_URL = 'https://api.resend.com/emails'
const TIMEOUT_MS = 5000

const sendEmailResponseSchema = z.object({ id: z.string() })

type SendEmailOptions = {
  to: string
  subject: string
  html: string
  text: string
  orderId: number
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  orderId
}: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM

  if (!apiKey || !from) throw new Error('Resend är inte konfigurerat.')

  let response: Response

  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `order-confirmation/${orderId}`
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS)
    })
  } catch (error) {
    throw new Error('Kunde inte nå Resends API.', { cause: error })
  }

  if (!response.ok) throw new Error(`Resend svarade med HTTP ${response.status}.`)

  let data: unknown

  try {
    data = await response.json()
  } catch (error) {
    throw new Error('Resend skickade ett ogiltigt JSON-svar.', { cause: error })
  }

  const result = sendEmailResponseSchema.safeParse(data)

  if (!result.success) throw new Error('Resend skickade ett oväntat svar.')

  return result.data.id
}
