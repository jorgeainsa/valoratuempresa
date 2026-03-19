"use client";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════
const SECTORS = [
  { id: "saas", label: "Software / SaaS", evEbitda: 12.0, evRevenue: 3.5, capexPct: 0.08, wcPct: 0.05 },
  { id: "tech_services", label: "Servicios tecnológicos / IT", evEbitda: 9.0, evRevenue: 2.0, capexPct: 0.06, wcPct: 0.06 },
  { id: "ecommerce", label: "E-commerce / Marketplaces", evEbitda: 10.0, evRevenue: 1.75, capexPct: 0.07, wcPct: 0.08 },
  { id: "health", label: "Salud / Healthcare", evEbitda: 10.0, evRevenue: 2.25, capexPct: 0.06, wcPct: 0.06 },
  { id: "education", label: "Educación / Formación", evEbitda: 8.5, evRevenue: 1.5, capexPct: 0.05, wcPct: 0.05 },
  { id: "food", label: "Alimentación / Consumo", evEbitda: 7.5, evRevenue: 1.15, capexPct: 0.07, wcPct: 0.10 },
  { id: "services", label: "Servicios profesionales", evEbitda: 7.0, evRevenue: 1.15, capexPct: 0.04, wcPct: 0.07 },
  { id: "industry", label: "Industria / Manufactura", evEbitda: 6.5, evRevenue: 0.9, capexPct: 0.09, wcPct: 0.10 },
  { id: "distribution", label: "Distribución / Logística", evEbitda: 6.5, evRevenue: 0.6, capexPct: 0.06, wcPct: 0.08 },
  { id: "construction", label: "Construcción / Infraestructura", evEbitda: 5.5, evRevenue: 0.5, capexPct: 0.08, wcPct: 0.12 },
  { id: "hospitality", label: "Hostelería / Turismo", evEbitda: 7.0, evRevenue: 1.15, capexPct: 0.08, wcPct: 0.06 },
  { id: "energy", label: "Energía / Renovables", evEbitda: 8.5, evRevenue: 1.85, capexPct: 0.12, wcPct: 0.07 },
  { id: "transport", label: "Transporte", evEbitda: 5.5, evRevenue: 0.5, capexPct: 0.10, wcPct: 0.08 },
  { id: "agro", label: "Agricultura / Agroalimentario", evEbitda: 6.5, evRevenue: 0.8, capexPct: 0.09, wcPct: 0.10 },
  { id: "other", label: "Otro", evEbitda: 7.0, evRevenue: 1.0, capexPct: 0.07, wcPct: 0.08 },
];

const SIZE_ADJUSTMENTS = [
  { max: 5, adj: -0.20 }, { max: 15, adj: -0.10 }, { max: 30, adj: 0 },
  { max: 50, adj: 0.05 }, { max: Infinity, adj: 0.10 },
];

const QUAL_QUESTIONS = [
  { id: "recurrence", label: "Recurrencia de ingresos", question: "¿Qué porcentaje de tus ingresos son recurrentes?", options: ["<10%", "10-25%", "25-50%", "50-75%", ">75%"], weight: 3 },
  { id: "concentration", label: "Concentración de clientes", question: "¿Qué % de la facturación representan tus 3 mayores clientes?", options: [">70%", "50-70%", "30-50%", "15-30%", "<15%"], weight: 3 },
  { id: "founder", label: "Dependencia del fundador", question: "Si el fundador se fuera mañana, ¿la empresa podría operar con normalidad 6 meses?", options: ["Se pararía", "Caída severa", "Impacto moderado", "Impacto menor", "Sin impacto"], weight: 3 },
  { id: "margins", label: "Tendencia de márgenes", question: "¿Cómo han evolucionado tus márgenes en los últimos 3 años?", options: ["Caída fuerte", "Caída leve", "Estables", "Mejora leve", "Mejora fuerte"], weight: 2 },
  { id: "moat", label: "Ventaja competitiva", question: "¿Tienes patentes, tecnología propia, marca reconocida o contratos exclusivos?", options: ["Nada", "Algo menor", "Alguna ventaja", "Ventaja clara", "Ventaja muy fuerte"], weight: 2 },
  { id: "team", label: "Equipo directivo", question: "¿Tienes un equipo directivo profesionalizado más allá del fundador?", options: ["Solo fundador", "1 persona clave", "Equipo parcial", "Equipo completo", "Equipo senior top"], weight: 2 },
  { id: "scalability", label: "Escalabilidad", question: "¿Podrías duplicar facturación sin duplicar costes fijos?", options: ["Imposible", "Muy difícil", "Con inversión", "Bastante viable", "Totalmente escalable"], weight: 2 },
  { id: "geo", label: "Diversificación geográfica", question: "¿Qué porcentaje de ingresos viene de fuera de España?", options: ["0%", "1-10%", "10-25%", "25-50%", ">50%"], weight: 1 },
  { id: "digital", label: "Digitalización", question: "¿Qué nivel de digitalización tienen tus procesos core?", options: ["Muy bajo", "Bajo", "Medio", "Alto", "Totalmente digital"], weight: 1 },
  { id: "regulation", label: "Barreras de entrada", question: "¿Operas en un sector con barreras regulatorias o técnicas significativas?", options: ["Ninguna", "Muy bajas", "Moderadas", "Altas", "Muy altas"], weight: 1 },
];

