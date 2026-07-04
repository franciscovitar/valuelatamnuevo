const partnerLogos = [
  { src: '/logos/acindar-dark.png', alt: 'Acindar Pymes', slug: 'acindar', variant: 'plain' },
  { src: '/logos/argenpymes-dark.png', alt: 'Argenpymes', slug: 'argenpymes', variant: 'plain' },
  { src: '/logos/trend-dark.png', alt: 'Trend Capital', slug: 'trend', variant: 'plain' },
  { src: '/logos/balanz-clean.png', alt: 'Balanz', slug: 'balanz', variant: 'badge' },
  { src: '/logos/adcap-clean.png', alt: 'AdCap', slug: 'adcap', variant: 'badge' },
];

const logoSets = [partnerLogos, partnerLogos];

export default function PartnerLogos() {
  return (
    <section className="trust partner-logos partner-logos-carousel" aria-label="Empresas y partners">
      <div className="wrap">
        <div className="sec-head reveal partner-head">
          <span className="eyebrow">Red de trabajo</span>
          <h2 className="serif">Empresas y aliados con los que trabajamos.</h2>
        </div>

        <div className="partner-carousel-shell reveal">
          <div className="partner-carousel-viewport">
            <div className="partner-carousel-track">
              {logoSets.map((set, setIndex) => (
                <div
                  className="partner-carousel-set"
                  aria-hidden={setIndex > 0 ? 'true' : undefined}
                  key={`partner-set-${setIndex}`}
                >
                  {set.map((logo) => (
                    <span
                      className={`rel-logo partner-logo partner-logo--${logo.slug} partner-logo--${logo.variant}`}
                      key={`${logo.alt}-${setIndex}`}
                    >
                      <img src={logo.src} alt={logo.alt} loading="lazy" />
                      <b className="rel-fb">{logo.alt}</b>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
