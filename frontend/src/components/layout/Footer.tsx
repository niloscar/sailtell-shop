import { Link } from "react-router-dom";
import FooterLogo from "../FooterLogo";

export default function Footer() {
  return (
    <footer className="page-footer">
      <div className="container">
        <FooterLogo />
        <section className="information">
          <h2>Information</h2>
          <nav>
            <ul className="unstyled">
              <li>
                <Link to="/about">Om oss</Link>
              </li>
            </ul>
          </nav>
        </section>
        <section className="customer-service">
          <h2>Kundservice</h2>
          <nav>
            <ul className="unstyled">
              <li>
                <Link to="/contact">Kontakta oss</Link>
              </li>
              <li>
                <Link to="/right-of-withdrawal">Ångerrätt</Link>
              </li>
              <li>
                <Link to="/shipping">Leveransvillkor</Link>
              </li>
              <li>
                <Link to="/returns">Returvillkor</Link>
              </li>
              <li>
                <Link to="/terms">Användarvillkor</Link>
              </li>
              <li>
                <Link to="/privacy">Integritetspolicy</Link>
              </li>
            </ul>
          </nav>
        </section>
        <p className="copyright">&copy; 2026 SailTell AB</p>
      </div>
    </footer>
  )
}