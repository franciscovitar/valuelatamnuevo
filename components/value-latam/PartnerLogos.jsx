const partnerLogos = [
  { src: '/acindar-clean.png', alt: 'Acindar Pymes', slug: 'acindar', variant: 'plain' },
  { src: '/argenpymes-clean.png', alt: 'Argenpymes', slug: 'argenpymes', variant: 'plain' },
  { src: '/trend-clean.png', alt: 'Trend Capital', slug: 'trend', variant: 'plain' },
  { src: '/balanz-clean.png', alt: 'Balanz', slug: 'balanz', variant: 'badge' },
  { src: '/adcap-clean.png', alt: 'AdCap', slug: 'adcap', variant: 'badge' },
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
            <span
              className={`rel-logo partner-logo partner-logo--${logo.slug} partner-logo--${logo.variant}`}
              key={logo.alt}
            >
              <img src={logo.src} alt={logo.alt} loading="lazy" />
              <b className="rel-fb">{logo.alt}</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}