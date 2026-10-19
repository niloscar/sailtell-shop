
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

import styles from './MainNav.module.css'

const navItems = [
  { name: 'Start', path: '/' },
  { name: 'SailTell App', path: '/product/9' },
  { name: 'Compass One', path: '/product/1' },
  { name: 'Accessories', path: '/products/accessories' },
  { name: 'Cart', path: '/cart' }
]

export default function MainNav() {
  const { cartCount } = useCart()

  return (
    <nav className={styles.mainNav}>
      <ul>
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) => isActive ? styles.active : ''}
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
