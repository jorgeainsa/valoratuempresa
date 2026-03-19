import './globals.css';

export const metadata = {
  title: 'valoratuempresa.es | Valoración de empresas online desde 149€',
  description: 'Obtén una valoración profesional de tu PYME en 15 minutos. Metodología contrastada, informe inmediato, 100% confidencial. Más de 100 empresas ya confían en nosotros.',
  keywords: 'valoración empresa, valorar empresa, cuánto vale mi empresa, valoración pyme, múltiplos valoración España',
  openGraph: {
    title: 'valoratuempresa.es | Descubre cuánto vale tu empresa en 15 minutos',
    description: 'Valoración profesional de PYMEs desde 149€. Múltiplos de mercado + DCF + análisis cualitativo.',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
