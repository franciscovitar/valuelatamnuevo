const partnerLogos = [
  { src: '/acindar.png', alt: 'Acindar' },
  { src: '/argenpymes.jpg', alt: 'Argenpymes' },
  { src: '/trend.jpg', alt: 'Trend' },
  { src: '/balanz.jpg', alt: 'Balanz' },
  { src: '/adcap.jpg', alt: 'AdCap' },
];

export default function PartnerLogos() {
  return (
    <section className="trust partner-logos" aria-label="Empresas y partners">
      <div className="wrap">
        <div className="sec-head reveal partner-head">
          <span className="eyebrow">Red de trabajo</span>
          <h2 className="serif">Empresas y aliados con los que trabajamos.</h2>
        </div>
        <div className="logos partner-logo-grid reveal">
          {partnerLogos.map((logo) => (
            <span className="rel-logo partner-logo" key={logo.alt}>
              <img src={logo.src} alt={logo.alt} loading="lazy" />
              <b className="rel-fb">{logo.alt}</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
