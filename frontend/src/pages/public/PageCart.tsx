import { useCart } from '../../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import formatPrice from '../../utilities/formatPrice'

export default function PageCart() {
  const { cartCount, cart, resetCart } = useCart()
  const navigate = useNavigate()

  const handleResetCart = () => resetCart()

  return (
    <>
      <h1 className="heading-size-1">Varukorg {cartCount > 0 && `(${cartCount})`}</h1>
      {cartCount === 0 ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <>
          <table>
            <tbody>
              {Object.values(cart).map((item) => (
                <tr key={item.product.id}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}st</td>
                  <td>{formatPrice(Number(item.product.price))}</td>
                  <td>{formatPrice(Number(item.product.price) * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          Delsumma: {formatPrice(Object.values(cart).reduce((total, item) => total + (item.product.price * item.quantity), 0))}
          <p>Frakt beräknas i kassan.</p>
          <button
            onClick={() => navigate('/checkout')}
            disabled={cartCount === 0}
          >
            Gå till kassan
          </button>
          <button onClick={handleResetCart}>
            Töm varukorg
          </button>
        </>
      )}
    </>
  )
}