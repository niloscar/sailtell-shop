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
                <a href="/about">Om oss</a>
              </li>
            </ul>
          </nav>
        </section>
        <section className="customer-service">
          <h2>Kundservice</h2>
          <nav>
            <ul className="unstyled">
              <li>
                <a href="/contact">Kontakta oss</a>
              </li>
              <li>
                <a href="/right-of-withdrawal">Ångerrätt</a>
              </li>
              <li>
                <a href="/shipping">Leveransvillkor</a>
              </li>
              <li>
                <a href="/returns">Returvillkor</a>
              </li>
              <li>
                <a href="/terms">Användarvillkor</a>
              </li>
              <li>
                <a href="/privacy">Integritetspolicy</a>
              </li>
            </ul>
          </nav>
        </section>
        <p className="copyright">&copy; 2026 SailWell AB</p>
      </div>
    </footer>
  )
}