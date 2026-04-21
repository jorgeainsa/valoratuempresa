import Link from 'next/link';

export const metadata = {
  title: 'Cómo valorar mi empresa en España: guía completa para pymes | valoratuempresa.es',
  description: 'Aprende los métodos que usan los inversores para valorar una pyme española: múltiplos de EBITDA, DCF y valor en libros. Guía práctica con ejemplos reales.',
  keywords: 'cómo valorar mi empresa, valoración empresa España, valorar pyme, múltiplos EBITDA pyme, cuánto vale mi empresa',
  alternates: {
    canonical: 'https://www.valoratuempresa.es/blog/como-valorar-mi-empresa',
  },
  openGraph: {
    title: 'Cómo valorar mi empresa en España: guía completa para pymes',
    description: 'Los métodos que usan los inversores para valorar una pyme española. Con ejemplos reales.',
    type: 'article',
    url: 'https://www.valoratuempresa.es/blog/como-valorar-mi-empresa',
  },
};

export default function ArticlePage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">valora<span>tu</span>empresa</Link>
        <div className="nav-links">
          <Link href="/#precios" className="nav-lk">Precios</Link>
          <Link href="/#faq" className="nav-lk">FAQ</Link>
          <Link href="/blog" className="nav-lk">Blog</Link>
          <Link href="/#valorar" className="nav-cta">Valorar mi empresa</Link>
        </div>
      </nav>

      <article style={{ maxWidth: 740, margin: '0 auto', padding: '110px 32px 80px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 14, color: 'var(--ink3)' }}>
          <Link href="/" style={{ color: 'var(--ink3)', textDecoration: 'none' }}>Inicio</Link>
          <span>›</span>
          <Link href="/blog" style={{ color: 'var(--ink3)', textDecoration: 'none' }}>Blog</Link>
          <span>›</span>
          <span style={{ color: 'var(--ink)' }}>Cómo valorar mi empresa</span>
        </div>

        {/* Tag + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ background: 'var(--blueS)', color: 'var(--blue)', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 50, textTransform: 'uppercase', letterSpacing: 1 }}>Guía</span>
          <span style={{ fontSize: 14, color: 'var(--ink3)' }}>8 min de lectura · 22 de abril de 2026</span>
        </div>

        {/* Título */}
        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.8px', marginBottom: 20, color: 'var(--ink)' }}>
          Cómo valorar mi empresa en España: guía completa para propietarios de pymes
        </h1>

        <p style={{ fontSize: 19, color: 'var(--ink3)', lineHeight: 1.65, marginBottom: 40, borderLeft: '3px solid var(--blue)', paddingLeft: 20 }}>
          Si alguna vez te has preguntado cuánto vale lo que has construido, esta guía es para ti. Aquí explicamos los tres métodos que usan los inversores y los asesores para valorar una pyme española, con ejemplos reales y sin tecnicismos innecesarios.
        </p>

        {/* Índice */}
        <div style={{ background: 'var(--blueS)', borderRadius: 'var(--r)', padding: '24px 28px', marginBottom: 48 }}>
          <p style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--blue)', marginBottom: 14 }}>En este artículo</p>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['#por-que', '¿Por qué necesitas saber cuánto vale tu empresa?'],
              ['#metodos', 'Los tres métodos principales de valoración'],
              ['#multiplos', 'Método 1: Múltiplos de EBITDA'],
              ['#dcf', 'Método 2: Descuento de flujos de caja (DCF)'],
              ['#libros', 'Método 3: Valor en libros ajustado'],
              ['#factores', 'Factores que aumentan (o reducen) el valor'],
              ['#cuando', '¿Cuándo necesitas una valoración formal?'],
              ['#como-empezar', 'Cómo empezar sin contratar a un asesor'],
            ].map(([href, text]) => (
              <li key={href}><a href={href} style={{ fontSize: 15, color: 'var(--blue)', textDecoration: 'none' }}>{text}</a></li>
            ))}
          </ol>
        </div>

        {/* Contenido */}
        <div style={{ fontSize: 17, lineHeight: 1.75, color: 'var(--ink2)' }}>

          <h2 id="por-que" style={h2Style}>¿Por qué necesitas saber cuánto vale tu empresa?</h2>
          <p style={pStyle}>La mayoría de propietarios de pymes desconocen el valor de su negocio hasta que llega un momento crítico: una oferta de compra, un conflicto entre socios, una herencia o la necesidad de financiación. En ese momento, negociar sin una referencia clara es negociar en desventaja.</p>
          <p style={pStyle}>Conocer el valor de tu empresa no es solo útil para venderla. Te permite tomar mejores decisiones estratégicas, saber si merece la pena reinvertir, evaluar si una oferta es justa o entender qué palancas tienes para hacer crecer ese valor.</p>

          <h2 id="metodos" style={h2Style}>Los tres métodos principales de valoración</h2>
          <p style={pStyle}>No existe un único método para valorar una empresa. Los inversores y asesores financieros suelen usar tres enfoques complementarios y después triangular los resultados para llegar a un rango de valor razonable.</p>

          <h2 id="multiplos" style={h2Style}>Método 1: Múltiplos de EBITDA</h2>
          <p style={pStyle}>Es el método más utilizado en operaciones de compraventa de pymes en España. Consiste en multiplicar el EBITDA (beneficio antes de intereses, impuestos, depreciaciones y amortizaciones) por un múltiplo que varía según el sector y las características del negocio.</p>

          <div style={{ background: 'var(--bg)', border: '1.5px solid var(--brd)', borderRadius: 'var(--rs)', padding: '20px 24px', margin: '24px 0' }}>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>Ejemplo práctico</p>
            <p style={{ fontSize: 15, color: 'var(--ink3)', lineHeight: 1.6 }}>Una empresa de servicios con un EBITDA de 500.000€ y un múltiplo sectorial de 5x tendría un valor aproximado de <strong style={{ color: 'var(--ink)' }}>2,5 millones de euros</strong>.</p>
          </div>

          <p style={pStyle}>Los múltiplos típicos para pymes españolas oscilan entre 3x y 8x EBITDA dependiendo del sector, el tamaño y la estabilidad del negocio. Las empresas de software o con ingresos recurrentes tienden a cotizar en la parte alta del rango; las empresas industriales o con alta dependencia del fundador, en la parte baja.</p>

          <h2 id="dcf" style={h2Style}>Método 2: Descuento de flujos de caja (DCF)</h2>
          <p style={pStyle}>El DCF (Discounted Cash Flow) es el método más riguroso desde el punto de vista financiero. Consiste en estimar los flujos de caja que generará la empresa en los próximos 5-10 años y descontarlos a valor presente usando una tasa que refleja el riesgo del negocio.</p>
          <p style={pStyle}>Es especialmente útil cuando la empresa tiene contratos a largo plazo, ingresos predecibles o está en una fase de crecimiento acelerado donde el EBITDA actual no refleja bien su potencial. Su limitación es que requiere proyecciones fiables, lo cual en una pyme puede ser complicado.</p>

          <h2 id="libros" style={h2Style}>Método 3: Valor en libros ajustado</h2>
          <p style={pStyle}>Este método parte del patrimonio neto contable de la empresa y lo ajusta para reflejar el valor real de los activos. Es más habitual en empresas con mucho activo fijo (naves industriales, maquinaria, inmuebles) donde el balance es una referencia relevante.</p>
          <p style={pStyle}>Para la mayoría de empresas de servicios, el valor en libros suele estar muy por debajo del valor real del negocio, ya que no recoge activos intangibles como la cartera de clientes, la marca o el equipo humano.</p>

          <h2 id="factores" style={h2Style}>Factores que aumentan (o reducen) el valor</h2>
          <p style={pStyle}>Más allá de los números, los inversores valoran (o penalizan) ciertos factores cualitativos que pueden mover el precio final de forma significativa:</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '24px 0' }}>
            {[
              ['Aumentan el valor', 'var(--greenS)', 'var(--green)', [
                'Ingresos recurrentes o contratos a largo plazo',
                'Diversificación de clientes (ninguno supera el 20% de la facturación)',
                'Equipo directivo sólido independiente del fundador',
                'Crecimiento sostenido en los últimos 3 años',
                'Márgenes superiores a la media sectorial',
              ]],
              ['Reducen el valor', 'var(--redS)', 'var(--red)', [
                'Dependencia excesiva del fundador o de un cliente clave',
                'Concentración de ingresos en pocos clientes',
                'Contratos a corto plazo o ingresos muy volátiles',
                'Deuda financiera elevada',
                'Sector en declive o con mucha competencia',
              ]],
            ].map(([title, bg, color, items]) => (
              <div key={title} style={{ background: bg, borderRadius: 'var(--rs)', padding: '18px 22px' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 10 }}>{title}</p>
                <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {items.map(item => <li key={item} style={{ fontSize: 15, color: 'var(--ink2)', lineHeight: 1.5 }}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h2 id="cuando" style={h2Style}>¿Cuándo necesitas una valoración formal?</h2>
          <p style={pStyle}>No siempre hace falta contratar a un asesor para obtener una valoración. Hay situaciones donde una estimación orientativa es suficiente como punto de partida, y otras donde sí necesitas un informe profesional con respaldo metodológico:</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '24px 0' }}>
            {[
              ['Estimación orientativa', 'Planificación estratégica, primera conversación con un inversor, curiosidad sobre el valor actual del negocio.'],
              ['Informe profesional', 'Compraventa real, herencia o liquidación de gananciales, entrada de un socio, presentación a un banco o fondo.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: 'var(--w)', border: '1.5px solid var(--brd)', borderRadius: 'var(--rs)', padding: '18px 20px' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{title}</p>
                <p style={{ fontSize: 14, color: 'var(--ink3)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>

          <h2 id="como-empezar" style={h2Style}>Cómo empezar sin contratar a un asesor</h2>
          <p style={pStyle}>Si quieres tener una primera referencia del valor de tu empresa antes de hablar con nadie, la forma más rápida es usar una herramienta de valoración automatizada. En valoratuempresa.es puedes obtener una estimación gratuita basada en los datos reales de tu negocio en menos de 15 minutos, o un informe profesional completo desde 149€.</p>
          <p style={pStyle}>No sustituye a una due diligence completa, pero te da una base sólida para negociar, planificar o simplemente saber lo que has construido.</p>
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--navy)', borderRadius: 'var(--r)', padding: '40px 36px', textAlign: 'center', marginTop: 56 }}>
          <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, color: '#fff', fontWeight: 400, marginBottom: 12 }}>
            ¿Quieres saber cuánto vale tu empresa?
          </h3>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 28, lineHeight: 1.6 }}>
            Obtén una valoración orientativa gratis o un informe profesional desde 149€ en menos de 15 minutos.
          </p>
          <Link href="/#valorar" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--blue)', color: '#fff', borderRadius: 'var(--rs)', fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
            Valorar mi empresa →
          </Link>
        </div>

        {/* Volver al blog */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href="/blog" style={{ fontSize: 15, color: 'var(--ink3)', textDecoration: 'none' }}>← Volver al blog</Link>
        </div>

      </article>

      <footer style={{ borderTop: '1px solid var(--brd)', padding: '32px', textAlign: 'center', marginTop: 40 }}>
        <p style={{ fontSize: 14, color: 'var(--ink3)' }}>© 2026 valoratuempresa.es · Todos los derechos reservados</p>
      </footer>
    </>
  );
}

const h2Style = {
  fontFamily: "'Instrument Serif', Georgia, serif",
  fontSize: 'clamp(22px, 3vw, 28px)',
  fontWeight: 400,
  letterSpacing: '-0.4px',
  color: 'var(--ink)',
  marginTop: 48,
  marginBottom: 16,
};

const pStyle = {
  marginBottom: 20,
};