const TAX_RATE = 0.25;
const TERMINAL_GROWTH = 0.018;
const PROJECTION_YEARS = 5;

const USE_CASES = [
  { icon: "👥", title: "Disputas entre socios", desc: "Saber cuánto vale la participación de cada socio para negociar una salida o resolver un conflicto." },
  { icon: "💔", title: "Divorcio con empresa", desc: "Valoración para liquidación de gananciales. Informe profesional para presentar al juzgado." },
  { icon: "📋", title: "Herencias y sucesiones", desc: "Repartir el patrimonio cuando la empresa es el activo principal." },
  { icon: "🤝", title: "Compraventa de participaciones", desc: "Necesitas un precio justo como base de negociación para comprar o vender." },
  { icon: "📊", title: "Planificación estratégica", desc: "Saber cuánto vale tu empresa hoy para decidir si crecer, buscar inversión o vender." },
  { icon: "🚀", title: "Rondas de inversión", desc: "Referencia de valoración sólida antes de sentarte a negociar con un inversor." },
];

const TESTIMONIALS = [
  { text: "En menos de una hora tenía un informe profesional que me ahorró miles de euros en asesores.", author: "Carlos M.", role: "CEO, empresa de logística · Madrid" },
  { text: "Me permitió presentar un informe serio al juzgado sin esperar semanas ni gastar una fortuna.", author: "Laura G.", role: "Fundadora, consultoría IT · Barcelona" },
  { text: "Como asesor fiscal, lo recomiendo a todos mis clientes PYME. Rápido, profesional y asequible.", author: "Miguel R.", role: "Asesor fiscal · Valencia" },
];

const FAQS = [
  { q: "¿Qué metodología utilizáis?", a: "Combinamos tres métodos: múltiplos de transacciones comparables en España (ajustados por sector y tamaño), un DCF simplificado, y un scoring cualitativo de 10 factores. El resultado es un rango de valoración ponderado." },
  { q: "¿Es válida para presentar en un juzgado?", a: "Nuestros informes son indicativos y orientativos. Son una excelente base para negociaciones. Para valoraciones vinculantes con plena validez pericial, recomendamos complementar con un perito judicial." },
  { q: "¿Cuánto tiempo tarda?", a: "El Informe Esencial se genera automáticamente tras completar el formulario (unos 15 minutos). El Informe Profesional tarda 24-48h porque incluye revisión por un analista." },
  { q: "¿Mis datos están seguros?", a: "Totalmente. No compartimos tus datos financieros con terceros. Toda la información se procesa de forma confidencial." },
  { q: "¿Para qué tamaño de empresa funciona?", a: "Está diseñado para PYMEs españolas con facturación entre 1 y 100 millones de euros." },
  { q: "¿Puedo modificar los datos y recalcular?", a: "Sí. Puedes cambiar los datos y obtener una nueva estimación sin coste adicional durante 30 días." },
];

// ═══════════════════════════════════════════════════════════════
// VALUATION ENGINE
// ═══════════════════════════════════════════════════════════════
function getSizeAdj(revenue) {
  const m = revenue / 1e6;
  for (const s of SIZE_ADJUSTMENTS) if (m <= s.max) return s.adj;
  return 0.10;
}

