/**
 * Order item service functions for handling order item-related operations such as creating and updating order items.
 */

import pool from '../database'
import { DbClient } from '../types/database.types'
import { CreateOrderItem } from '../types/order.types'

export type OrderItemWithPrice = CreateOrderItem & {
  unit_price: number
}

export async function createOrderItems(
  orderId: number,
  items: OrderItemWithPrice[],
  db: DbClient = pool
) {
  for (const item of items) {
    await db.query(
      `INSERT INTO order_items (
        order_id,
        product_id,
        quantity,
        unit_price
      )
      VALUES ($1, $2, $3, $4)`,
      [orderId, item.product_id, item.quantity, item.unit_price]
    )
  }
}
