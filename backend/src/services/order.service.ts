/**
 * Order service functions for handling order-related operations such as creating orders, updating order status, and deleting orders.
 */

import pool, { withTransaction } from '../database'
import type { Pool, PoolClient } from 'pg'
import type { Order, UpdateOrder, CreateOrder } from '../types/order.types'

import { getOrCreateCustomer } from './customer.service'
import { createShippingAddress } from './shippingAddress.service'
import { createOrderItems } from './orderItem.service'
import { createOrderStatus } from './orderStatus.service'

import HttpError from '../utilities/HttpError'

export async function getOrderOptions() {
  const { rows } = await pool.query(
    `SELECT
      (
        SELECT COALESCE(
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', payment_methods.id,
              'name', payment_methods.name
            )
            ORDER BY payment_methods.name
          ),
          '[]'::jsonb
        )
        FROM payment_methods
        WHERE payment_methods.is_active = TRUE
      ) AS payment_methods,

      (
        SELECT COALESCE(
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', delivery_methods.id,
              'name', delivery_methods.name
            )
            ORDER BY delivery_methods.name
          ),
          '[]'::jsonb
        )
        FROM delivery_methods
      ) AS delivery_methods,

      (
        SELECT COALESCE(
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', statuses.id,
              'name', statuses.name
            )
            ORDER BY statuses.id
          ),
          '[]'::jsonb
        )
        FROM statuses
      ) AS statuses`
  )

  if (rows.length === 0) {
    throw new Error('Inga orderalternativ kunde hittas.')
  }

  return rows[0]
}

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
        'name', current_status.name,
        'set_at', current_status.set_at
      ) AS order_status

    FROM orders

    LEFT JOIN LATERAL (
      SELECT
        statuses.id,
        statuses.name,
        order_statuses.set_at
      FROM order_statuses
      JOIN statuses
        ON statuses.id = order_statuses.status_id
      WHERE order_statuses.order_id = orders.id
      ORDER BY order_statuses.set_at DESC
      LIMIT 1
    ) AS current_status ON true

    WHERE orders.deleted_at IS NULL
    ORDER BY orders.id`
  )

  if (rows.length === 0) throw new Error('Inga beställningar kunde hittas.')

  return rows
}

export async function getOrder(id: number, db: Pool | PoolClient = pool) {
  const { rows } = await db.query<Order>(
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
        'name', current_status.name,
        'set_at', current_status.set_at
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
        statuses.name,
        order_statuses.set_at
      FROM order_statuses
      JOIN statuses
        ON statuses.id = order_statuses.status_id
      WHERE order_statuses.order_id = orders.id
      ORDER BY order_statuses.set_at DESC
      LIMIT 1
    ) AS current_status ON true

    WHERE orders.id = $1 AND orders.deleted_at IS NULL`,
    [id]
  )

  const order = rows[0]

  if (!order) {
    throw new Error('Beställningen kunde inte hittas.')
  }

  return order
}

export async function createOrder(order: CreateOrder) {
  return withTransaction(async (client) => {
    // Validate order items and stock
    if (!order.order_items.length) {
      throw new Error('Ordern måste innehålla minst en produkt.')
    }

    const productIds = new Set<number>()

    for (const item of order.order_items) {
      if (
        !Number.isInteger(item.product_id) ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        throw new Error('Ogiltig produkt eller antal.')
      }

      if (productIds.has(item.product_id)) {
        throw new Error('Samma produkt förekommer flera gånger.')
      }

      productIds.add(item.product_id)

      const { rows } = await client.query<{ name: string; stock: number | null }>(
        `SELECT name, stock
         FROM products
         WHERE id = $1
           AND deleted_at IS NULL
         FOR UPDATE`,
        [item.product_id]
      )

      const product = rows[0]

      if (!product) {
        throw new HttpError(400, 'Produkten kunde inte hittas.')
      }

      if (product.stock === null) {
        throw new HttpError(400, `${product.name} är inte tillgänglig för köp.`)
      }

      if (product.stock < item.quantity) {
        throw new HttpError(400, `Det finns endast ${product.stock} st av ${product.name} i lager.`)
      }
    }

    // Get existing customer or create a new one
    const customer = await getOrCreateCustomer(
      {
        fname: order.customer.fname,
        lname: order.customer.lname,
        email: order.customer.email,
        phone: order.customer.phone,
        street: order.shipping_address.street,
        zipcode: order.shipping_address.zipcode,
        city: order.shipping_address.city,
        country: order.shipping_address.country
      },
      client
    )

    const customerId = customer.id

    // Create the order
    const { rows } = await client.query<{ id: number }>(
      `INSERT INTO orders (
        customer_id,
        payment_method_id,
        delivery_method_id,
        ordered_at
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id`,
      [
        customerId,
        order.payment_method_id,
        order.delivery_method_id,
        order.ordered_at ?? new Date()
      ]
    )

    const createdOrder = rows[0]

    if (!createdOrder) {
      throw new Error('Beställningen kunde inte skapas.')
    }

    const orderId = createdOrder.id

    // Create the shipping address
    await createShippingAddress(
      orderId,
      order.shipping_address.fname,
      order.shipping_address.lname,
      order.shipping_address.street,
      order.shipping_address.city,
      order.shipping_address.zipcode,
      order.shipping_address.country,
      client
    )

    // Create the order items
    await createOrderItems(orderId, order.order_items, client)

    // Set the initial order status to "Väntar på betalning"
    await createOrderStatus(orderId, 7, client)

    // Return the complete order details
    return getOrder(orderId, client)
  })
}

export async function updateOrder(id: number, updates: UpdateOrder) {
  if (Object.keys(updates).length === 0)
    throw new Error('Inga uppgifter att uppdatera.')

  const setClauses = Object.keys(updates).map(
    (key, index) => `${key} = $${index + 2}`
  )

  const values = Object.values(updates)

  const { rows } = await pool.query<{ id: number }>(
    `UPDATE orders
     SET ${setClauses.join(', ')}
     WHERE id = $1
       AND deleted_at IS NULL
     RETURNING id`,
    [id, ...values]
  )

  const updatedOrder = rows[0]

  if (!updatedOrder) {
    throw new Error('Beställningen du vill uppdatera kunde inte hittas.')
  }

  return getOrder(updatedOrder.id)
}

export async function deleteOrder(id: number) {
  const { rowCount } = await pool.query(
    `UPDATE orders
    SET deleted_at = NOW()
    WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  )

  if (rowCount === 0)
    throw new Error('Beställningen du vill ta bort kunde inte hittas.')
}
