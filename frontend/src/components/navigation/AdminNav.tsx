
/**
 * Admin navigation component for the application.
 * 
 * Todo: 
 * - Get navigation items from backend instead of hardcoding.
 */

import { NavLink } from 'react-router-dom'

const navItems = [
  { name: 'Start', path: '/admin', end: true },
  { name: 'Orders', path: '/admin/orders' },
  { name: 'Products', path: '/admin/products' },
  { name: 'Customers', path: '/admin/customers' }
]

export default function AdminNav() {
  return (
    <nav className="admin-nav">
      <ul>
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              end={item.end}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}