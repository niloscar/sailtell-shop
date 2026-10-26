export interface ProductSummary {
  id: number
  sku: string | null
  ean: string | null
  name: string
  brand_name: string | null
  description: string | null
  details: string[] | null
  img_url: string | null
  stock: number | null
  price: number
  categories: Category[]
  sort_order: number | null
}

export interface Product extends Omit<ProductSummary, 'sort_order'> {
  purchase_type: PurchaseType
  product_distribution_links: ProductDistributionLink[]
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

export type PurchaseType = 'webshop' | 'external'

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

export interface ProductOptions {
  categories: Category[]
  purchase_types: PurchaseType[]
}
