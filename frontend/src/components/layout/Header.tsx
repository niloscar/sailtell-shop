import logo from '../../assets/img/logo-lg-white.svg'

import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.pageHeader}>
      <h1 className={styles.logo}>
        <img
          src={logo} 
          alt="SailTell – Your boat at a glance" 
        />
      </h1>
    </header>
  )
}
