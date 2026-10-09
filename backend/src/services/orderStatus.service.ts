/**
 * Order status service functions for handling order status-related operations such as retrieving, creating, and updating order statuses.
 */

import pool from "../database";
import { DbClient } from "../types/database.types";

export async function getOrderStatus(orderId: number, db: DbClient = pool) {
  const { rows } = await db.query(
    `SELECT order_statuses.id, order_statuses.order_id, order_statuses.status_id, order_statuses.set_at
    FROM order_statuses
    WHERE order_statuses.order_id = $1`,
    [orderId],
  );

  if (rows.length === 0) throw new Error("Orderstatus kunde inte hittas.");

  return rows[0];
}

export async function createOrderStatus(
  orderId: number,
  statusId: number,
  db: DbClient = pool,
) {
  const { rows } = await db.query(
    `INSERT INTO order_statuses (order_id, status_id)
    VALUES ($1, $2)
    RETURNING id, order_id, status_id, set_at`,
    [orderId, statusId],
  );

  if (rows.length === 0) throw new Error("Orderstatus kunde inte läggas till.");

  return rows[0];
}

export async function updateOrderStatus(orderId: number, statusId: number) {
  const { rows } = await pool.query(
    `INSERT INTO order_statuses (order_id, status_id, set_at)
    VALUES ($1, $2, NOW())
    RETURNING id, order_id, status_id, set_at`,
    [orderId, statusId],
  );

  if (rows.length === 0) throw new Error("Orderstatus kunde inte uppdateras.");

  return rows[0];
}
