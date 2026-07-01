import { navLinks } from '@/data/valueLatamContent';

export default function Header() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#top" aria-label="Value Latam - inicio">
          <img src="/value-latam-logo.png" alt="Value Latam" />
        </a>
        <nav className="nav-links">
          {navLinks.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <div className="nav-cta">
          <a className="btn btn-primary" href="#contacto">Agendar una reunión</a>
        </div>
        <button className="menu-btn" aria-label="Menú">≡</button>
      </div>
    </header>
  );
}
