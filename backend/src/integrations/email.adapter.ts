/**
 * Adapter for interacting with the Resend email service.
 */

import { z } from 'zod'

const API_URL = process.env.RESEND_API_URL
const API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.RESEND_EMAIL_FROM
const TIMEOUT_MS = Number(process.env.RESEND_API_TIMEOUT_MS)

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
  if (!API_URL || !API_KEY || !EMAIL_FROM) throw new Error('Resend är inte konfigurerat.')
  if (!Number.isFinite(TIMEOUT_MS) || TIMEOUT_MS <= 0) throw new Error('Ogiltig timeout för Resend.')

  let response: Response

  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `order-confirmation/${orderId}`
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to,
        subject,
        html,
        text
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS)
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error(`Resends API svarade inte inom ${TIMEOUT_MS / 1000} sekunder.`)
    }

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
