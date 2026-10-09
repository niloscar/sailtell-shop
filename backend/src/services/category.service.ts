/**
 * Category service functions for handling category-related operations.
 */

import pool from '../database'
import type { Category, UpdateCategory } from '../types/category.types'
import slugify from '../utilities/slugify'

export async function getCategories() {
    const { rows } = await pool.query<Category>(
      `SELECT id, name, description 
      FROM categories
      WHERE deleted_at IS NULL`
    )

    if (rows.length === 0) throw new Error('Inga kategorier kunde hittas.')

    return rows
}

export async function getCategory(id: number) {
    const { rows } = await pool.query<Category>(
      `SELECT id, name, description 
      FROM categories 
      WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    )

    if (rows.length === 0) throw new Error('Kategorin kunde inte hittas.')

    return rows[0]
}

export async function getCategoryBySlug(slug: string) {
  const { rows } = await pool.query<Category>(
    `SELECT id, name
     FROM categories`
  )

  return rows.find(category => slugify(category.name) === slug)
}

export async function createCategory(name: string, description: string) {
    const { rows } = await pool.query<Category>(
        `INSERT INTO categories (name, description) 
        VALUES ($1, $2) 
        RETURNING id, name, description`,
        [name, description]
    )

    if (rows.length === 0) throw new Error('Kategorin kunde inte skapas.')

    return rows[0]
}

export async function updateCategory(id: number, updatedCategory: UpdateCategory) {
    const { rows } = await pool.query<Category>(
        `UPDATE categories 
        SET name = $1, description = $2 
        WHERE id = $3 
        RETURNING id, name, description`,
        [updatedCategory.name, updatedCategory.description, id]
    )

    if (rows.length === 0) throw new Error('Kategorin kunde inte uppdateras.')

    return rows[0]
}

export async function deleteCategory(id: number) {
    const { rows } = await pool.query(
        `UPDATE categories 
        SET deleted_at = now()
        WHERE id = $1 
        RETURNING id`,
        [id]
    )

    if (rows.length === 0) throw new Error('Kategorin kunde inte tas bort.')

    return rows[0]
} 