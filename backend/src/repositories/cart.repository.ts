/**
 * Cart repository functions for handling cart-related operations such as creating carts, adding items, and updating item quantities.
 */

import pool from '../database'
import HttpError from '../utilities/HttpError'
import type { Cart, CartItem } from '@shop/shared'

type CartRecord = Pick<Cart, 'id' | 'cart_uuid' | 'created_at' | 'updated_at'>

export async function createCart(): Promise<CartRecord> {
  const result = await pool.query(
    `INSERT INTO carts DEFAULT VALUES
    RETURNING
      id,
      cart_uuid,
      created_at,
      updated_at`
  )

  return result.rows[0]
}

export async function findCartByUuid(
  cartUuid: string
): Promise<CartRecord | null> {
  const result = await pool.query<CartRecord>(
    `SELECT
      id,
      cart_uuid,
      created_at,
      updated_at
    FROM carts
    WHERE cart_uuid = $1`,
    [cartUuid]
  )

  return result.rows[0] ?? null
}

export async function getCartItems(cartId: number): Promise<CartItem[]> {
  const result = await pool.query<CartItem>(
    `SELECT
      cart_items.id,
      cart_items.product_id,
      products.name,
      products.brand_name,
      products.img_url,
      cart_items.quantity,
      products.stock,
      latest_price.price
    FROM cart_items

    JOIN products
      ON products.id = cart_items.product_id

    LEFT JOIN LATERAL (
      SELECT price
      FROM prices
      WHERE prices.product_id = products.id
      ORDER BY prices.set_at DESC
      LIMIT 1
    ) latest_price ON true

    WHERE cart_items.cart_id = $1

    ORDER BY cart_items.id`,
    [cartId]
  )

  return result.rows
}

export async function findCartIdByUuid(cartUuid: string) {
  const result = await pool.query<{ id: number }>(
    `SELECT id
    FROM carts
    WHERE cart_uuid = $1`,
    [cartUuid]
  )

  return result.rows[0]?.id ?? null
}

export async function upsertCartItem(cartId: number, productId: number, quantity: number) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new HttpError(400, 'Antalet måste vara ett positivt heltal.')
  }
  
  const { rowCount } = await pool.query(
    `INSERT INTO cart_items (
      cart_id,
      product_id,
      quantity
    )
    SELECT $1, p.id, $3
    FROM products p
    WHERE p.id = $2
      AND p.deleted_at IS NULL
      AND p.stock >= $3

    ON CONFLICT (cart_id, product_id)
    DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity

    WHERE (
      SELECT stock
      FROM products
      WHERE id = EXCLUDED.product_id
    ) >= cart_items.quantity + EXCLUDED.quantity`,
    [cartId, productId, quantity]
  )

  if (rowCount !== 1) {
    throw new HttpError(400, 'Det önskade antalet överstiger tillgängligt lagersaldo.')
  }
}

export async function updateCartItemQuantity(cartUuid: string, productId: number, quantity: number) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new HttpError(400, 'Antalet måste vara ett positivt heltal.')
  }

  const { rowCount } = await pool.query(
    `UPDATE cart_items
     SET quantity = $1
     WHERE cart_id = (
       SELECT id
       FROM carts
       WHERE cart_uuid = $2
     )
     AND product_id = $3
     AND quantity > 0
     AND EXISTS (
       SELECT 1
       FROM products
       WHERE id = $3
         AND deleted_at IS NULL
         AND stock >= $1
     )`,
    [quantity, cartUuid, productId]
  )

  if (rowCount !== 1) {
    throw new HttpError(400, 'Det önskade antalet överstiger tillgängligt lagersaldo.')
  }

  return true
}

export async function deleteCartItem(cartUuid: string, productId: number) {
  const result = await pool.query(
    `DELETE FROM cart_items

    WHERE cart_id = (
      SELECT id
      FROM carts
      WHERE cart_uuid = $1
    )
    AND product_id = $2

    RETURNING id`,
    [cartUuid, productId]
  )

  return result.rows.length > 0
}

export async function touchCartById(cartId: number) {
  await pool.query(
    `UPDATE carts
    SET updated_at = NOW()
    WHERE id = $1`,
    [cartId]
  )
}

export async function touchCartByUuid(cartUuid: string) {
  await pool.query(
    `UPDATE carts
    SET updated_at = NOW()
    WHERE cart_uuid = $1`,
    [cartUuid]
  )
}
