/**
 * Customer service functions for handling customer-related operations such as retrieving, creating, updating, and deleting customers.
 */

import pool from '../database'
import type { Customer, UpdateCustomer } from '../types/customer'

export async function getCustomers() {
  const { rows } = await pool.query(`SELECT
      id,
      fname,
      lname,
      email,
      phone
    FROM customers`
  )

  if (rows.length === 0) throw new Error('Inga kunder kunde hittas.')

  return rows
}

export async function getCustomer(id: number) {
  const { rows } = await pool.query(`SELECT
      id,
      fname,
      lname,
      email,
      phone
    FROM customers
    WHERE id = $1`, [id])

  if (rows.length === 0) throw new Error('Kunden kunde inte hittas.')

  return rows[0]
}

export async function createCustomer(customerData: Customer) {
  const { fname, lname, email, phone } = customerData

  const { rows } = await pool.query<Customer>(
    `INSERT INTO customers (fname, lname, email, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, fname, lname, email, phone`,
    [fname, lname, email, phone]
  )

  if (rows.length === 0) throw new Error('Kunden kunde inte skapas.')

  return rows[0]
}

export async function updateCustomer(id: number, customerData: UpdateCustomer) {
  const { fname, lname, email, phone } = customerData

  const { rows } = await pool.query<Customer>(
    `UPDATE customers
     SET fname = COALESCE($1, fname),
         lname = COALESCE($2, lname),
         email = COALESCE($3, email),
         phone = COALESCE($4, phone)
     WHERE id = $5
     RETURNING id, fname, lname, email, phone`,
    [fname, lname, email, phone, id]
  )

  if (rows.length === 0) throw new Error('Kunden kunde inte uppdateras.')

  return rows[0]
}