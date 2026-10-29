
import { MinusIcon, PlusIcon } from '@phosphor-icons/react'

import styles from './QuantitySelector.module.css'

type QuantitySelectorProps = {
  quantity: number
  onChange: (quantity: number) => void
  max?: number
}

export default function QuantitySelector({ quantity, onChange, max }: QuantitySelectorProps) {
  const increment = () => {
    if (max !== undefined && quantity >= max) return
    onChange(quantity + 1)
  }

  const decrement = () => onChange(Math.max(1, quantity - 1))

  return (
    <div className={styles.quantitySelector}>
      <button
        type="button"
        className={styles.quantityDecrementButton}
        onClick={decrement}
        disabled={quantity <= 1}
      >
        <MinusIcon size={18} />
      </button>

      <span className={styles.quantityValue}>{quantity} st</span>

      <button
        type="button"
        className={styles.quantityIncrementButton}
        onClick={increment}
        disabled={max !== undefined && quantity >= max}
      >
        <PlusIcon size={18} />
      </button>
    </div>
  )
}
