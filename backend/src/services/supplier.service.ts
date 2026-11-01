/**
 * Supplier service functions for handling supplier-related operations such as import of products.
 */

import { z } from 'zod'
import { indexAllProducts } from './search.service'
import { getSupplierCatalog } from '../integrations/supplier.adapter'
import { upsertSupplierProduct } from '../repositories/product.repository'

import type { CatalogFormat } from '../integrations/supplier.adapter'

const supplierImportProductSchema = z.object({
  sku: z.string({ error: 'Artikelnummer saknas eller är ogiltigt.' })
    .trim()
    .min(1, { error: 'Artikelnummer saknas.' }),
  ean: z.string({ error: 'Ogiltig EAN-kod.' }).trim(),
  name: z.string({ error: 'Produktnamn saknas eller är ogiltigt.' })
    .trim()
    .min(1, { error: 'Produktnamn saknas.' }),
  price: z.number({ error: 'Ogiltigt pris.' })
    .int({ error: 'Priset måste vara ett heltal i ören.' })
    .nonnegative({ error: 'Priset får inte vara negativt.' }),
  stock: z.number({ error: 'Ogiltigt lagersaldo.' })
    .int({ error: 'Lagersaldot måste vara ett heltal.' })
    .nonnegative({ error: 'Lagersaldot får inte vara negativt.' })
    .nullable(),
  variants: z.array(
    z.string()
      .trim()
      .min(1, { error: 'En variant får inte vara tom.' })
  )
})

export type SupplierImportProduct = z.infer<typeof supplierImportProductSchema>

interface SkippedProduct {
  sku: string | undefined
  reason: string
}

export async function importSupplierProducts(format: CatalogFormat
) {
  const candidates = await getSupplierCatalog(format)

  const validProducts: SupplierImportProduct[] = []
  const skipped: SkippedProduct[] = []

  for (const candidate of candidates) {
    const result = supplierImportProductSchema.safeParse(candidate)

    if (result.success) {
      validProducts.push(result.data)
    } else {
      skipped.push({
        sku: candidate.sku,
        reason: result.error.issues
          .map((issue) => issue.message)
          .join(' ')
      })
    }
  }
  
  let created = 0
  let updated = 0

  for (const product of validProducts) {
    const result = await upsertSupplierProduct(product)

    if (result === 'created') {
      created++
    } else {
      updated++
    }
  }

  let searchIndexUpdated = true

  try {
    await indexAllProducts()
  } catch (error) {
    console.error('Kunde inte uppdatera Algolia efter import:', error)
    searchIndexUpdated = false
  }

  return {
    total: candidates.length,
    created,
    updated,
    skippedCount: skipped.length,
    skipped,
    searchIndexUpdated
  }
}
