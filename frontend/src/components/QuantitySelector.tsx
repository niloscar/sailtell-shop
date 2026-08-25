import type { Dispatch, SetStateAction } from 'react'
import { MinusIcon, PlusIcon } from '@phosphor-icons/react'

type QuantitySelectorProps = {
  quantity: number
  setQuantity: Dispatch<SetStateAction<number>>
}

export default function QuantitySelector({ quantity, setQuantity }: QuantitySelectorProps) {
  const increment = () => setQuantity(q => q + 1)
  const decrement = () => setQuantity(q => Math.max(1, q - 1))

  return (
    <div className="to-cart-quantity">
      <button 
        className="quantity-decrement-button"
        onClick={decrement}
      >
        <MinusIcon size={18} />
      </button>
      <span
        className="quantity-value"
      >{quantity} st</span>
      <button 
        className="quantity-increment-button"
        onClick={increment}
      >
        <PlusIcon size={18} />
      </button>
    </div>
  )
}