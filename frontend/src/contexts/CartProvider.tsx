import { useEffect, useState } from 'react'
import { CartContext } from './CartContext'
import {
  createCart,
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem
} from '../api/cartApi'
import getApiErrorMessage from '../utilities/apiError'

import type { ReactNode } from 'react'
import type { Product } from '@shop/shared'
import type { Cart } from '@shop/shared'

type CartActionState = {
  loading: boolean
  error: string | null
  added: boolean
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [cartActionState, setCartActionState] = useState<
    Record<number, CartActionState>
  >({})

  const cartCount =
    cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0

  useEffect(() => {
    const fetchCart = async () => {
      const cartUuid = localStorage.getItem('cart_uuid')

      if (!cartUuid) return

      try {
        const response = await getCart(cartUuid)

        if (localStorage.getItem('cart_uuid') === cartUuid) {
          setCart(response.data)
        }
      } catch (error) {
        console.error('Kunde inte hämta varukorgen.', error)
      }
    }

    fetchCart()
  }, [])

  const addToCart = async (product: Product, quantity: number) => {
    const previousCart = cart

    setCartActionState((prev) => ({
      ...prev,
      [product.id]: {
        loading: true,
        error: null,
        added: false
      }
    }))

    try {
      if (!cart) {
        const createResponse = await createCart()
        const cartUuid = createResponse.data.cart_uuid

        localStorage.setItem('cart_uuid', cartUuid)

        const response = await addCartItem(cartUuid, {
          product_id: product.id,
          quantity
        })

        setCart(response.data)
      } else {
        const cartUuid = cart.cart_uuid

        setCart({
          ...cart,
          items: cart.items.some((item) => item.product_id === product.id)
            ? cart.items.map((item) =>
                item.product_id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity
                    }
                  : item
              )
            : [
                ...cart.items,
                {
                  id: -product.id,
                  product_id: product.id,
                  name: product.name,
                  brand_name: product.brand_name,
                  img_url: product.img_url,
                  quantity,
                  stock: product.stock,
                  price: product.price
                }
              ]
        })

        const response = await addCartItem(cartUuid, {
          product_id: product.id,
          quantity
        })
        setCart(response.data)
      }

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
      setCart(previousCart)

      setCartActionState((prev) => ({
        ...prev,
        [product.id]: {
          loading: false,
          added: false,
          error: getApiErrorMessage(error)
        }
      }))
    }
  }

  const changeQuantity = async (productId: number, quantity: number) => {
    if (!cart) return

    const previousCart = cart

    setCart({
      ...cart,
      items: cart.items.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    })

    try {
      await updateCartItem(cart.cart_uuid, productId, { quantity })
    } catch (error) {
      setCart(previousCart)
      console.error('Kunde inte uppdatera antalet i varukorgen.', error)
    }
  }

  const removeFromCart = async (productId: number, productName: string) => {
    if (!cart) return

    const previousCart = cart

    setCart({
      ...cart,
      items: cart.items.filter((item) => item.product_id !== productId)
    })

    try {
      await deleteCartItem(cart.cart_uuid, productId)
    } catch (error) {
      setCart(previousCart)
      console.error(
        `${productName} kunde inte tas bort från varukorgen.`,
        error
      )
    }
  }

  const resetCart = async () => {
    const cartUuid = localStorage.getItem('cart_uuid')

    if (!cartUuid) {
      setCart(null)
      return
    }

    try {
      const { data } = await getCart(cartUuid)

      await Promise.all(
        data.items.map((item) =>
          deleteCartItem(cartUuid, item.product_id)
        )
      )

      localStorage.removeItem('cart_uuid')
      setCart(null)
    } catch (error) {
      console.error('Varukorgen kunde inte tömmas.', error)
      throw error
    }
  }

  const value = {
    cart,
    cartCount,
    addToCart,
    changeQuantity,
    removeFromCart,
    resetCart,
    cartActionState
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
