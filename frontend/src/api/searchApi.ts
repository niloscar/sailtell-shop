import api from './apiClient'
import type { ProductSummary } from '@shop/shared'

interface SearchResponse {
  products: ProductSummary[]
  total: number
  page: number
  totalPages: number
}

export function searchProducts(query: string, page=1, pageSize=10) {
  return api.get<SearchResponse>('/search', {
    params: {
      q: query,
      page,
      pageSize
    }
  })
}
