import { contact } from '@/data/valueLatamContent';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <a className="brand foot-logo" href="#top" style={{ marginBottom: 4 }} aria-label="Value Latam - inicio"><img src="/value-latam-logo.png" alt="Value Latam" /></a>
            <p className="blurb">Consultoría financiera integral para empresas. Experiencia senior para ejecutar con claridad en contextos volátiles.</p>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>{contact.email}<br />WhatsApp {contact.whatsappLabel}<br />{contact.address}</p>
          </div>
          <div><h5>Soluciones</h5><ul><li><a href="#soluciones">Financiamiento</a></li><li><a href="#soluciones">Inversiones & Liquidez</a></li><li><a href="#medios">Medios de Pago</a></li></ul></div>
          <div><h5>Empresa</h5><ul><li><a href="#diferencial">Quiénes somos</a></li><li><a href="#equipo">Equipo</a></li><li><a href="#contacto">Contacto</a></li></ul></div>
          <div><h5>Contacto</h5><ul><li><a href="#contacto">Agendar una llamada</a></li><li><a href={'mailto:' + contact.email}>{contact.email}</a></li><li><a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a></li><li>Mariano Castex 499 · Piso 3 · Of. 303</li></ul></div>
        </div>
        <div className="foot-bottom"><span>© 2026 Value Latam. Todos los derechos reservados.</span><span className="social"><a href="https://www.linkedin.com/in/value-latam-a60a3137b/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://www.instagram.com/value.latam/" target="_blank" rel="noopener noreferrer">Instagram</a></span></div>
      </div>
    </footer>
  );
}
