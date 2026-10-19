import logo from '../assets/img/logo-lg-white.svg'

import styles from './FooterLogo.module.css'

function FooterLogo() {
  return (
    <div className={styles.logo}>
      <img src={logo} alt="SailTell – Your boat at a glance" />
    </div>
  )
}

export default FooterLogo
