/**
 * Adapter for interacting with the Algolia search and indexing service.
 */ 

import { algoliasearch } from 'algoliasearch'
import { Product } from '@shop/shared'

import type { ProductSummary } from '@shop/shared'

const APP_ID = process.env.ALGOLIA_APP_ID ?? ''
const ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY ?? ''
const SEARCH_API_KEY = process.env.ALGOLIA_SEARCH_API_KEY ?? ''
const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME ?? 'products'

const adminClient = algoliasearch(APP_ID, ADMIN_API_KEY)
const searchClient = algoliasearch(APP_ID, SEARCH_API_KEY)

export interface SearchProduct {
  objectID: string
  name: string
  brand_name: string | null
  description: string | null
  details: string[]
  categories: string[]
}

export async function indexProducts(products: ProductSummary[]) {
  const objects = products.map((product) => ({
    objectID: product.sku,
    name: product.name,
    brand_name: product.brand_name,
    description: product.description,
    details: product.details,
    categories: product.categories.map((category) => category.name)
  }))

  return adminClient.saveObjects({
    indexName: INDEX_NAME,
    objects
  })
}

export async function removeIndexedProduct(sku: string) {
  return adminClient.deleteObject({
    indexName: INDEX_NAME,
    objectID: sku
  })
}

export async function searchProducts(query: string, page: number, pageSize: number) {
  return searchClient.searchSingleIndex<Product>({
    indexName: INDEX_NAME,
    searchParams: {
      query,
      page: page - 1,
      hitsPerPage: pageSize
    }
  })
}
