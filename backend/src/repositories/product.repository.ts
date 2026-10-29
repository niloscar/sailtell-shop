/**
 * Product repository functions for handling product-related operations such as new products, updates and deletes.
 */

import pool from '../database'
import { findCategoryBySlug } from './category.repository'

import type {
  CreateProduct,
  Product,
  ProductSummary,
  UpdateProduct
} from '@shop/shared'
import type { SupplierImportProduct } from '../services/supplier.service'

export async function getProductOptions() {
  const { rows } = await pool.query(
    `SELECT
      (
        SELECT COALESCE(
          JSONB_AGG(DISTINCT purchase_type),
          '[]'::jsonb
        )
        FROM products
        WHERE purchase_type IS NOT NULL
      ) AS purchase_types,

      (
        SELECT COALESCE(
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', categories.id,
              'name', categories.name
            )
            ORDER BY categories.name
          ),
          '[]'::jsonb
        )
        FROM categories
      ) AS categories`
  )

  if (rows.length === 0) throw new Error('Kunde inte hämta produktalternativ.')

  return rows[0]
}

async function getProducts({ categoryId, skus }: { categoryId?: number; skus?: string[] } = {}) {
  const { rows } = await pool.query<ProductSummary>(
    `SELECT
      products.id,
      products.sku,
      products.name,
      products.brand_name,
      products.description,
      products.details,
      products.img_url,
      products.img_path,
      products.stock,
      products.purchase_type,
      products.sort_order,
      latest_price.price,
      COALESCE(
        JSONB_AGG(
          DISTINCT JSONB_BUILD_OBJECT(
            'id', categories.id,
            'name', categories.name
          )
        ) FILTER (WHERE categories.id IS NOT NULL),
        '[]'::jsonb
      ) AS categories
    FROM products

    LEFT JOIN LATERAL (
      SELECT price
      FROM prices
      WHERE prices.product_id = products.id
      ORDER BY prices.set_at DESC
      LIMIT 1
    ) AS latest_price ON true

    LEFT JOIN product_categories
      ON product_categories.product_id = products.id

    LEFT JOIN categories
      ON categories.id = product_categories.category_id

    WHERE products.deleted_at IS NULL
    AND (
      $1::int IS NULL
      OR EXISTS (
        SELECT 1
        FROM product_categories pc
        WHERE pc.product_id = products.id
          AND pc.category_id = $1
      )
    )
    AND (
      $2::text[] IS NULL
      OR products.sku = ANY($2::text[])
    )
      
    GROUP BY
      products.id,
      latest_price.price

    ORDER BY 
      products.sort_order ASC, 
      products.id ASC`,
    [categoryId ?? null, skus ?? null]
  )

  return rows
}

export async function getAllProducts() {
  const products = await getProducts()

  return {
    products,
    category: null
  }
}

export async function getProductsBySkus(skus: string[]) {
  if (skus.length === 0) return []

  return getProducts({ skus })
}

export async function getProductsByCategorySlug(categorySlug: string) {
  const category = await findCategoryBySlug(categorySlug)

  if (!category) throw new Error('Kategorin kunde inte hittas.')

  const products = await getProducts({ categoryId: category.id })

  return {
    products,
    category
  }
}

export async function getProduct(id: number) {
  const { rows } = await pool.query<Product>(
    `SELECT DISTINCT ON (products.id)
      products.id,
      products.sku,
      products.name,
      products.brand_name,
      products.description,
      products.details,
      products.img_url,
      products.img_path,
      products.stock,
      products.purchase_type,
      prices.price AS "price",

      COALESCE(
        (
          SELECT JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', categories.id,
              'name', categories.name
            )
          )
          FROM product_categories
          JOIN categories
            ON categories.id = product_categories.category_id
          WHERE product_categories.product_id = products.id
        ),
        '[]'::jsonb
      ) AS categories,

      COALESCE(
        (
          SELECT JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', product_distribution_links.id,
              'distributor', product_distribution_links.distributor,
              'download_url', product_distribution_links.download_url,
              'badge_url', product_distribution_links.badge_url
            )
          )
          FROM product_distribution_links
          WHERE product_distribution_links.product_id = products.id
        ),
        '[]'::jsonb
      ) AS product_distribution_links

    FROM products
    JOIN prices
      ON products.id = prices.product_id
    WHERE products.id = $1
      AND products.deleted_at IS NULL
    ORDER BY products.id, prices.set_at DESC`,
    [id]
  )

  const product = rows[0]

  if (!product) {
    throw new Error('Produkten kunde inte hittas.')
  }

  return product
}

export async function createProduct(product: CreateProduct) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const { rows } = await client.query<{ id: number }>(
      `INSERT INTO products (
        name,
        brand_name,
        description,
        details,
        img_url,
        stock,
        purchase_type
      )
      VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
      RETURNING id`,
      [
        product.name,
        product.brand_name,
        product.description,
        JSON.stringify(product.details),
        product.img_url,
        product.stock,
        product.purchase_type
      ]
    )

    const createdProduct = rows[0]

    if (!createdProduct) {
      throw new Error('Kunde inte skapa produkten.')
    }

    const productId = createdProduct.id

    await client.query(
      `INSERT INTO prices (
        product_id,
        price
      )
      VALUES ($1, $2)`,
      [productId, product.price]
    )

    // ONTODO: Move this logic to the database instead.
    await client.query(
      `UPDATE products
      SET sku = 'SHOP-' || CASE
        WHEN id < 10000 THEN LPAD(id::text, 4, '0')
        ELSE id::text
      END
      WHERE id = $1`,
      [productId]
    )

    for (const categoryId of product.category_ids) {
      await client.query(
        `INSERT INTO product_categories (
          product_id,
          category_id
        )
        VALUES ($1, $2)`,
        [productId, categoryId]
      )
    }

    await client.query('COMMIT')

    return getProduct(productId)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const productColumns = [
  'name',
  'brand_name',
  'description',
  'details',
  'img_url',
  'stock',
  'purchase_type',
  'sort_order'
] as const

