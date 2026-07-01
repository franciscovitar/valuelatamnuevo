export default function Regulation() {
  return (
    <section className="reg">
      <div className="wrap reg-inner reveal">
        <div>
          <span className="eyebrow">Mención regulatoria</span>
          <p style={{ marginTop: 18 }}>Value Latam presta servicios de consultoría financiera estratégica, análisis, estructuración de financiamiento y asesoramiento en alternativas de inversión.</p>
          <p>Las operaciones en el mercado de capitales son canalizadas a través de agentes autorizados y registrados ante la Comisión Nacional de Valores (CNV), conforme a la normativa vigente.</p>
          <p className="badge">Agente Productor CNV · Matrícula N° 2651 · Ley N° 26.831</p>
          <p>Value Latam no actúa como entidad financiera ni capta fondos del público, limitándose a la estructuración, asesoramiento y canalización de operaciones a través de intermediarios autorizados.</p>
        </div>
        <div className="seals">
          <a className="seal logo" href="https://www.argentina.gob.ar/cnv" target="_blank" rel="noopener"><span className="logo-fallback">CNV</span></a>
          <a className="seal logo" href="https://www.byma.com.ar/" target="_blank" rel="noopener"><span className="logo-fallback">BYMA</span></a>
        </div>
      </div>
    </section>
  );
}
