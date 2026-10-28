/**
 * Service for handling product indexing and search operations.
 */

import { getAllProducts, getProductsBySkus } from '../repositories/product.repository'
import { indexProducts, searchProducts } from '../integrations/search.adapter'

export async function indexAllProducts() {
  const { products } = await getAllProducts()

  return indexProducts(products)
}

export async function search(query: string, page: number, pageSize: number) {
  const result = await searchProducts(query, page, pageSize)

  const skus = result.products.map((product) => product.sku)

  const products = await getProductsBySkus(skus) // Our database remains the source of truth for product data.

  const productsBySku = new Map(products.map((product) => [product.sku, product]))

  const sortedProducts = skus
    .map((sku) => productsBySku.get(sku))
    .filter((product) => product !== undefined)

  return {
    products: sortedProducts,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages
  }
}
