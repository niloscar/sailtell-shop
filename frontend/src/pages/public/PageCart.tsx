import { useCart } from '../../contexts/CartContext'
import { Link } from 'react-router-dom'

export default function PageCart() {
  const { cartCount, cart } = useCart()

  return (
    <>
      <h1 className="heading-size-1">Varukorg</h1>
      {cartCount === 0 ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <ul>
          {Object.values(cart).map((item) => (
            <li key={item.product.id}>
              {item.product.name} – {item.quantity} st
            </li>
          ))}
        </ul>
      )}
      <p>Totalt antal artiklar i varukorgen: {cartCount}</p>
      <Link to="/checkout">
        Gå till kassan
      </Link>
    </>
  )
}