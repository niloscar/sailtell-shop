/**
 * Order item service functions for handling order item-related operations such as creating and updating order items.
 */

import pool from '../database'
import { DbClient } from '../types/database.types'
import { CreateOrderItem } from '../types/order.types'

export async function createOrderItems(
  orderId: number,
  items: CreateOrderItem[],
  db: DbClient = pool
) {
  for (const item of items) {
    const { rows: priceRows } = await db.query<{ price: number }>(
      `SELECT price
       FROM prices
       WHERE product_id = $1
       ORDER BY set_at DESC
       LIMIT 1`,
      [item.product_id]
    )
    const currentPrice = priceRows[0]

    if (!currentPrice) {
      throw new Error(`Pris saknas för produkt ${item.product_id}.`)
    }

    await db.query(
      `INSERT INTO order_items (
        order_id,
        product_id,
        quantity,
        unit_price
      )
      VALUES ($1, $2, $3, $4)`,
      [orderId, item.product_id, item.quantity, currentPrice.price]
    )
  }
}
