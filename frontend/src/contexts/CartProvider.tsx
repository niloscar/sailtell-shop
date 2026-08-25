import { useEffect, useState } from 'react'
import { CartContext } from './CartContext'
import { createCart, getCart, addCartItem, updateCartItem, deleteCartItem } from '../api/cartApi'
import type { ReactNode } from 'react'
import type { Product } from '../types/productTypes'
import type { Cart } from '../types/cartTypes'

type CartActionState = {
  loading: boolean
  error: string | null
  added: boolean
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [cartActionState, setCartActionState] = useState<Record<number, CartActionState>>({})

  const cartCount = cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0

  useEffect(() => {
    const fetchCart = async () => {
      const cartUuid = localStorage.getItem('cart_uuid')

      if (!cartUuid) return

      try {
        const response = await getCart(cartUuid)

        setCart(response.data)
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

        const response = await addCartItem(cartUuid, { product_id: product.id, quantity })

        setCart(response.data)
      } else {
        const cartUuid = cart.cart_uuid

        setCart({
          ...cart,
          items: cart.items.some(
            (item) => item.product_id === product.id
          )
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
                  price: product.price
                }
              ]
        })

        const response = await addCartItem(cartUuid, { product_id: product.id, quantity })
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
          error:
            error instanceof Error
              ? error.message
              : 'Kunde inte lägga produkten i varukorgen.'
        }
      }))
    }
  }

  const changeQuantity = async (productId: number, quantity: number) => {
    if (!cart) return

    const previousCart = cart

    setCart({
      ...cart, items: cart.items.map((item) => item.product_id === productId
        ? { ...item, quantity }
        : item
      )
    })

    try {
      await updateCartItem(cart.cart_uuid, productId, { quantity })
    } catch (error) {
      setCart(previousCart)
      console.error('Kunde inte uppdatera antalet i varukorgen.', error)
    }
  }

  const removeFromCart = async (product: Product) => {
    if (!cart) return

    const previousCart = cart

    setCart({
      ...cart, items: cart.items
        .filter((item) => item.product_id !== product.id)
    })

    try {
      await deleteCartItem(cart.cart_uuid, product.id)
    } catch (error) {
      setCart(previousCart)
      console.error(`${product.name} kunde inte tas bort från varukorgen.`, error)
    }
  }

  const resetCart = async () => {
    if (!cart) return

    const previousCart = cart
    setCart(null)

    try {
      await Promise.all(
        cart.items.map((item) =>
          deleteCartItem(
            cart.cart_uuid,
            item.product_id
          )
        )
      )

      localStorage.removeItem('cart_uuid')
    } catch (error) {
      setCart(previousCart)
      console.error('Varukorgen kunde inte tömmas.', error)
    }
  }

  const value = { cart, cartCount, addToCart, changeQuantity, removeFromCart, resetCart, cartActionState }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}