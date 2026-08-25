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
        <p className="copyright">&copy; 2026 SailTell AB</p>
      </div>
    </footer>
  )
}