export default function Intro() {
  return (
    <section className="hero-title" id="intro">
      <div className="wrap ht-inner">
        <span className="eyebrow">La primera consultoría financiera integral para empresas</span>
        <h1 className="serif">El centro financiero de tu empresa.</h1>
        <p className="lead">Financiamiento, liquidez e inversión, cobros y pagos, y automatización de procesos. Un solo socio para toda la operación.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#contacto">Agendá tu diagnóstico</a>
          <a className="btn btn-ghost" href="#soluciones">Ver soluciones</a>
        </div>
        <span className="hero-badge">Agente Productor <b>CNV</b> · Mat. <b>2651</b> · Ley 26.831</span>
      </div>
    </section>
  );
}
