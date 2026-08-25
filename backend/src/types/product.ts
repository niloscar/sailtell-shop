export interface Product {
  id: number
  name: string
  brand_name: string
  description: string
  details: string[]
  img_url: string
  stock: number
  purchase_type: PurchaseType
  distribution_links: ProductDistributionLink[]
  created_at: string
  updated_at: string
  sort_order: number
}

export interface CreateProduct {
  name: string
  brand_name: string
  description: string
  details: string[]
  img_url: string
  stock: number | null
  price: number
  purchase_type: PurchaseType
  category_ids: number[]
}

export interface UpdateProduct {
  name?: string
  description?: string
  brand_name?: string
  details?: string[]
  img_url?: string
  stock?: number | null
  price?: number
  sort_order?: number | null
  purchase_type?: PurchaseType
  category_ids?: number[]
}

type PurchaseType = 'webshop' | 'external'

export interface ProductDistributionLink {
  id: number
  product_id: number
  distributor: string
  download_url: string
  badge_url: string
}