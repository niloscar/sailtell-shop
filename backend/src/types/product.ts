export interface Product {
  id: number
  name: string
  brand_name: string
  description: string
  details: string[]
  img_url: string
  stock: number
  purchase_type: 'webshop' | 'external'
  distribution_links: ProductDistributionLink[]
  created_at: string
  updated_at: string
  sort_order: number
}

export interface UpdateProduct {
  name?: string
  brand_name?: string
  description?: string
  details?: string[]
  img_url?: string
  stock?: number
  purchase_type?: 'webshop' | 'external'
  sort_order?: number
}

export interface ProductDistributionLink {
  id: number
  product_id: number
  distributor: string
  download_url: string
  badge_url: string
}