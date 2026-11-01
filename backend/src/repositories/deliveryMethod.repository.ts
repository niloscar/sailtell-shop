import pool from '../database'

export async function getDeliveryMethodPrice(
  deliveryMethodId: number
): Promise<number> {
  const { rows } = await pool.query<{ price: number }>(
    `SELECT price
     FROM delivery_methods
     WHERE id = $1`,
    [deliveryMethodId]
  )

  const price = rows[0]?.price

  if (price === undefined || !Number.isSafeInteger(price) || price < 0) {
    throw new Error('Leveransmetoden saknar ett giltigt fraktpris.')
  }

  return price
}
