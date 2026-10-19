import { useCart } from '../contexts/CartContext'
import { CheckIcon, ShoppingCartIcon } from '@phosphor-icons/react'
import type { Product } from '../types/productTypes'

import styles from './ToCartButton.module.css'

export default function ToCartButton({
  product,
  quantity
}: {
  product: Product
  quantity: number
}) {
  const { addToCart, cartActionState } = useCart()

  return (
    <button
      className={styles.toCartButton}
      onClick={() => addToCart(product, quantity)}
      disabled={cartActionState[product.id]?.loading}
    >
      {cartActionState[product.id]?.loading ? (
        <span>Lägger till...</span>
      ) : cartActionState[product.id]?.added ? (
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
  )
}
