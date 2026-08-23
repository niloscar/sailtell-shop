/**
 * Order service functions for handling order-related operations such as creating orders, updating order status, and deleting orders.
 */

import pool from '../database'
import type { Order, UpdateOrder } from '../types/order'

export async function getOrders() {
  const { rows } = await pool.query<Order>(
    `SELECT
      orders.id,
      orders.customer_id,
      orders.payment_method_id,
      orders.delivery_method_id,
      orders.ordered_at,

      (
        SELECT COALESCE(
          SUM(order_items.quantity * order_items.unit_price),
          0
        )
        FROM order_items
        WHERE order_items.order_id = orders.id
      ) AS sum,

      JSONB_BUILD_OBJECT(
        'id', current_status.id,
        'name', current_status.name
      ) AS order_status

    FROM orders

    LEFT JOIN LATERAL (
      SELECT
        statuses.id,
        statuses.name
      FROM order_statuses
      JOIN statuses
        ON statuses.id = order_statuses.status_id
      WHERE order_statuses.order_id = orders.id
      ORDER BY order_statuses.set_at DESC
      LIMIT 1
    ) AS current_status ON true

    ORDER BY orders.id`
  )

  if (rows.length === 0) throw new Error('Inga beställningar kunde hittas.')

  return rows
}

export async function getOrder(id: number) {
  const { rows } = await pool.query<Order>(
    `SELECT
      orders.id,
      orders.customer_id,
      orders.ordered_at,

      (
        SELECT COALESCE(
          SUM(order_items.quantity * order_items.unit_price),
          0
        )
        FROM order_items
        WHERE order_items.order_id = orders.id
      ) AS sum,

      COALESCE(
        (
          SELECT JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', products.id,
              'product_id', products.id,
              'name', products.name,
              'brand_name', products.brand_name,
              'quantity', order_items.quantity,
              'unit_price', order_items.unit_price
            )
          )
          FROM order_items
          JOIN products
            ON products.id = order_items.product_id
          WHERE order_items.order_id = orders.id
        ),
        '[]'::jsonb
      ) AS order_items,

      JSONB_BUILD_OBJECT(
        'id', payment_methods.id,
        'name', payment_methods.name
      ) AS payment_method,

      JSONB_BUILD_OBJECT(
        'id', delivery_methods.id,
        'name', delivery_methods.name
      ) AS delivery_method,

      JSONB_BUILD_OBJECT(
        'id', shipping_addresses.id,
        'street', shipping_addresses.street,
        'zipcode', shipping_addresses.zipcode,
        'city', shipping_addresses.city,
        'country', shipping_addresses.country
      ) AS shipping_address,

      JSONB_BUILD_OBJECT(
        'id', current_status.id,
        'name', current_status.name
      ) AS order_status

    FROM orders

    LEFT JOIN payment_methods
      ON payment_methods.id = orders.payment_method_id

    LEFT JOIN delivery_methods
      ON delivery_methods.id = orders.delivery_method_id

    LEFT JOIN shipping_addresses
      ON shipping_addresses.order_id = orders.id

    LEFT JOIN LATERAL (
      SELECT
        statuses.id,
        statuses.name
      FROM order_statuses
      JOIN statuses
        ON statuses.id = order_statuses.status_id
      WHERE order_statuses.order_id = orders.id
      ORDER BY order_statuses.set_at DESC
      LIMIT 1
    ) AS current_status ON true

    WHERE orders.id = $1;`,
    [id]
  )

  if (rows.length === 0) throw new Error('Beställningen kunde inte hittas.')

  return rows[0]
}

export async function createOrder(customer_id: number, payment_method_id: number, delivery_method_id: number, ordered_at: string, sum: number) {
  const { rows } = await pool.query<Order>(
    `INSERT INTO orders (customer_id, payment_method_id, delivery_method_id, ordered_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, customer_id, payment_method_id, delivery_method_id, ordered_at`,
    [customer_id, payment_method_id, delivery_method_id, ordered_at, sum]
  )

  return rows[0]
}

export async function updateOrder(id: number, updates: UpdateOrder) {
  const setClauses = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`)
  const values = Object.values(updates)

  const { rows } = await pool.query<Order>(
    `UPDATE orders
    SET ${setClauses.join(', ')}
    WHERE id = $1
    RETURNING id, customer_id, payment_method_id, delivery_method_id, ordered_at`,
    [id, ...values]
  )

  if (rows.length === 0) throw new Error('Beställningen kunde inte uppdateras.')

  return rows[0]
}

export async function deleteOrder(id: number) {
  const { rowCount } = await pool.query(
    `UPDATE orders
    SET deleted_at = NOW()
    WHERE id = $1`,
    [id]
  )

  if (rowCount === 0) throw new Error('Beställningen kunde inte tas bort.')
}

export async function addOrderStatus(orderId: number) {
  const { rows } = await pool.query(
    `INSERT INTO order_statuses (order_id, status_id)
    VALUES ($1, 1)
    RETURNING id, order_id, status_id, set_at`,
    [orderId]
  )

  if (rows.length === 0) throw new Error('Orderstatus kunde inte läggas till.')

  return rows[0]
}

export async function updateOrderStatus(orderId: number, statusId: number) {
  const { rows } = await pool.query(
    `UPDATE order_statuses
    SET status_id = $2, set_at = NOW()
    WHERE order_id = $1
    RETURNING id, order_id, status_id, set_at`,
    [orderId, statusId]
  )

  if (rows.length === 0) throw new Error('Orderstatus kunde inte uppdateras.')

  return rows[0]
}

export async function addShippingAddress(
  orderId: number, 
  fname: string, 
  lname: string, 
  street: string, 
  city: string, 
  zipcode: string, 
  country: string) {
  const { rows } = await pool.query(
    `INSERT INTO shipping_addresses (order_id, fname, lname, street, city, zipcode, country)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, order_id, fname, lname, street, city, zipcode, country`,
    [orderId, fname, lname, street, city, zipcode, country]
  )

  if (rows.length === 0) throw new Error('Leveransadress kunde inte läggas till.')

  return rows[0]
}

export async function getShippingAddress(orderId: number) {
  const { rows } = await pool.query(
    `SELECT id, order_id, fname, lname, street, city, zipcode, country
    FROM shipping_addresses
    WHERE order_id = $1`,
    [orderId]
  )

  if (rows.length === 0) throw new Error('Leveransadress kunde inte hittas.')

  return rows[0]
}

export async function addOrderItems(orderId: number, items: { product_id: number, quantity: number }[]) {
  const values = items.map((item, index) => {
  const productId = index * 2 + 2 // Since the first parameter always is the orderId, we need to offset productId by 2 for each item.
  const quantity = index * 2 + 3 // Same as for productId, offset by 2 for each item.

  return `($1, $${productId}, $${quantity})`
}).join(', ')
  const queryParams = [orderId, ...items.flatMap(item => [item.product_id, item.quantity])]

  const { rows } = await pool.query(
    `INSERT INTO order_items (order_id, product_id, quantity)
    VALUES ${values}
    RETURNING id, order_id, product_id, quantity`,
    queryParams
  )

  if (rows.length === 0) throw new Error('Orderartiklar kunde inte läggas till.')

  return rows
}