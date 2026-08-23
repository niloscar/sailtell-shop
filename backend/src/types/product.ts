export interface Product {
  id: number
  name: string
  brand_name: string
  description: string
  details: string[]
  stock: number
  created_at: string
  updated_at: string
}

export interface UpdateProduct {
  name?: string
  brand_name?: string
  description?: string
  details?: string[]
  stock?: number
}