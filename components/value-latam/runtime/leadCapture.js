const WHATSAPP_URL = 'https://wa.me/5491130004720';
const EMAIL = 'info@valuelatam.com';

export function initLeadCapture() {
  const cleanups = [];

  if (!document.querySelector('.vl2-wa')) {
    const link = document.createElement('a');
    link.className = 'vl2-wa';
    link.href = WHATSAPP_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Abrir WhatsApp de Value Latam');
    link.innerHTML = '<span class="dot" aria-hidden="true"></span><span>WhatsApp</span>';
    document.body.appendChild(link);
    cleanups.push(() => link.remove());
  }

  document.querySelectorAll('a[href="#"], a[href=""]').forEach((link) => {
    const text = (link.textContent || '').toLowerCase();
    if (text.includes('whatsapp')) {
      link.href = WHATSAPP_URL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
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

  const required = ['n', 'e', 't', 'emp', 'obj'];
  const setFieldState = (field, invalid) => {
    if (!field) return;
    field.toggleAttribute('aria-invalid', invalid);
    field.closest('.field')?.classList.toggle('field-error', invalid);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const name = document.getElementById('n')?.value.trim() || '';
    const email = document.getElementById('e')?.value.trim() || '';
    const phone = document.getElementById('t')?.value.trim() || '';
    const company = document.getElementById('emp')?.value.trim() || '';
    const objective = document.getElementById('obj')?.value || '';
    const message = document.getElementById('m')?.value.trim() || '';

    let valid = true;
    required.forEach((id) => {
      const field = document.getElementById(id);
      const invalid = !field?.value || (field.type === 'email' && !field.checkValidity());
      setFieldState(field, invalid);
      if (invalid) valid = false;
    });

    if (!valid) {
      feedback.className = 'vl2-form-feedback is-error';
      feedback.textContent = 'Completá los campos obligatorios para abrir WhatsApp con el mensaje listo.';
      form.querySelector('[aria-invalid="true"]')?.focus();
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

    feedback.className = 'vl2-form-feedback is-success';
    feedback.textContent = 'Abriendo WhatsApp con la consulta preparada...';
    window.open(WHATSAPP_URL + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  };

  const onInput = (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) {
      setFieldState(target, false);
    }
  };

  form.addEventListener('submit', onSubmit);
  form.addEventListener('input', onInput);
  form.addEventListener('change', onInput);
  cleanups.push(() => {
    form.removeEventListener('submit', onSubmit);
    form.removeEventListener('input', onInput);
    form.removeEventListener('change', onInput);
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
