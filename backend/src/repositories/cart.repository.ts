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

export async function findCartByUuid(cartUuid: string) {
  const result = await pool.query(
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

export async function getCartItems(cartId: number) {
  const result = await pool.query(
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

export async function upsertCartItem(
  cartId: number,
  productId: number,
  quantity: number
) {
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
    [cartId, productId, quantity]
  )
}

export async function updateCartItemQuantity(
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
    [quantity, cartUuid, productId]
  )

  return (result.rowCount ?? 0) > 0
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
    [cartUuid, productId]
  )

  return (result.rowCount ?? 0) > 0
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