export interface Product {
  id: number
  name: string
  description: string
  brand_name: string
  categories: Category[]
  details: string[]
  img_url: string
  stock: number | null
  purchase_type: PurchaseType
  product_distribution_links: ProductDistributionLink[]
  price: number
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

export interface ProductDistributionLink {
  id: number
  distributor: string
  download_url: string
  badge_url: string
}
export interface Category {
  id: number
  name: string
}

export type PurchaseType = 'webshop' | 'external'

export interface ProductOptions {
  categories: Category[]
  purchase_types: PurchaseType[]
}
