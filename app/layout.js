import './globals.css';
import CookieBanner from './CookieBanner';
import Script from 'next/script';

const BASE_URL = 'https://www.valoratuempresa.es';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  title: 'valoratuempresa.es | Valoración de empresas online desde 149€',
  description: 'Obtén una valoración profesional de tu PYME en 15 minutos. Metodología contrastada, informe inmediato, 100% confidencial.',
  keywords: 'valoración empresa, valorar empresa, cuánto vale mi empresa, valoración pyme, múltiplos valoración España',
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'valoratuempresa.es | Descubre cuánto vale tu empresa en 15 minutos',
    description: 'Valoración profesional de PYMEs desde 149€. Múltiplos de mercado + DCF + análisis cualitativo.',
    type: 'website',
    locale: 'es_ES',
    url: BASE_URL,
    siteName: 'valoratuempresa.es',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'valoratuempresa.es — Valoración profesional de PYMEs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'valoratuempresa.es | Descubre cuánto vale tu empresa en 15 minutos',
    description: 'Valoración profesional de PYMEs desde 149€.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/favicon-192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <CookieBanner />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
