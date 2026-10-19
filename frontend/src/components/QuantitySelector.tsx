import { MinusIcon, PlusIcon } from '@phosphor-icons/react'

import styles from './QuantitySelector.module.css'

type QuantitySelectorProps = {
  quantity: number
  onChange: (quantity: number) => void
}

export default function QuantitySelector({ quantity, onChange }: QuantitySelectorProps) {
  const increment = () => onChange(quantity + 1)
  const decrement = () => onChange(Math.max(1, quantity - 1))

  return (
    <div className={styles.quantitySelector}>
      <button 
        className={styles.quantityDecrementButton}
        onClick={decrement}
      >
        <MinusIcon size={18} />
      </button>

      <span className={styles.quantityValue}>
        {quantity} st
      </span>

      <button 
        className={styles.quantityIncrementButton}
        onClick={increment}
      >
        <PlusIcon size={18} />
      </button>
    </div>
  )
}
