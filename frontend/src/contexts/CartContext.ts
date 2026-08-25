import { createContext, useContext } from 'react'
import type { Product } from '../types/productTypes'
import type { Cart } from '../types/cartTypes'

type CartActionState = {
  loading: boolean
  error: string | null
  added: boolean
}

type CartContextType = {
  cart: Cart | null
  cartCount: number
  addToCart: (
    product: Product,
    quantity: number
  ) => Promise<void>
  changeQuantity: (
    productId: number,
    quantity: number
  ) => Promise<void>
  removeFromCart: (
    product: Product
  ) => Promise<void>
  resetCart: () => Promise<void>
  cartActionState: Record<number, CartActionState>
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart kan inte användas utanför CartProvider')
  }
  return context
}