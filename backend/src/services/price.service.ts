/**
 * Price service functions for handling price-related operations such as fetching price history and creating new prices.
 */

import pool from '../database'

export async function getPriceHistory(productId: number) {
  const { rows } = await pool.query(
    `SELECT id, product_id, price, set_at
    FROM prices
    WHERE product_id = $1
    ORDER BY set_at ASC`,
    [productId]
  )

  if (rows.length === 0)
    throw new Error('Inga priser kunde hittas för produkten.')

  return rows
}

export async function getPrice(productId: number) {
  const { rows } = await pool.query(
    `SELECT id, product_id, price, set_at
    FROM prices
    WHERE product_id = $1
    ORDER BY set_at DESC
    LIMIT 1`,
    [productId]
  )

  if (rows.length === 0)
    throw new Error('Priset för produkten kunde inte hittas.')

  return rows[0]
}

export async function createPrice(productId: number, price: number) {
  const { rows } = await pool.query(
    `INSERT INTO prices (product_id, price)
    VALUES ($1, $2)
    RETURNING id, product_id, price, set_at`,
    [productId, price]
  )

  if (rows.length === 0) throw new Error('Priset kunde inte sättas.')

  return rows[0]
}
