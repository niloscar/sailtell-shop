
/**
 * Admin navigation component for the application.
 * 
 * Todo: 
 * - Get navigation items from backend instead of hardcoding.
 */

import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import styles from './AdminNav.module.css'

const navItems = [
  { name: 'Start', path: '/admin', end: true },
  { name: 'Orders', path: '/admin/orders' },
  { name: 'Products', path: '/admin/products' },
]

export default function AdminNav() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className={styles.adminNav}>
      <ul>
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              end={item.end}
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
        {isAuthenticated && user && (
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  )
}
