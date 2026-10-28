/**
 * Main navigation component for the application.
 *
 * Todo:
 * - Get navigation items from backend instead of hardcoding.
 * - Get cart count from backend instead of using context.
 */

import { NavLink } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { ShoppingCartIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'

import styles from './MainNav.module.css'

const NAV_ITEMS = [
  { 
    slug: 'start', 
    title: 'Start', 
    path: '/', 
    icon: null 
  },
  {
    slug: 'sailtell-app',
    title: 'SailTell App',
    path: '/product/9',
    icon: null
  },
  { 
    slug: 'compass-one', 
    title: 'Compass One', 
    path: '/product/1', 
    icon: null 
  },
  {
    slug: 'accessories',
    title: 'Tillbehör',
    path: '/products/accessories',
    icon: null
  },
  {
    slug: 'search',
    title: 'Sök',
    path: '/products/search',
    icon: MagnifyingGlassIcon
  },
  { 
    slug: 'cart', 
    title: 'Varukorg', 
    path: '/cart', 
    icon: ShoppingCartIcon 
  }
]

export default function MainNav() {
  const { cartCount } = useCart()

  return (
    <nav className={styles.mainNav}>
      <ul>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.slug}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                {Icon ? <Icon size={20} /> : item.title}

                {item.slug === 'cart' && (
                  <span className="count">({cartCount})</span>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
