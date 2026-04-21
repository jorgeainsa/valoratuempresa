import Link from 'next/link';

export const metadata = {
  title: 'Blog sobre valoración de empresas | valoratuempresa.es',
  description: 'Guías, consejos y recursos para propietarios de pymes que quieren conocer el valor de su empresa.',
};

const posts = [
  {
    slug: 'como-valorar-mi-empresa',
    title: 'Cómo valorar mi empresa en España: guía completa para propietarios de pymes',
    excerpt: 'Todo lo que necesitas saber para entender cuánto vale tu empresa, qué métodos usan los inversores y cómo prepararte para una valoración profesional.',
    date: '2026-04-22',
    readTime: '8 min',
    tag: 'Guía',
  },
];

export default function BlogPage() {
  return (
    <>
      <style>{`
        .blog-card {
          background: var(--w);
          border: 1.5px solid var(--brd);
          border-radius: var(--r);
          padding: 28px 32px;
          transition: border-color .2s, box-shadow .2s;
          cursor: pointer;
        }
        .blog-card:hover {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px var(--blueG);
        }
      `}</style>

      <nav className="nav">
        <Link href="/" className="nav-logo">valora<span>tu</span>empresa</Link>
        <div className="nav-links">
          <Link href="/#precios" className="nav-lk">Precios</Link>
          <Link href="/#faq" className="nav-lk">FAQ</Link>
          <Link href="/blog" className="nav-lk">Blog</Link>
          <Link href="/#valorar" className="nav-cta">Valorar mi empresa</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px 32px 80px' }}>
        <p className="sec-l">Blog</p>
        <h1 className="sec-t" style={{ marginBottom: 8 }}>Recursos sobre valoración de empresas</h1>
        <p style={{ fontSize: 17, color: 'var(--ink3)', marginBottom: 48, lineHeight: 1.6 }}>
          Guías y consejos para propietarios de pymes que quieren conocer el valor real de su negocio.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article className="blog-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{
                    background: 'var(--blueS)',
                    color: 'var(--blue)',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 50,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>{post.tag}</span>
                  <span style={{ fontSize: 14, color: 'var(--ink3)' }}>{post.readTime} de lectura</span>
                  <span style={{ fontSize: 14, color: 'var(--ink3)' }}>·</span>
                  <span style={{ fontSize: 14, color: 'var(--ink3)' }}>
                    {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.3 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: 15, color: 'var(--ink3)', lineHeight: 1.6 }}>{post.excerpt}</p>
                <p style={{ marginTop: 16, fontSize: 15, color: 'var(--blue)', fontWeight: 600 }}>
                  Leer artículo →
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <footer style={{ borderTop: '1px solid var(--brd)', padding: '32px', textAlign: 'center', marginTop: 40 }}>
        <p style={{ fontSize: 14, color: 'var(--ink3)' }}>© 2026 valoratuempresa.es · Todos los derechos reservados</p>
      </footer>
    </>
  );
}
