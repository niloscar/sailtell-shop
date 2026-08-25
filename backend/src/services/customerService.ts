/**
 * Customer service functions for handling customer-related operations such as retrieving, creating, updating, and deleting customers.
 */

import pool from '../database'
import type { Pool, PoolClient } from 'pg'
import type { Customer, CreateCustomer, UpdateCustomer } from '../types/customer'

export async function getCustomers() {
  const { rows } = await pool.query<Customer>(
    `SELECT
      id,
      fname,
      lname,
      email,
      phone
    FROM customers`
  )

  if (rows.length === 0) {
    throw new Error('Inga kunder kunde hittas.')
  }

  return rows
}

export async function getCustomer(id: number) {
  const { rows } = await pool.query<Customer>(
    `SELECT
      id,
      fname,
      lname,
      email,
      phone
    FROM customers
    WHERE id = $1`,
    [id]
  )

  if (rows.length === 0) {
    throw new Error('Kunden kunde inte hittas.')
  }

  return rows[0]
}

export async function createCustomer(customerData: CreateCustomer) {
  const { fname, lname, email, phone } = customerData

  const { rows } = await pool.query<Customer>(
    `INSERT INTO customers (
      fname,
      lname,
      email,
      phone
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      fname,
      lname,
      email,
      phone`,
    [
      fname,
      lname,
      email,
      phone
    ]
  )

  if (rows.length === 0) {
    throw new Error('Kunden kunde inte skapas.')
  }

  return rows[0]
}

export async function getOrCreateCustomer(
  customerData: CreateCustomer,
  db: Pool | PoolClient = pool
) {
  const {
    fname,
    lname,
    email,
    phone,
    street,
    zipcode,
    city,
    country
  } = customerData

  const { rows } = await db.query<Customer>(
    `INSERT INTO customers (
      fname,
      lname,
      email,
      phone,
      street,
      zipcode,
      city,
      country
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (email) DO NOTHING
    RETURNING
      id,
      fname,
      lname,
      email,
      phone`,
    [
      fname,
      lname,
      email,
      phone,
      street,
      zipcode,
      city,
      country
    ]
  )

  if (rows.length > 0) {
    return rows[0]
  }

  const existingCustomerResult = await db.query<Customer>(
    `SELECT
      id,
      fname,
      lname,
      email,
      phone
    FROM customers
    WHERE email = $1`,
    [email]
  )

  if (existingCustomerResult.rows.length === 0) {
    throw new Error('Kunden kunde inte skapas eller hittas.')
  }

  return existingCustomerResult.rows[0]
}

export async function updateCustomer(
  id: number,
  customerData: UpdateCustomer
) {
  const {
    fname,
    lname,
    email,
    phone
  } = customerData

  const { rows } = await pool.query<Customer>(
    `UPDATE customers
     SET
       fname = COALESCE($1, fname),
       lname = COALESCE($2, lname),
       email = COALESCE($3, email),
       phone = COALESCE($4, phone)
     WHERE id = $5
     RETURNING
       id,
       fname,
       lname,
       email,
       phone`,
    [
      fname,
      lname,
      email,
      phone,
      id
    ]
  )

  if (rows.length === 0) {
    throw new Error('Kunden kunde inte uppdateras.')
  }

  return rows[0]
}