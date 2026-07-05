import { solutions } from '@/data/valueLatamContent';
import SectionHeading from './SectionHeading';

export default function Solutions() {
  return (
    <section className="solutions" id="soluciones">
      <div className="wrap">
        <SectionHeading eyebrow="Qué hacemos" title="Soluciones financieras para empresas." />
        <div className="sol-grid">
          {solutions.map((item, index) => (
            <article className="sol-card reveal tilt" data-expand key={item.index}>
              <button className="sol-head" aria-expanded="false" aria-controls={'ficha-0' + (index + 1)}>
                <span className="idx">{item.index}</span><h3>{item.title}</h3><span className="sol-toggle" aria-hidden="true">+</span>
              </button>
              <p>{item.text}</p>
              <div className="sol-ficha" id={'ficha-0' + (index + 1)}>
                {item.ficha.map(([label, value]) => <div className="frow" key={label}><span>{label}</span><span>{value}</span></div>)}
                <a className="arrow sol-ficha-link" href={item.href}>Ir a la unidad ↗</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
