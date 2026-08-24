import { useCart } from '../contexts/CartContext'
import { ShoppingCartIcon } from '@phosphor-icons/react'
import type { Product } from '../types/productTypes'


export default function ToCartButton({ product, quantity }: { product: Product; quantity: number }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  return (
    <button 
      className="to-cart-button"
      onClick={handleAddToCart}
    >
      <ShoppingCartIcon size={18} />
      <span>Lägg i varukorg</span>
    </button>
  )
}