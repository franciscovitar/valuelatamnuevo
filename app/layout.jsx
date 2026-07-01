import './value-latam.scss';

export const metadata = {
  metadataBase: new URL('https://www.valuelatam.com'),
  title: {
    default: 'Value Latam | Consultoría financiera integral',
    template: '%s | Value Latam',
  },
  description: 'Consultoría financiera integral para empresas: financiamiento, liquidez, medios de pago y automatización de procesos con IA.',
  applicationName: 'Value Latam',
  keywords: [
    'Value Latam',
    'consultoría financiera',
    'financiamiento empresas',
    'mercado de capitales',
    'liquidez empresarial',
    'medios de pago',
    'automatización con IA',
  ],
  authors: [{ name: 'Value Latam' }],
  creator: 'Value Latam',
  publisher: 'Value Latam',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Value Latam | Consultoría financiera integral',
    description: 'Financiamiento, liquidez, medios de pago y automatización con IA para empresas.',
    url: '/',
    siteName: 'Value Latam',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: '/value-latam-og.svg', width: 1200, height: 630, alt: 'Value Latam' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Value Latam | Consultoría financiera integral',
    description: 'Financiamiento, liquidez, medios de pago y automatización con IA para empresas.',
    images: ['/value-latam-og.svg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/value-latam-logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
