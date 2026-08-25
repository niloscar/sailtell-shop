/**
 * Service functions for handling cart-related operations.
 */

import pool from '../database'

export async function createCart() {
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

export async function getCart(cartUuid: string) {
  const cartResult = await pool.query(
    `SELECT
      id,
      cart_uuid,
      created_at,
      updated_at
    FROM carts
    WHERE cart_uuid = $1`,
    [cartUuid]
  )

  if (cartResult.rowCount === 0) {
    return null
  }

  const cart = cartResult.rows[0]

  const itemsResult = await pool.query(
    `SELECT
      cart_items.id,
      cart_items.product_id,
      products.name,
      products.brand_name,
      products.img_url,
      cart_items.quantity,
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
    [cart.id]
  )

  return {
    ...cart,
    items: itemsResult.rows
  }
}

export async function addCartItem(
  cartUuid: string,
  productId: number,
  quantity: number
) {
  const cartResult = await pool.query<{ id: number }>(
    `SELECT id
    FROM carts
    WHERE cart_uuid = $1`,
    [cartUuid]
  )

  if (cartResult.rowCount === 0) {
    return null
  }

  const cartId = cartResult.rows[0].id

  await pool.query(
    `INSERT INTO cart_items (
      cart_id,
      product_id,
      quantity
    )
    VALUES ($1, $2, $3)

    ON CONFLICT (cart_id, product_id)
    DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity`,
    [
      cartId,
      productId,
      quantity
    ]
  )

  await pool.query(
    `UPDATE carts
    SET updated_at = NOW()
    WHERE id = $1`,
    [cartId]
  )

  return getCart(cartUuid)
}

export async function updateCartItem(
  cartUuid: string,
  productId: number,
  quantity: number
) {
  const result = await pool.query(
    `UPDATE cart_items

    SET quantity = $1

    WHERE cart_id = (
      SELECT id
      FROM carts
      WHERE cart_uuid = $2
    )
    AND product_id = $3

    RETURNING id`,
    [
      quantity,
      cartUuid,
      productId
    ]
  )

  if (result.rowCount === 0) {
    return null
  }

  await pool.query(
    `UPDATE carts
    SET updated_at = NOW()
    WHERE cart_uuid = $1`,
    [cartUuid]
  )

  return getCart(cartUuid)
}

export async function deleteCartItem(
  cartUuid: string,
  productId: number
) {
  const result = await pool.query(
    `DELETE FROM cart_items

    WHERE cart_id = (
      SELECT id
      FROM carts
      WHERE cart_uuid = $1
    )
    AND product_id = $2

    RETURNING id`,
    [
      cartUuid,
      productId
    ]
  )

  if (result.rowCount === 0) {
    return null
  }

  await pool.query(
    `UPDATE carts
    SET updated_at = NOW()
    WHERE cart_uuid = $1`,
    [cartUuid]
  )

  return getCart(cartUuid)
}