
import { useCart } from '../contexts/CartContext'
import Ellipsis from './ui/Ellipsis'
import { CheckIcon, ShoppingCartIcon } from '@phosphor-icons/react'

import type { Product } from '@shop/shared'

import styles from './ToCartButton.module.css'

export default function ToCartButton({ product, quantity }: { product: Product, quantity: number}) {
  const { addToCart, cart, cartActionState } = useCart()
  const actionState = cartActionState[product.id]

  const quantityInCart =
    cart?.items.find((item) => item.product_id === product.id)?.quantity ?? 0

  const availableStock =
    product.stock === null
      ? 0
      : Math.max(0, product.stock - quantityInCart)

  return (
    <div>
      <button
        className={styles.toCartButton}
        onClick={() => addToCart(product, quantity)}
        disabled={
          actionState?.loading ||
          quantity > availableStock
        }
      >
        {actionState?.loading ? (
          <span>Lägger till<Ellipsis /></span>
        ) : actionState?.added ? (
          <>
            <CheckIcon size={18} />
            <span>Tillagd i varukorg</span>
          </>
        ) : (
          <>
            <ShoppingCartIcon size={18} />
            <span>Lägg i varukorg</span>
          </>
        )}
      </button>

      {actionState?.error && (
        <p className="errorMessage" role="alert">
          {actionState.error}
        </p>
      )}
    </div>
  )
}
