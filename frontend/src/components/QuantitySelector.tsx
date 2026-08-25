import { MinusIcon, PlusIcon } from '@phosphor-icons/react'

type QuantitySelectorProps = {
  quantity: number
  onChange: (quantity: number) => void
}

export default function QuantitySelector({ quantity, onChange }: QuantitySelectorProps) {
  const increment = () => onChange(quantity + 1)
  const decrement = () => onChange(Math.max(1, quantity - 1))

  return (
    <div className="to-cart-quantity">
      <button 
        className="quantity-decrement-button"
        onClick={decrement}
      >
        <MinusIcon size={18} />
      </button>

      <span className="quantity-value">
        {quantity} st
      </span>

      <button 
        className="quantity-increment-button"
        onClick={increment}
      >
        <PlusIcon size={18} />
      </button>
    </div>
  )
}