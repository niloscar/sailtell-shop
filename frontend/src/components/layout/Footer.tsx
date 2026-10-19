import { Link } from 'react-router-dom'
import FooterLogo from '../FooterLogo'

import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.pageFooter}>
      <div className={styles.container}>
        <FooterLogo />
        <section className={styles.information}>
          <h2>Information</h2>
          <nav>
            <ul className="unstyled">
              <li>
                <Link to="/about">Om SailTell</Link>
              </li>
              <li>
                <a href="https://oscarnilsson.dev?ref=assignment" target="_blank" rel="noopener">
                  Portfolio
                </a>
              </li>
            </ul>
          </nav>
        </section>
        <section className={styles.customerService}>
          <h2>Kundservice</h2>
          <nav>
            <ul className="unstyled">
              <li>
                <Link to="#">Kontakta oss</Link>
              </li>
              <li>
                <Link to="#">Ångerrätt</Link>
              </li>
              <li>
                <Link to="#">Leveransvillkor</Link>
              </li>
              <li>
                <Link to="#">Returvillkor</Link>
              </li>
              <li>
                <Link to="#">Användarvillkor</Link>
              </li>
              <li>
                <Link to="#">Integritetspolicy</Link>
              </li>
            </ul>
          </nav>
        </section>
        <p className={styles.copyright}>&copy; 2026 SailTell AB</p>
      </div>
    </footer>
  )
}