function calcQualityScore(answers) {
  let total = 0, maxTotal = 0;
  QUAL_QUESTIONS.forEach((q) => {
    const val = answers[q.id];
    if (val !== undefined) total += (val + 1) * q.weight;
    maxTotal += 5 * q.weight;
  });
  return maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 50;
}

function getScorePercentile(score) {
  if (score <= 30) return 0.25;
  if (score <= 60) return 0.50;
  if (score <= 80) return 0.75;
  return 0.90;
}

function getWacc(score) {
  if (score <= 30) return 0.155;
  if (score <= 60) return 0.13;
  if (score <= 80) return 0.115;
  return 0.105;
}

function runValuation(data) {
  const sector = SECTORS.find(s => s.id === data.sector);
  if (!sector) return null;
  const rev = parseFloat(data.revenue) * 1e6 || 0;
  const ebitda = parseFloat(data.ebitda) * 1e6 || 0;
  const dfn = parseFloat(data.dfn) * 1e6 || 0;
  const ebitda1 = parseFloat(data.ebitda1) * 1e6 || ebitda;
  const ebitda2 = parseFloat(data.ebitda2) * 1e6 || ebitda1;
  const qualScore = calcQualityScore(data.qualAnswers || {});
  const percentile = getScorePercentile(qualScore);
  const wacc = getWacc(qualScore);
  const baseMultiple = sector.evEbitda;
  const sizeAdj = getSizeAdj(rev);
  const adjMultiple = baseMultiple * (1 + sizeAdj);
  const multipleRange = 0.30;
  const lowMult = adjMultiple * (1 - multipleRange);
  const highMult = adjMultiple * (1 + multipleRange);
  const selectedMult = lowMult + (highMult - lowMult) * percentile;
  const evMultiples = ebitda > 0 ? ebitda * selectedMult : rev * sector.evRevenue;
  const eqMultiples = evMultiples - dfn;
  const growthHist = ebitda2 > 0 && ebitda > 0 ? Math.pow(ebitda / ebitda2, 1 / 2) - 1 : 0.05;
  const cappedGrowth = Math.max(0.02, Math.min(growthHist, 0.20));
  const fadeRate = (cappedGrowth - TERMINAL_GROWTH) / PROJECTION_YEARS;
  let sumPvFcf = 0, lastFcf = 0, projEbitda = ebitda, prevRev = rev;
  for (let y = 1; y <= PROJECTION_YEARS; y++) {
    const g = cappedGrowth - fadeRate * (y - 1);
    projEbitda *= (1 + g);
    const projRev = prevRev * (1 + g);
    const fcf = projEbitda * (1 - TAX_RATE) - projRev * sector.capexPct - (projRev - prevRev) * sector.wcPct;
    sumPvFcf += fcf / Math.pow(1 + wacc, y);
    lastFcf = fcf;
    prevRev = projRev;
  }
  const pvTerminal = (lastFcf * (1 + TERMINAL_GROWTH) / (wacc - TERMINAL_GROWTH)) / Math.pow(1 + wacc, PROJECTION_YEARS);
  const evDcf = sumPvFcf + pvTerminal;
  const eqDcf = evDcf - dfn;
  const qualMidpoint = (evMultiples + evDcf) / 2;
  const qualAdj = qualMidpoint * ((qualScore - 50) / 200);
  const evBlended = evMultiples * 0.50 + evDcf * 0.30 + (qualMidpoint + qualAdj) * 0.20;
  const eqBlended = evBlended - dfn;
  return {
    sector, rev, ebitda, dfn, qualScore, percentile, wacc,
    baseMultiple, sizeAdj, adjMultiple, selectedMult,
    evMultiples, eqMultiples, evDcf, eqDcf, cappedGrowth,
    evBlended, eqBlended,
    eqLow: Math.max(0, eqBlended * 0.80),
    eqHigh: eqBlended * 1.20,
    sumPvFcf, pvTerminal,
  };
}

const fmtM = (n) => n == null || isNaN(n) ? "–" : (n / 1e6).toFixed(1).replace(".", ",") + "M€";
const fmtPct = (n) => (n * 100).toFixed(1).replace(".", ",") + "%";

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
// Styles are in globals.css

