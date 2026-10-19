import { useCart } from '../../contexts/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import QuantitySelector from '../../components/QuantitySelector'
import formatPrice from '../../utilities/formatPrice'

import styles from './PageCart.module.css'

export default function PageCart() {
  const { cartCount, cart, resetCart, changeQuantity } = useCart()
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
          <table>
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Antal</th>
                <th>Pris/st</th>
                <th>Summa</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link to={`/product/${item.product_id}`}>{item.name}</Link>
                  </td>

                  <td className={styles.quantityCell}>
                    <QuantitySelector
                      quantity={item.quantity}
                      onChange={(quantity) =>
                        changeQuantity(item.product_id, quantity)
                      }
                    />
                  </td>

                  <td>{formatPrice(Number(item.price))}</td>

                  <td>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          Delsumma: {formatPrice(subtotal)}
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
