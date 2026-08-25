import { useState } from 'react'
import { CartContext } from './CartContext'
import type { ReactNode } from 'react'
import type { Product } from '../types/productTypes'
import type { CartItem } from '../types/cartTypes'

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<number, CartItem>>({})

  const cartCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0)

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: {
        product,
        quantity: prevCart[product.id]
          ? prevCart[product.id].quantity + quantity // If product already in cart, increment quantity.
          : quantity
      }
    }))

    console.log(`${product.name} har lagts till i varukorgen.`)
  }

  const removeFromCart = (product: Product) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart }
      delete newCart[product.id]
      console.log(`${product.name} har tagits bort från varukorgen.`)
      return newCart
    })
  }

  const resetCart = () => {
    setCart({})
    console.log('Varukorgen har tömts.')
  }

  const value = { cart, cartCount, addToCart, removeFromCart, resetCart }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}