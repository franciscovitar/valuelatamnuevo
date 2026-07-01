const WHATSAPP_URL = 'https://wa.me/5491130004720';
const EMAIL = 'info@valuelatam.com';

export function initLeadCapture() {
  const cleanups = [];

  if (!document.querySelector('.vl2-wa')) {
    const link = document.createElement('a');
    link.className = 'vl2-wa';
    link.href = WHATSAPP_URL;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'Abrir WhatsApp de Value Latam');
    link.innerHTML = '<span class="dot" aria-hidden="true"></span>WhatsApp';
    document.body.appendChild(link);
    cleanups.push(() => link.remove());
  }

  document.querySelectorAll('a[href="#"], a[href=""]').forEach((link) => {
    const text = (link.textContent || '').toLowerCase();
    if (text.includes('whatsapp')) {
      link.href = WHATSAPP_URL;
      link.target = '_blank';
      link.rel = 'noopener';
    }
    if (text.includes(EMAIL)) {
      link.href = 'mailto:' + EMAIL;
    }
  });

  const form = document.querySelector('#contacto form');
  if (!form) return () => cleanups.forEach((cleanup) => cleanup());

  let feedback = form.querySelector('.vl2-form-feedback');
  if (!feedback) {
    feedback = document.createElement('p');
    feedback.className = 'vl2-form-feedback';
    feedback.setAttribute('aria-live', 'polite');
    form.appendChild(feedback);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const name = document.getElementById('n')?.value || '';
    const email = document.getElementById('e')?.value || '';
    const phone = document.getElementById('t')?.value || '';
    const company = document.getElementById('emp')?.value || '';
    const objective = document.getElementById('obj')?.value || '';
    const message = document.getElementById('m')?.value || '';

    if (!name || !email || !phone || !company || !objective) {
      feedback.textContent = 'Completá los campos obligatorios para abrir WhatsApp con el mensaje listo.';
      return;
    }

    const text = [
      'Hola Value Latam, quiero agendar una llamada.',
      'Nombre: ' + name,
      'Email: ' + email,
      'Teléfono: ' + phone,
      'Empresa: ' + company,
      'Objetivo: ' + objective,
      message ? 'Mensaje: ' + message : '',
    ].filter(Boolean).join('\n');

    feedback.textContent = 'Abriendo WhatsApp con la consulta preparada...';
    window.open(WHATSAPP_URL + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  };

  form.addEventListener('submit', onSubmit);
  cleanups.push(() => form.removeEventListener('submit', onSubmit));

  return () => cleanups.forEach((cleanup) => cleanup());
}
