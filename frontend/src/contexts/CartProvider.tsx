import { useState } from 'react'
import { CartContext } from './CartContext'
import type { ReactNode } from 'react'
import type { Product } from '../types/productTypes'
import type { CartItem } from '../types/cartTypes'

type CartActionState = {
  loading: boolean
  error: string | null
  added: boolean
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<number, CartItem>>({})
  const [cartActionState, setCartActionState] = useState<
    Record<number, CartActionState>
  >({})

  const cartCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0)

  const addToCart = async (product: Product, quantity: number) => {
    setCartActionState((prev) => ({
      ...prev,
      [product.id]: {
        loading: true,
        error: null,
        added: false
      }
    }))

    try {
      // Todo: await addCartItem(product.id, quantity)

      setCart((prevCart) => ({
        ...prevCart,
        [product.id]: {
          product,
          quantity: prevCart[product.id]
            ? prevCart[product.id].quantity + quantity
            : quantity
        }
      }))

      setCartActionState((prev) => ({
        ...prev,
        [product.id]: {
          loading: false,
          error: null,
          added: true
        }
      }))

      setTimeout(() => {
        setCartActionState((prev) => ({
          ...prev,
          [product.id]: {
            ...prev[product.id],
            added: false
          }
        }))
      }, 1500)
    } catch (error) {
      setCartActionState((prev) => ({
        ...prev,
        [product.id]: {
          loading: false,
          added: false,
          error: error instanceof Error
            ? error.message
            : 'Kunde inte lägga produkten i varukorgen.'
        }
      }))
    }
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

  const value = { cart, cartCount, addToCart, removeFromCart, resetCart, cartActionState }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}