import { createOrder, getOrder } from './order.service'
import { createOrderStatus } from './orderStatus.service'
import { createCheckoutSession, getCheckoutSession } from '../integrations/payment.adapter'
import { withTransaction } from '../database'

import type { CreateOrder } from '../types/order.types'
import type { PaymentEvent } from '../integrations/payment.adapter'

export async function createPayment(orderData: CreateOrder) {
  const order = await createOrder({
    ...orderData,
    payment_method_id: 1 // Force payment method to Stripe for now
  })

  const items = order.order_items.map((item) => ({
    name: item.name,
    unitPrice: Number(item.unit_price),
    quantity: item.quantity
  }))

  const session = await createCheckoutSession(order.id, items, orderData.customer.email)

  if (!session.url) {
    throw new Error('Stripe kunde inte skapa en betalningslänk.')
  }

  return {
    orderId: order.id,
    url: session.url
  }
}

export async function getPaymentConfirmation(sessionId: string) {
  const session = await getCheckoutSession(sessionId)

  const orderId = Number(session.client_reference_id)

  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    throw new Error('Ogiltigt order-ID i betalningssessionen.')
  }

  const order = await getOrder(orderId)

  return {
    orderId: order.id,
    status: order.order_status.name,
    statusId: order.order_status.id,
    items: order.order_items.map((item) => ({
      productId: item.product_id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price)
    })),
    total: Number(order.sum)
  }
}

export async function handlePaymentEvent(event: NonNullable<PaymentEvent>) {
  await withTransaction(async (client) => {
    // Lock the order to prevent concurrent webhook processing
    const { rows: orders } = await client.query(
      `SELECT id
       FROM orders
       WHERE id = $1
       FOR UPDATE`,
      [event.orderId]
    )

    if (!orders[0]) {
      throw new Error(`Order ${event.orderId} kunde inte hittas.`)
    }

    // Get the current order status
    const { rows: statuses } = await client.query<{ status_id: number }>(
      `SELECT status_id
       FROM order_statuses
       WHERE order_id = $1
       ORDER BY set_at DESC, id DESC
       LIMIT 1`,
      [event.orderId]
    )

    const currentStatus = statuses[0]?.status_id

    // Only pending orders can be updated
    if (currentStatus !== 7) {
      return
    }

    if (event.type === 'expired') {
      await createOrderStatus(event.orderId, 6, client)
      return
    }

    if (event.type === 'paid') {
      // Get purchased products
      const { rows: items } = await client.query<{
        product_id: number
        quantity: number
      }>(
        `SELECT product_id, quantity
         FROM order_items
         WHERE order_id = $1`,
        [event.orderId]
      )

      if (items.length === 0) {
        throw new Error('Ordern saknar produkter.')
      }

      // ONTODO: Handle successful payments when stock is no longer available.

      // Decrease stock for each purchased product
      for (const item of items) {
        const { rowCount } = await client.query(
          `UPDATE products
           SET stock = stock - $1
           WHERE id = $2
             AND stock >= $1`,
          [item.quantity, item.product_id]
        )

        if (rowCount !== 1) {
          throw new Error(
            `Otillräckligt lagersaldo för produkt ${item.product_id}.`
          )
        }
      }

      // Mark the order as paid
      await createOrderStatus(event.orderId, 8, client)
    }
  })
}