export async function updateProduct(id: number, updates: UpdateProduct) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const { category_ids, price, ...productUpdates } = updates

    const fieldsToUpdate: string[] = []
    const values: unknown[] = []

    for (const [key, value] of Object.entries(productUpdates)) {
      if (value === undefined) continue

      if (!productColumns.includes(key as (typeof productColumns)[number])) {
        continue
      }

      if (key === 'details') {
        values.push(JSON.stringify(value))
        fieldsToUpdate.push(`${key} = $${values.length}::jsonb`)
      } else {
        values.push(value)
        fieldsToUpdate.push(`${key} = $${values.length}`)
      }
    }

    if (fieldsToUpdate.length > 0) {
      values.push(id)

      await client.query(
        `UPDATE products
         SET ${fieldsToUpdate.join(', ')}
         WHERE id = $${values.length}`,
        values
      )
    }

    if (category_ids !== undefined) {
      await client.query(
        `DELETE FROM product_categories
         WHERE product_id = $1`,
        [id]
      )

      for (const categoryId of category_ids) {
        await client.query(
          `INSERT INTO product_categories (
            product_id,
            category_id
          )
          VALUES ($1, $2)`,
          [id, categoryId]
        )
      }
    }

    if (price !== undefined) {
      const { rows } = await client.query<{ price: number }>(
        `SELECT price
         FROM prices
         WHERE product_id = $1
         ORDER BY set_at DESC
         LIMIT 1`,
        [id]
      )

      const currentPrice = rows[0]?.price

      if (Number(currentPrice) !== Number(price)) {
        await client.query(
          `INSERT INTO prices (
            product_id,
            price
          )
          VALUES ($1, $2)`,
          [id, price]
        )
      }
    }

    await client.query('COMMIT')

    return getProduct(id)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function deleteProduct(id: number) {
  const { rows } = await pool.query<{ sku: string }>(
    `UPDATE products
     SET deleted_at = NOW()
     WHERE id = $1
     RETURNING sku`,
    [id]
  )

  const deletedProduct = rows[0]

  if (!deletedProduct) {
    throw new Error('Produkten kunde inte hittas.')
  }

  return deletedProduct.sku
}

export async function upsertSupplierProduct(product: SupplierImportProduct): Promise<'created' | 'updated'> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const { rows: existingRows } = await client.query<{ id: number }>(
      `SELECT id
       FROM products
       WHERE sku = $1
       FOR UPDATE`,
      [product.sku]
    )

    const existingProduct = existingRows[0]
    let productId: number

    if (existingProduct) {
      productId = existingProduct.id

      await client.query(
        `UPDATE products
         SET
           ean = $2,
           name = $3,
           stock = $4,
           variants = $5::jsonb,
           updated_at = NOW()
         WHERE id = $1`,
        [
          productId,
          product.ean,
          product.name,
          product.stock,
          JSON.stringify(product.variants)
        ]
      )
    } else {
      const { rows } = await client.query<{ id: number }>(
        `INSERT INTO products (
          sku,
          ean,
          name,
          stock,
          variants,
          source
        )
        VALUES ($1, $2, $3, $4, $5::jsonb, 'supplier')
        ON CONFLICT (sku) DO UPDATE SET
          ean = EXCLUDED.ean,
          name = EXCLUDED.name,
          stock = EXCLUDED.stock,
          variants = EXCLUDED.variants,
          updated_at = NOW()
        RETURNING id`,
        [
          product.sku,
          product.ean,
          product.name,
          product.stock,
          JSON.stringify(product.variants)
        ]
      )

      const savedProduct = rows[0]

      if (!savedProduct) {
        throw new Error(`Kunde inte spara produkten ${product.sku}.`)
      }

      productId = savedProduct.id
    }

    const { rows: priceRows } = await client.query<{ price: string }>(
      `SELECT price
       FROM prices
       WHERE product_id = $1
       ORDER BY set_at DESC, id DESC
       LIMIT 1`,
      [productId]
    )

    if (
      !priceRows[0] ||
      Number(priceRows[0].price) !== product.price
    ) {
      await client.query(
        `INSERT INTO prices (product_id, price)
         VALUES ($1, $2)`,
        [productId, product.price]
      )
    }

    await client.query('COMMIT')

    return existingProduct ? 'updated' : 'created'
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function updateProductImage(id: number, path: string, url: string) {
  const { rowCount } = await pool.query(
    `UPDATE products
     SET img_path = $1,
         img_url = $2
     WHERE id = $3
       AND deleted_at IS NULL`,
    [path, url, id]
  )

  if (rowCount === 0) {
    throw new Error('Produkten kunde inte hittas.')
  }
}
