import type { Product } from './productTypes'

export interface CartItem {
  product: Product
  quantity: number
}