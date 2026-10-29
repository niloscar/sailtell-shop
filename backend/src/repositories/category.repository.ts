/**
 * Category repository functions for handling category-related operations such as new categories, updates and deletes.
 */

import pool from '../database'
import type { Category, UpdateCategory } from '../types/category.types'

export async function findCategories() {
  const { rows } = await pool.query<Category>(
    `SELECT id, name, description
    FROM categories
    WHERE deleted_at IS NULL`
  )

  return rows
}

export async function findCategoryById(id: number) {
  const { rows } = await pool.query<Category>(
    `SELECT id, name, description
    FROM categories
    WHERE id = $1
      AND deleted_at IS NULL`,
    [id]
  )

  return rows[0] ?? null
}

export async function findCategoryBySlug(slug: string) {
  const { rows } = await pool.query<Category>(
    `SELECT id, name, description
    FROM categories
    WHERE slug = $1
      AND deleted_at IS NULL`,
    [slug]
  )

  return rows[0] ?? null
}

export async function findCategoryNames() {
  const { rows } = await pool.query<Pick<Category, 'id' | 'name'>>(
    `SELECT id, name
    FROM categories
    WHERE deleted_at IS NULL`
  )

  return rows
}

export async function createCategory(name: string, description: string) {
  const { rows } = await pool.query<Category>(
    `INSERT INTO categories (name, description)
    VALUES ($1, $2)
    RETURNING id, name, description`,
    [name, description]
  )

  return rows[0] ?? null
}

export async function updateCategory(
  id: number,
  updatedCategory: UpdateCategory
) {
  const { rows } = await pool.query<Category>(
    `UPDATE categories
    SET name = $1,
        description = $2
    WHERE id = $3
      AND deleted_at IS NULL
    RETURNING id, name, description`,
    [updatedCategory.name, updatedCategory.description, id]
  )

  return rows[0] ?? null
}

export async function deleteCategory(id: number) {
  const { rows } = await pool.query<{ id: number }>(
    `UPDATE categories
    SET deleted_at = NOW()
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING id`,
    [id]
  )

  return rows[0] ?? null
}
