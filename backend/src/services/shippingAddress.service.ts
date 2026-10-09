/**
 * Shipping address service functions for handling shipping address-related operations such as creating and retrieving shipping addresses.
 */

import pool from "../database";
import { DbClient } from "../types/database.types";

export async function createShippingAddress(
  orderId: number,
  fname: string,
  lname: string,
  street: string,
  city: string,
  zipcode: string,
  country: string,
  db: DbClient = pool,
) {
  const { rows } = await db.query(
    `INSERT INTO shipping_addresses (order_id, fname, lname, street, city, zipcode, country)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, order_id, fname, lname, street, city, zipcode, country`,
    [orderId, fname, lname, street, city, zipcode, country],
  );

  if (rows.length === 0)
    throw new Error("Leveransadress kunde inte läggas till.");

  return rows[0];
}

export async function getShippingAddress(orderId: number, db: DbClient = pool) {
  const { rows } = await db.query(
    `SELECT id, order_id, fname, lname, street, city, zipcode, country
    FROM shipping_addresses
    WHERE order_id = $1`,
    [orderId],
  );

  if (rows.length === 0) throw new Error("Leveransadress kunde inte hittas.");

  return rows[0];
}
