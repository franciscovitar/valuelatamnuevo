import { Resend } from 'resend';

let resendClient;

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY');
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const nombre = clean(body.nombre);
    const email = clean(body.email);
    const telefono = clean(body.telefono);
    const empresa = clean(body.empresa);
    const objetivo = clean(body.objetivo);
    const mensaje = clean(body.mensaje);

    if (!nombre || !email || !telefono || !empresa || !objetivo || !isEmail(email)) {
      return Response.json({ ok: false, error: 'Missing or invalid fields' }, { status: 400 });
    }

    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'ValueLatam Formulario <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO_EMAIL || 'info@valuelatam.com'],
      replyTo: email,
      subject: `Nuevo contacto (${objetivo}) - ${empresa}`,
      text: [
        `Nombre: ${nombre}`,
        `Email: ${email}`,
        `Teléfono: ${telefono}`,
        `Empresa: ${empresa}`,
        `Objetivo: ${objetivo}`,
        '',
        'Mensaje:',
        mensaje || '-',
      ].join('\n'),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
