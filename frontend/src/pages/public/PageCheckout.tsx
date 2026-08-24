import { useCart } from '../../contexts/CartContext'
import { Link } from 'react-router-dom'
import formatPrice from '../../utilities/formatPrice'

export default function PageCheckout() {
  const { cartCount, cart } = useCart()

  const totalPrice = Object.values(cart).reduce((total, item) => total + (item.product.price * item.quantity), 0)
  const totalVat: number = totalPrice * 0.25

  return (
    <>
      <h1 className="heading-size-1">Kassa</h1>
      {cartCount === 0 ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Antal</th>
              <th>Pris/st</th>
              <th>Summa</th>
            </tr>
          </thead>
          <tbody className="checkout-items">
            {Object.values(cart).map((item) => (
              <tr key={item.product.id}>
                <td>{item.product.name}</td>
                <td>{item.quantity} st</td>
                <td>{formatPrice(item.product.price)}</td>
                <td>{formatPrice(item.product.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="checkout-totals">
            <tr>
              <td colSpan={3}>Moms (25%)</td>
              <td>
                {formatPrice(totalVat)}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Totalt</th>
              <th>
                {formatPrice(totalPrice)}
              </th>
            </tr>
          </tfoot>
        </table>
      )}
      <p>Totalt antal artiklar i varukorgen: {cartCount}</p>
      <Link to="/confirm">
        Slutför köp
      </Link>
    </>
  )
}