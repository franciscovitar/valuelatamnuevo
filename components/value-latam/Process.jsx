import { processSteps } from '@/data/valueLatamContent';
import SectionHeading from './SectionHeading';

export default function Process() {
  return (
    <section className="process" id="proceso">
      <div className="wrap">
        <SectionHeading eyebrow="Nuestro proceso" title="Cómo trabajamos con tu empresa, paso a paso." />
        <div className="steps reveal">
          {processSteps.map(([title, text], index) => <div className="step" key={title}><div className="n">{String(index + 1).padStart(2, '0')}</div><h4>{title}</h4><p>{text}</p></div>)}
        </div>
        <div className="closer reveal"><p>Trabajás con un solo interlocutor para toda tu operación. <b>En financiamiento, los honorarios se definen sobre la línea efectivamente disponible.</b></p><a className="btn btn-primary" href="#contacto">Empezá tu diagnóstico</a></div>
      </div>
    </section>
  );
}
