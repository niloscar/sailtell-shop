import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  timeout: 10_000,
  maxNetworkRetries: 2
})

type CheckoutItem = {
  name: string
  unitPrice: number
  quantity: number
}

export type PaymentEvent =
  | { type: 'paid'; orderId: number }
  | { type: 'expired'; orderId: number }
  | null

export async function createCheckoutSession(orderId: number, items: CheckoutItem[], email: string) {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    allowed_payment_method_types: ['card'], // Only allow card payments for now
    customer_email: email,
    line_items: items.map((item) => ({
      price_data: {
        currency: 'sek',
        product_data: {
          name: item.name
        },
        unit_amount: item.unitPrice
      },
      quantity: item.quantity
    })),
    client_reference_id: String(orderId),
    success_url: `${process.env.CLIENT_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout`
  })
}

export function verifyPaymentWebhook(body: Buffer, signature: string): PaymentEvent {
  const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object

      if (session.payment_status !== 'paid') return null

      const orderId = Number(session.client_reference_id)

      if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        throw new Error('Ogiltigt order-ID i Stripe-händelsen.')
      }

      return { type: 'paid', orderId }
    }

    case 'checkout.session.expired': {
      const orderId = Number(event.data.object.client_reference_id)

      if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        throw new Error('Ogiltigt order-ID i Stripe-händelsen.')
      }

      return { type: 'expired', orderId }
    }

    default:
      return null
  }
}

export async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId)
}
