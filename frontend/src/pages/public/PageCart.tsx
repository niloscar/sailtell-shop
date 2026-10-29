import { useCart } from '../../contexts/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { TrashIcon } from '@phosphor-icons/react'
import QuantitySelector from '../../components/QuantitySelector'
import formatPrice from '../../utilities/formatPrice'

import styles from './PageCart.module.css'

export default function PageCart() {
  const { cartCount, cart, resetCart, changeQuantity, removeFromCart } =
    useCart()

  const navigate = useNavigate()

  const cartItems = cart?.items ?? []
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const handleResetCart = () => {
    resetCart()
  }

  return (
    <>
      <h1 className="headingSize1">
        Varukorg {cartCount > 0 && `(${cartCount})`}
      </h1>

      {cartCount === 0 ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <>
          <div className={styles.cartGrid}>
            <div className={styles.cartHeader}>
              <span>Produkt</span>
              <span>Antal</span>
              <span>Pris/st</span>
              <span>Summa</span>
              <span />
            </div>

            <ul className={styles.cartList}>
              {cartItems.map((item) => (
                <li key={item.id} className={styles.cartItem}>
                  <Link to={`/product/${item.product_id}`}>{item.name}</Link>

                  <div className={styles.quantityCell}>
                    <QuantitySelector
                      quantity={item.quantity}
                      onChange={(quantity) =>
                        changeQuantity(item.product_id, quantity)
                      }
                      max={item.stock ?? 0}
                    />
                  </div>

                  <span>{formatPrice(Number(item.price))}</span>

                  <span>{formatPrice(item.price * item.quantity)}</span>

                  <button
                    type="button"
                    className={styles.removeItemButton}
                    onClick={() => removeFromCart(item.product_id, item.name)}
                    aria-label={`Ta bort ${item.name} från varukorgen`}
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.cartSubtotal}>
            <span>Delsumma</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <div className={styles.cartButtons}>
            <button
              className={styles.checkoutButton}
              onClick={() => navigate('/checkout')}
              disabled={cartCount === 0}
            >
              Gå till kassan
            </button>

            <button
              className={styles.resetCartButton}
              onClick={handleResetCart}
            >
              Töm varukorg
            </button>
          </div>
        </>
      )}
    </>
  )
}