// ═══════════════════════════════════════════════════════════════
// SUB COMPONENTS
// ═══════════════════════════════════════════════════════════════
const Ck = () => <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

function Anim({ children, className = "" }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`anim ${v ? "vis" : ""} ${className}`}>{children}</div>;
}

function FAQ({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-i ${open ? "open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen(!open)}>{item.q}<span className="faq-tg">+</span></button>
      {open && <div className="faq-a">{item.a}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LANDING SECTIONS
// ═══════════════════════════════════════════════════════════════
function LandingPage({ onStart, scrollToRef }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <>
      <section className="hero">
        <div className="h-badge"><span className="dot" />Más de 100 empresas ya han confiado en nosotros</div>
        <h1>Descubre cuánto vale <em>tu empresa</em> en 15 minutos</h1>
        <p className="h-sub">Obtén una valoración profesional de tu PYME por una fracción de lo que cuesta un asesor. Metodología contrastada, informe inmediato, 100% confidencial.</p>
        <div className="h-ctas">
          <button className="btn-h" onClick={onStart}>Obtener mi valoración →</button>
          <button className="btn-gh" onClick={() => scrollTo("como")}>Ver cómo funciona</button>
        </div>
        <div className="h-proof">
          <div className="h-proof-i"><Ck /> Resultado en minutos</div><div className="h-proof-d" />
          <div className="h-proof-i"><Ck /> Desde 149€</div><div className="h-proof-d" />
          <div className="h-proof-i"><Ck /> 100% confidencial</div>
        </div>
      </section>

      <div className="trust">
        <div className="trust-l">La confianza de los empresarios españoles, en cifras</div>
        <div className="trust-s">
          <div><div className="trust-n">+100</div><div className="trust-t">Empresas valoradas</div></div>
          <div><div className="trust-n">15</div><div className="trust-t">Sectores cubiertos</div></div>
          <div><div className="trust-n">4,8/5</div><div className="trust-t">Valoración media</div></div>
          <div><div className="trust-n">&lt;24h</div><div className="trust-t">Entrega del informe</div></div>
        </div>
      </div>

      <section className="sec" id="casos">
        <Anim><div className="sec-l">¿Para qué necesitas una valoración?</div><h2 className="sec-t">Situaciones donde te podemos ayudar</h2><p className="sec-sub">Cada empresa tiene sus circunstancias. Estos son los motivos más frecuentes.</p></Anim>
        <Anim><div className="cgrid">{USE_CASES.map((c, i) => <div className="ccard" key={i}><div className="ccard-icon">{c.icon}</div><div className="ccard-t">{c.title}</div><div className="ccard-d">{c.desc}</div></div>)}</div></Anim>
      </section>

      <section className="sec-fw" id="como">
        <div className="sec-fw-inner sec-c">
          <Anim><div className="sec-l">Proceso</div><h2 className="sec-t">Cómo funciona</h2><p className="sec-sub">Tres pasos simples. Sin reuniones, sin esperas.</p></Anim>
          <Anim>
            <div className="steps">
              <div className="step"><div className="step-n">1</div><h3>Introduce tus datos</h3><p>Completa un formulario guiado con la información básica de tu empresa. Te llevará unos 15 minutos.</p></div>
              <div className="step"><div className="step-n">2</div><h3>Calculamos tu valoración</h3><p>Nuestro motor aplica tres metodologías: múltiplos de mercado, DCF y scoring cualitativo.</p></div>
              <div className="step"><div className="step-n">3</div><h3>Recibe tu informe</h3><p>Descarga un informe PDF profesional con el rango de valoración y desglose completo.</p></div>
            </div>
          </Anim>
        </div>
      </section>

      <section className="sec sec-c" id="precios" ref={scrollToRef}>
        <Anim><div className="sec-l">Precios</div><h2 className="sec-t">Elige tu plan de valoración</h2><p className="sec-sub">Sin sorpresas. Pago único, sin suscripciones.</p></Anim>
        <Anim>
          <div className="pgrid">
            <div className="pcard">
              <div className="p-name">Estimación rápida</div><div className="p-amt">Gratis</div>
              <div className="p-desc">Un rango orientativo para hacerte una primera idea.</div>
              <div className="p-feats">
                <div className="p-feat"><Ck /> Rango de valoración en pantalla</div>
                <div className="p-feat"><Ck /> Basado en múltiplos sectoriales</div>
                <div className="p-feat"><Ck /> Resultado inmediato</div>
              </div>
              <button className="p-btn p-btn-o" onClick={onStart}>Empezar gratis</button>
            </div>
            <div className="pcard feat">
              <div className="p-badge">Más popular</div>
              <div className="p-name">Informe Esencial</div><div className="p-amt">149€ <span>+ IVA</span></div>
              <div className="p-desc">Informe completo con tres metodologías. Ideal para negociaciones.</div>
              <div className="p-feats">
                <div className="p-feat"><Ck /> Todo lo del plan gratuito</div>
                <div className="p-feat"><Ck /> Informe PDF profesional</div>
                <div className="p-feat"><Ck /> Múltiplos + DCF + Quality Score</div>
                <div className="p-feat"><Ck /> Desglose por metodología</div>
                <div className="p-feat"><Ck /> 30 días para recalcular</div>
              </div>
              <button className="p-btn p-btn-p" onClick={onStart}>Obtener informe esencial</button>
            </div>
            <div className="pcard">
              <div className="p-name">Informe Profesional</div><div className="p-amt">299€ <span>+ IVA</span></div>
              <div className="p-desc">Análisis en profundidad con revisión por un analista experto.</div>
              <div className="p-feats">
                <div className="p-feat"><Ck /> Todo lo del plan Esencial</div>
                <div className="p-feat"><Ck /> Benchmarking sectorial</div>
                <div className="p-feat"><Ck /> Análisis de sensibilidad</div>
                <div className="p-feat"><Ck /> Revisión por analista experto</div>
                <div className="p-feat"><Ck /> Entrega en 24-48h</div>
              </div>
              <button className="p-btn p-btn-o" onClick={onStart}>Obtener informe profesional</button>
            </div>
          </div>
        </Anim>
      </section>

      <section className="sec-fw">
        <div className="sec-fw-inner">
          <Anim><div className="sec-l" style={{ textAlign: "center" }}>Testimonios</div><h2 className="sec-t" style={{ textAlign: "center" }}>Lo que dicen nuestros clientes</h2><p className="sec-sub" style={{ textAlign: "center", margin: "0 auto 44px" }}>Empresarios y asesores que ya han utilizado nuestro servicio.</p></Anim>
          <Anim>
            <div className="tgrid">{TESTIMONIALS.map((t, i) => (
              <div className="tcard" key={i}>
                <div className="t-stars">{"★★★★★"}</div>
                <div className="t-text">"{t.text}"</div>
                <div className="t-auth">{t.author}</div>
                <div className="t-role">{t.role}</div>
              </div>
            ))}</div>
          </Anim>
        </div>
      </section>

      <section className="sec sec-c" id="faq">
        <Anim><div className="sec-l">Preguntas frecuentes</div><h2 className="sec-t">¿Tienes dudas?</h2><p className="sec-sub">Las respuestas a las preguntas que más nos hacen.</p></Anim>
        <Anim><div className="faq-list">{FAQS.map((f, i) => <FAQ key={i} item={f} />)}</div></Anim>
      </section>

      <Anim>
        <div className="cta-ban">
          <h2>¿Listo para saber cuánto vale tu empresa?</h2>
          <p>Empieza gratis y obtén una estimación en menos de 15 minutos.</p>
          <button className="cta-btn2" onClick={onStart}>Obtener mi valoración →</button>
        </div>
      </Anim>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// VALUATION APP STEPS
// ═══════════════════════════════════════════════════════════════
const APP_STEPS = [
  { id: "company", label: "Empresa" },
  { id: "financials", label: "Financieros" },
  { id: "qualitative", label: "Cualitativo" },
  { id: "results", label: "Resultado" },
];

function StepCompany({ data, onChange }) {
  return (
    <div className="fade-in">
      <h2 className="app-title">Tu empresa</h2>
      <p className="app-sub">Información básica sobre la compañía para contextualizar la valoración.</p>
      <div className="fgrid">
        <div className="fld fw"><label>Nombre de la empresa</label><input type="text" placeholder="Ej: Tech Solutions SL" value={data.name || ""} onChange={e => onChange("name", e.target.value)} /></div>
        <div className="fld fw"><label>Sector</label><select value={data.sector || ""} onChange={e => onChange("sector", e.target.value)}><option value="">Selecciona un sector</option>{SECTORS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
        <div className="fld"><label>Año de fundación</label><input type="number" placeholder="Ej: 2010" value={data.founded || ""} onChange={e => onChange("founded", e.target.value)} /></div>
        <div className="fld"><label>Número de empleados</label><input type="number" placeholder="Ej: 45" value={data.employees || ""} onChange={e => onChange("employees", e.target.value)} /></div>
        <div className="fld fw"><label>Provincia</label><input type="text" placeholder="Ej: Barcelona" value={data.province || ""} onChange={e => onChange("province", e.target.value)} /></div>
      </div>
    </div>
  );
}

function StepFinancials({ data, onChange }) {
  return (
    <div className="fade-in">
      <h2 className="app-title">Datos financieros</h2>
      <p className="app-sub">Introduce las cifras clave. Todos los importes en millones de euros.</p>
      <div className="fgrid">
        <div className="fld-sep">Último ejercicio cerrado</div>
        <div className="fld"><label>Facturación <span className="u">(M€)</span></label><input type="number" step="0.1" placeholder="Ej: 12.5" value={data.revenue || ""} onChange={e => onChange("revenue", e.target.value)} /></div>
        <div className="fld"><label>EBITDA <span className="u">(M€)</span></label><input type="number" step="0.1" placeholder="Ej: 2.1" value={data.ebitda || ""} onChange={e => onChange("ebitda", e.target.value)} /><span className="hlp">Resultado operativo + amortizaciones</span></div>
        <div className="fld"><label>Deuda Financiera Neta <span className="u">(M€)</span></label><input type="number" step="0.1" placeholder="Ej: 1.5" value={data.dfn || ""} onChange={e => onChange("dfn", e.target.value)} /><span className="hlp">Deuda financiera − caja. Negativo si caja neta</span></div>
        <div className="fld"><label>CAPEX anual <span className="u">(M€)</span></label><input type="number" step="0.1" placeholder="Opcional" value={data.capex || ""} onChange={e => onChange("capex", e.target.value)} /><span className="hlp">Dejar vacío para usar estimación sectorial</span></div>
        <div className="fld-sep">Ejercicios anteriores (para calcular tendencia)</div>
        <div className="fld"><label>EBITDA hace 1 año <span className="u">(M€)</span></label><input type="number" step="0.1" placeholder="Ej: 1.8" value={data.ebitda1 || ""} onChange={e => onChange("ebitda1", e.target.value)} /></div>
        <div className="fld"><label>EBITDA hace 2 años <span className="u">(M€)</span></label><input type="number" step="0.1" placeholder="Ej: 1.5" value={data.ebitda2 || ""} onChange={e => onChange("ebitda2", e.target.value)} /></div>
      </div>
    </div>
  );
}

function StepQualitative({ data, onChange }) {
  const answers = data.qualAnswers || {};
  const answered = Object.keys(answers).length;
  return (
    <div className="fade-in">
      <h2 className="app-title">Análisis cualitativo</h2>
      <p className="app-sub">Responde estas preguntas para ajustar la valoración. <strong>{answered}/10 respondidas</strong></p>
      {QUAL_QUESTIONS.map((q) => {
        const wl = q.weight === 3 ? "hi" : q.weight === 2 ? "md" : "lo";
        const wt = q.weight === 3 ? "Impacto alto" : q.weight === 2 ? "Impacto medio" : "Impacto bajo";
        return (
          <div key={q.id} className={`qcard ${answers[q.id] !== undefined ? "ans" : ""}`}>
            <div className="q-hdr"><span className={`q-bdg ${wl}`}>{wt}</span><span className="q-lbl">{q.label}</span></div>
            <p className="q-txt">{q.question}</p>
            <div className="q-opts">{q.options.map((opt, i) => (
              <button key={i} className={`q-opt ${answers[q.id] === i ? "sel" : ""}`} onClick={() => onChange("qualAnswers", { ...answers, [q.id]: i })}>{opt}</button>
            ))}</div>
          </div>
        );
      })}
    </div>
  );
}

function StepResults({ data, onBack, onHome }) {
  const r = runValuation(data);
  if (!r) return <p>Error en los datos. Vuelve atrás para corregir.</p>;
  const scoreColor = r.qualScore > 70 ? "var(--green)" : r.qualScore > 40 ? "var(--blue)" : "var(--amber)";
  const qualDetails = QUAL_QUESTIONS.map(q => {
    const val = (data.qualAnswers || {})[q.id];
    const score = val !== undefined ? ((val + 1) / 5) * 100 : 0;
    return { label: q.label, score: Math.round(score), color: score >= 70 ? "var(--green)" : score >= 40 ? "var(--blue)" : "var(--amber)" };
  });

  return (
    <div className="fade-in">
      <h2 className="app-title">Resultado de la valoración</h2>
      <p className="app-sub">{data.name || "Tu empresa"} · {r.sector.label}</p>

      {/* Hero value - FREE teaser */}
      <div className="r-hero">
        <div className="r-hero-l">Equity Value estimado</div>
        <div className="r-hero-v">{fmtM(r.eqBlended)}</div>
        <div className="r-hero-rng">Rango: {fmtM(r.eqLow)} – {fmtM(r.eqHigh)}</div>
      </div>

      <div className="r-grid">
        <div className="r-card"><div className="r-card-t">Enterprise Value</div><div className="r-card-v">{fmtM(r.evBlended)}</div><div className="r-card-d">Antes de deducir deuda</div></div>
        <div className="r-card"><div className="r-card-t">Deuda Financiera Neta</div><div className="r-card-v">{fmtM(r.dfn)}</div><div className="r-card-d">{r.dfn > 0 ? "Se deduce del EV" : "Caja neta — suma al EV"}</div></div>
        <div className="r-card"><div className="r-card-t">Múltiplo aplicado</div><div className="r-card-v">{r.selectedMult.toFixed(1)}x</div><div className="r-card-d">EV/EBITDA · Base: {r.baseMultiple.toFixed(1)}x, ajuste: {r.sizeAdj >= 0 ? "+" : ""}{(r.sizeAdj * 100).toFixed(0)}%</div></div>
        <div className="r-card"><div className="r-card-t">Quality Score</div><div className="r-card-v" style={{ color: scoreColor }}>{r.qualScore}/100</div><div className="r-card-d">Percentil {Math.round(r.percentile * 100)} del rango</div></div>
      </div>

      {/* PAYWALL */}
      <div className="paywall">
        <h3>Desbloquea el informe completo</h3>
        <p>Obtén el PDF profesional con el desglose por metodología, Quality Score detallado, hipótesis del DCF, benchmarking sectorial y recomendaciones.</p>
        <div className="paywall-btns">
          <button className="pw-btn pw-btn-p" onClick={() => alert("Aquí se conectaría Stripe Checkout (149€ + IVA). Funcionalidad pendiente de integrar.")}>Informe Esencial · 149€ + IVA</button>
          <button className="pw-btn pw-btn-o" onClick={() => alert("Aquí se conectaría Stripe Checkout (299€ + IVA). Funcionalidad pendiente de integrar.")}>Informe Profesional · 299€ + IVA</button>
        </div>
      </div>

      {/* Methodology preview */}
      <div className="r-sec">
        <h3>Desglose por metodología (vista previa)</h3>
        <table className="m-tbl">
          <thead><tr><th>Método</th><th>Enterprise Value</th><th>Equity Value</th><th>Peso</th></tr></thead>
          <tbody>
            <tr><td>Múltiplos comparables</td><td>{fmtM(r.evMultiples)}</td><td>{fmtM(r.eqMultiples)}</td><td>50%</td></tr>
            <tr><td>DCF simplificado</td><td>{fmtM(r.evDcf)}</td><td>{fmtM(r.eqDcf)}</td><td>30%</td></tr>
            <tr><td>Ajuste cualitativo</td><td colSpan="2" style={{ textAlign: "center" }}>Score {r.qualScore}/100</td><td>20%</td></tr>
            <tr><td>Valoración ponderada</td><td>{fmtM(r.evBlended)}</td><td>{fmtM(r.eqBlended)}</td><td>100%</td></tr>
          </tbody>
        </table>
      </div>

      {/* Quality score bars */}
      <div className="r-sec">
        <h3>Quality Score · Desglose</h3>
        <div>{qualDetails.map((d, i) => (
          <div className="sc-row" key={i}>
            <span className="sc-lbl">{d.label}</span>
            <div className="sc-bg"><div className="sc-fill" style={{ width: d.score + "%", background: d.color }} /></div>
            <span className="sc-val">{d.score}</span>
          </div>
        ))}</div>
      </div>

      <div className="discl"><strong>Aviso legal:</strong> Esta valoración tiene carácter indicativo y orientativo. No constituye asesoramiento financiero, fiscal ni legal. Para una valoración vinculante, se recomienda contratar los servicios de un asesor profesional cualificado.</div>

      <div className="btn-row">
        <button className="btn btn-g" onClick={onBack}>← Modificar datos</button>
        <button className="btn btn-g" onClick={onHome}>Volver al inicio</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VALUATION APP WRAPPER
// ═══════════════════════════════════════════════════════════════
function ValuationApp({ onHome }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ qualAnswers: {} });
  const topRef = useRef(null);
  const onChange = (k, v) => setData(d => ({ ...d, [k]: v }));
  const canNext = () => {
    if (step === 0) return data.sector;
    if (step === 1) return data.revenue && data.ebitda;
    if (step === 2) return Object.keys(data.qualAnswers || {}).length >= 5;
    return false;
  };
  const go = (dir) => {
    setStep(s => s + dir);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app-overlay">
      <div ref={topRef} />
      <div className="prog">
        {APP_STEPS.map((s, i) => (
          <div key={s.id} className={`prog-s ${i === step ? "act" : ""} ${i < step ? "done" : ""}`}>
            <div className="prog-n">{i < step ? "✓" : i + 1}</div>
            <span className="prog-lbl">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="app-main">
        {step === 0 && <StepCompany data={data} onChange={onChange} />}
        {step === 1 && <StepFinancials data={data} onChange={onChange} />}
        {step === 2 && <StepQualitative data={data} onChange={onChange} />}
        {step === 3 && <StepResults data={data} onBack={() => go(-1)} onHome={onHome} />}
        {step < 3 && (
          <div className="btn-row">
            {step > 0 ? <button className="btn btn-g" onClick={() => go(-1)}>← Atrás</button> : <button className="btn btn-g" onClick={onHome}>← Volver al inicio</button>}
            <button className="btn btn-p" disabled={!canNext()} onClick={() => go(1)}>{step === 2 ? "Ver valoración →" : "Siguiente →"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("landing"); // "landing" | "app"
  const pricingRef = useRef(null);

  const handleStart = () => {
    setView("app");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleHome = () => {
    setView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollTo = (id) => {
    if (view !== "landing") { setView("landing"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100); }
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="nav">
        <a className="nav-logo" onClick={handleHome}>valora<span>tuempresa</span>.es</a>
        <div className="nav-links">
          {view === "landing" && <>
            <button className="nav-lk" onClick={() => scrollTo("casos")}>Casos de uso</button>
            <button className="nav-lk" onClick={() => scrollTo("como")}>Cómo funciona</button>
            <button className="nav-lk" onClick={() => scrollTo("precios")}>Precios</button>
            <button className="nav-lk" onClick={() => scrollTo("faq")}>FAQ</button>
          </>}
          <button className="nav-cta" onClick={handleStart}>Valorar mi empresa</button>
        </div>
      </nav>

      {view === "landing" ? (
        <>
          <LandingPage onStart={handleStart} scrollToRef={pricingRef} />
          <footer className="footer">
            <div style={{ marginBottom: 6 }}><span style={{ fontWeight: 800, color: "var(--ink)" }}>valora<span style={{ color: "var(--blue)" }}>tuempresa</span>.es</span></div>
            © 2026 valoratuempresa.es · <a href="#">Política de privacidad</a> · <a href="#">Aviso legal</a>
          </footer>
        </>
      ) : (
        <ValuationApp onHome={handleHome} />
      )}
    </>
  );
}
