/**
 * Service for handling product indexing and search operations.
 */

import { getAllProducts } from '../repositories/product.repository'
import { indexProducts, searchProducts } from '../integrations/search.adapter'

export async function indexAllProducts() {
  const { products } = await getAllProducts()

  return indexProducts(products)
}

export async function search(query: string, page: number, pageSize: number) {
  return searchProducts(query, page, pageSize)
}
