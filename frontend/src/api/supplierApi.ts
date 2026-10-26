import axios from 'axios'

export type CatalogFormat = 'csv' | 'xml'

export interface ImportReport {
  total: number
  created: number
  updated: number
  skippedCount: number
  skipped: {
    sku?: string
    reason: string
  }[]
}

export async function importSupplierProducts(format: CatalogFormat) {
  return axios.post<ImportReport>(`/api/supplier/import/${format}`)
}
