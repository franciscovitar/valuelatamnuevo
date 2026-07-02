import { navLinks } from '@/data/valueLatamContent';

export default function Header() {
  return (
    <header className="nav" data-site-header>
      <div className="wrap nav-inner">
        <a className="brand" href="#top" aria-label="Value Latam - inicio">
          <img src="/value-latam-logo.png" alt="Value Latam" />
        </a>

        <nav className="nav-links" id="main-menu" aria-label="Navegación principal">
          {navLinks.map(([href, label]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}

          <a className="btn btn-primary nav-mobile-cta" href="#contacto">
            Agendar una reunión
          </a>
        </nav>

        <div className="nav-cta">
          <a className="btn btn-primary" href="#contacto">
            Agendar una reunión
          </a>
        </div>

        <button
          className="menu-btn"
          type="button"
          aria-label="Abrir menú"
          aria-controls="main-menu"
          aria-expanded="false"
        >
          <span className="menu-btn-line" aria-hidden="true" />
          <span className="menu-btn-line" aria-hidden="true" />
          <span className="menu-btn-line" aria-hidden="true" />
        </button>
      </div>

      <button
        className="nav-backdrop"
        type="button"
        aria-label="Cerrar menú"
        data-menu-backdrop
        tabIndex={-1}
      />
    </header>
  );
}