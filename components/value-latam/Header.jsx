import { navLinks } from '@/data/valueLatamContent';

export default function Header() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#top" aria-label="Value Latam - inicio">
          <img src="/value-latam-logo.png" alt="Value Latam" />
        </a>
        <nav className="nav-links" id="main-menu" aria-label="Navegación principal">
          {navLinks.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <div className="nav-cta">
          <a className="btn btn-primary" href="#contacto">Agendar una reunión</a>
        </div>
        <button className="menu-btn" type="button" aria-label="Abrir menú" aria-controls="main-menu" aria-expanded="false">
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
