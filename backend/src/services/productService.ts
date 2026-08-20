/**
 * Product service functions for handling product-related operations such as new products, updates and deletes.
 */

import pool from '../database'
import type { Product, UpdateProduct } from '../types/product'

export async function getProducts() {
  const { rows } = await pool.query<Product>(
    `SELECT DISTINCT ON (products.id)
      products.id,
      products.name,
      products.brand_name,
      products.description,
      products.details,
      products.stock,
      prices.price AS "price"
    FROM products
    JOIN prices ON products.id = prices.product_id
    ORDER BY products.id, prices.set_at DESC`
  )

  if (rows.length === 0) throw new Error('Inga produkter kunde hittas.')

  return rows
}

export async function getProduct(id: number) {
  const { rows } = await pool.query<Product>(
    `SELECT DISTINCT ON (products.id)
      products.id,
      products.name,
      products.brand_name,
      products.description,
      products.details,
      products.stock,
      prices.price AS "price"
    FROM products
    JOIN prices ON products.id = prices.product_id
    WHERE products.id = $1
    ORDER BY products.id, prices.set_at DESC`,
    [id]
  )

  if (rows.length === 0) throw new Error('Produkten kunde inte hittas.')

  return rows[0]
}

export async function createProduct(name: string, description: string, details: [], stock: number) {
  const { rows } = await pool.query<Product>(
    `INSERT INTO products (name, description, details, stock) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, name, description, details, stock`,
    [name, description, details, stock]
  )

  return rows[0]
}

const columnMap = {
  name: 'name',
  brand_name: 'brand_name',
  description: 'description',
  details: 'details',
  stock: 'stock'
} as const

export async function updateProduct(id: number, updates: UpdateProduct) {
  const fieldsToUpdate: string[] = []
  const values: any[] = []

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) continue

    const column = columnMap[key as keyof UpdateProduct]

    values.push(value)
    fieldsToUpdate.push(`${column} = $${values.length}`)
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error('Inga fält att uppdatera.')
  }

  values.push(id) // Add the product ID as the last parameter

  const { rows } = await pool.query<Product>(
    `UPDATE products 
        SET ${fieldsToUpdate.join(', ')} 
        WHERE id = $${values.length} 
        RETURNING id, name, description, stock, created_at, updated_at`,
    values
  )

  if (rows.length === 0) {
    throw new Error('Produkten kunde inte hittas.')
  }

  return rows[0]
}

export async function deleteProduct(id: number) {
  const { rowCount } = await pool.query(
    `DELETE FROM products 
      WHERE id = $1`,
    [id]
  )

  if (rowCount === 0) {
    throw new Error('Produkten kunde inte hittas.')
  }
}