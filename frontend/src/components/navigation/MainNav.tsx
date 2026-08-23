import { NavLink } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'

export default function MainNav() {
  const { cartCount } = useCart()

  return (
    <nav className="main-nav">
      <ul>
        <li>
          <NavLink to="/">Start</NavLink>
        </li>
        <li>
          <NavLink to="/products">Produkter</NavLink>
        </li>
        <li>
          <NavLink to="/cart">Varukorg ({cartCount})</NavLink>
        </li>
        <li>
          <NavLink to="/checkout">Kassa</NavLink>
        </li>
      </ul>
    </nav>
  )
}