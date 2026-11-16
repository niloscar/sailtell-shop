import { NavLink } from 'react-router-dom'
import { UserIcon } from '@phosphor-icons/react'

import styles from './MyAccountLink.module.css'

export default function MyAccountLink() {
  return (
    <NavLink
      to="/my-account"
      className={styles.myAccountLink}
    >
      <UserIcon size={20} />
    </NavLink>
  )
}
