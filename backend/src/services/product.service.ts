/**
 * Service for handling product-related operations.
 */

import * as repository from '../repositories/product.repository'
import { indexProducts, removeIndexedProduct } from '../integrations/search.adapter'
import { z } from 'zod'
import HttpError from '../utilities/HttpError'

import type { CreateProduct, UpdateProduct } from '@shop/shared'

const priceSchema = z.number()
  .int()
  .nonnegative()

function validatePrice(price: number | undefined) {
  if (price !== undefined && !priceSchema.safeParse(price).success) {
    throw new HttpError(400, 'Priset måste vara ett heltal i ören.')
  }
}

export async function createProduct(product: CreateProduct) {
  validatePrice(product.price)
  const createdProduct = await repository.createProduct(product)

  try {
    await indexProducts([createdProduct])
    return { product: createdProduct, searchIndexUpdated: true }
  } catch (error) {
    console.error('Kunde inte uppdatera Algolia:', error)
    return { product: createdProduct, searchIndexUpdated: false }
  }
}

export async function updateProduct(id: number, updates: UpdateProduct) {
  validatePrice(updates.price)
  const updatedProduct = await repository.updateProduct(id, updates)

  try {
    await indexProducts([updatedProduct])
    return { product: updatedProduct, searchIndexUpdated: true }
  } catch (error) {
    console.error('Kunde inte uppdatera Algolia:', error)
    return { product: updatedProduct, searchIndexUpdated: false }
  }
}

export async function deleteProduct(id: number) {
  const sku = await repository.deleteProduct(id)

  try {
    await removeIndexedProduct(sku)
    return { searchIndexUpdated: true }
  } catch (error) {
    console.error('Kunde inte ta bort produkten från Algolia:', error)
    return { searchIndexUpdated: false }
  }
}
