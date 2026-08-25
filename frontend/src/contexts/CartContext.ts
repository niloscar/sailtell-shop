import { createContext, useContext } from 'react'
import type { Product } from '../types/productTypes'
import type { CartItem } from '../types/cartTypes'

type CartContextType = {
  cart: Record<number, CartItem>
  cartCount: number
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (product: Product) => void
  resetCart: () => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}