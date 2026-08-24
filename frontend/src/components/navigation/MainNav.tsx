
/**
 * Main navigation component for the application.
 * 
 * Todo: 
 * - Get navigation items from backend instead of hardcoding.
 * - Get cart count from backend instead of using context.
 */

import { NavLink } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { ShoppingCartIcon } from '@phosphor-icons/react'

const navItems = [
  { name: 'Start', path: '/' },
  { name: 'App', path: '/product/9' },
  { name: 'Sensors', path: '/products/sensors' },
  { name: 'Accessories', path: '/products/accessories' },
  { name: 'Cart', path: '/cart' }
]

export default function MainNav() {
  const { cartCount } = useCart()

  return (
    <nav className="main-nav">
      <ul>
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {item.name !== 'Cart' && item.name}
              {item.name === 'Cart' && (
                <>
                  <ShoppingCartIcon size={20} />
                  <span className="count">({cartCount})</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}