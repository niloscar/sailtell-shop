/**
 * Adapter for interacting with the Algolia search and indexing service.
 */ 

import { algoliasearch } from 'algoliasearch'
import type { Product, ProductSummary } from '@shop/shared'

const APP_ID = process.env.ALGOLIA_APP_ID ?? ''
const ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY ?? ''
const SEARCH_API_KEY = process.env.ALGOLIA_SEARCH_API_KEY ?? ''
const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME ?? 'products'

const adminClient = algoliasearch(APP_ID, ADMIN_API_KEY)
const searchClient = algoliasearch(APP_ID, SEARCH_API_KEY)

export interface SearchProduct extends Record<string, unknown> {
  objectID: string
  sku: string
  name: string
  brand_name: string | null
  description: string | null
  details: string[] | null
  categories: string[]
}

export async function indexProducts(products: (Product | ProductSummary)[]) {
  const objects: SearchProduct[] = products.map((product) => {
    if (!product.sku) {
      throw new Error(`Produkten ${product.id} saknar artikelnummer.`)
    }

    return {
      objectID: product.sku,
      sku: product.sku,
      name: product.name,
      brand_name: product.brand_name,
      description: product.description,
      details: product.details,
      categories: product.categories.map((category) => category.name)
    }
  })

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
  const result = await searchClient.searchSingleIndex<SearchProduct>({
    indexName: INDEX_NAME,
    searchParams: {
      query,
      page: page - 1,
      hitsPerPage: pageSize
    }
  })

  return {
    products: result.hits.map(({ objectID, name, brand_name, description, details, categories }) => ({
      sku: objectID,
      name,
      brand_name,
      description,
      details,
      categories
    })),
    total: result.nbHits,
    page,
    totalPages: result.nbPages
  }
}
