import { Request, Response } from 'express'
import { createPayment, handlePaymentEvent } from '../services/payment.service'
import { verifyPaymentWebhook } from '../integrations/payment.adapter'

export async function createPaymentHandler(req: Request, res: Response) {
  const payment = await createPayment(req.body)
  res.status(201).json(payment)
}

export async function webhookHandler(req: Request, res: Response) {
  const signature = req.headers['stripe-signature']

  if (typeof signature !== 'string' || !Buffer.isBuffer(req.body)) {
    res.sendStatus(400)
    return
  }

  let event

  try {
    event = verifyPaymentWebhook(req.body, signature)
  } catch {
    res.sendStatus(400) // Invalid signature
    return
  }

  if (event) {
    await handlePaymentEvent(event)
  }

  res.json({ received: true })
}
