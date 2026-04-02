"use client";
import { useState, useEffect, useRef } from "react";

const SECTORS = [
  { id: "saas", label: "Software / SaaS", evEbitda: 12.0, evRevenue: 3.0, capexPct: 0.08, wcPct: 0.10 },
  { id: "tech_services", label: "Servicios tecnológicos / IT", evEbitda: 9.0, evRevenue: 2.0, capexPct: 0.06, wcPct: 0.10 },
  { id: "ecommerce", label: "E-commerce / Marketplaces", evEbitda: 7.0, evRevenue: 1.5, capexPct: 0.06, wcPct: 0.10 },
  { id: "health", label: "Salud / Healthcare", evEbitda: 10.0, evRevenue: 2.0, capexPct: 0.07, wcPct: 0.10 },
  { id: "education", label: "Educación / Formación", evEbitda: 8.0, evRevenue: 1.5, capexPct: 0.05, wcPct: 0.05 },
  { id: "food", label: "Alimentación / Consumo", evEbitda: 7.0, evRevenue: 1.0, capexPct: 0.07, wcPct: 0.15 },
  { id: "services", label: "Servicios profesionales", evEbitda: 7.0, evRevenue: 1.0, capexPct: 0.03, wcPct: 0.10 },
  { id: "industry", label: "Industria / Manufactura", evEbitda: 7.0, evRevenue: 1.0, capexPct: 0.10, wcPct: 0.15 },
  { id: "distribution", label: "Distribución / Logística", evEbitda: 6.5, evRevenue: 0.6, capexPct: 0.10, wcPct: 0.10 },
  { id: "construction", label: "Construcción / Infraestructura", evEbitda: 5.5, evRevenue: 0.5, capexPct: 0.10, wcPct: 0.12 },
  { id: "hospitality", label: "Hostelería / Turismo", evEbitda: 7.0, evRevenue: 1.0, capexPct: 0.08, wcPct: 0.06 },
  { id: "energy", label: "Energía / Renovables", evEbitda: 8.0, evRevenue: 1.5, capexPct: 0.12, wcPct: 0.10 },
  { id: "transport", label: "Transporte", evEbitda: 5.5, evRevenue: 0.5, capexPct: 0.10, wcPct: 0.08 },
  { id: "agro", label: "Agricultura / Agroalimentario", evEbitda: 6.5, evRevenue: 0.8, capexPct: 0.10, wcPct: 0.12 },
  { id: "other", label: "Otro", evEbitda: 7.0, evRevenue: 1.0, capexPct: 0.10, wcPct: 0.10 },
];
const SIZE_ADJUSTMENTS = [{ max:5, adj:-0.30 },{ max:15, adj:-0.15 },{ max:30, adj:0 },{ max:50, adj:0.05 },{ max:Infinity, adj:0.10 }];
const QUAL_QUESTIONS = [
  { id:"recurrence", label:"Recurrencia de ingresos", question:"¿Qué porcentaje de tus ingresos son recurrentes?", options:["<10%","10-25%","25-50%","50-75%",">75%"], weight:3 },
  { id:"concentration", label:"Concentración de clientes", question:"¿Qué % de la facturación representan tus 3 mayores clientes?", options:[">70%","50-70%","30-50%","15-30%","<15%"], weight:3 },
  { id:"founder", label:"Dependencia del fundador", question:"Si el fundador se fuera mañana, ¿la empresa podría operar con normalidad 6 meses?", options:["Se pararía","Caída severa","Impacto moderado","Impacto menor","Sin impacto"], weight:3 },
  { id:"margins", label:"Tendencia de márgenes", question:"¿Cómo han evolucionado tus márgenes en los últimos 3 años?", options:["Caída fuerte","Caída leve","Estables","Mejora leve","Mejora fuerte"], weight:2 },
  { id:"moat", label:"Ventaja competitiva", question:"¿Tienes patentes, tecnología propia, marca reconocida o contratos exclusivos?", options:["Nada","Algo menor","Alguna ventaja","Ventaja clara","Ventaja muy fuerte"], weight:2 },
  { id:"team", label:"Equipo directivo", question:"¿Tienes un equipo directivo profesionalizado más allá del fundador?", options:["Solo fundador","1 persona clave","Equipo parcial","Equipo completo","Equipo senior top"], weight:2 },
  { id:"scalability", label:"Escalabilidad", question:"¿Podrías duplicar facturación sin duplicar costes fijos?", options:["Imposible","Muy difícil","Con inversión","Bastante viable","Totalmente escalable"], weight:2 },
  { id:"geo", label:"Diversificación geográfica", question:"¿Qué porcentaje de ingresos viene de fuera de España?", options:["0%","1-10%","10-25%","25-50%",">50%"], weight:1 },
  { id:"digital", label:"Digitalización", question:"¿Qué nivel de digitalización tienen tus procesos core?", options:["Muy bajo","Bajo","Medio","Alto","Totalmente digital"], weight:1 },
  { id:"regulation", label:"Barreras de entrada", question:"¿Operas en un sector con barreras regulatorias o técnicas significativas?", options:["Ninguna","Muy bajas","Moderadas","Altas","Muy altas"], weight:1 },
];
const TAX_RATE=0.25, TERMINAL_GROWTH=0.018, PROJECTION_YEARS=5;

const IcUsers=()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcHeart=()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcFile=()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>;
const IcScale=()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M1 7l4 8h6l4-8M13 7l4 8h6"/><path d="M1 15h10M13 15h10"/></svg>;
const IcChart=()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>;
const IcTrend=()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>;

const USE_CASES=[
  {icon:<IcUsers/>,title:"Disputas entre socios",desc:"Saber cuánto vale la participación de cada socio para negociar una salida o resolver un conflicto."},
  {icon:<IcHeart/>,title:"Divorcio con empresa",desc:"Valoración para liquidación de gananciales. Informe profesional para presentar al juzgado."},
  {icon:<IcFile/>,title:"Herencias y sucesiones",desc:"Repartir el patrimonio cuando la empresa es el activo principal."},
  {icon:<IcScale/>,title:"Compraventa de participaciones",desc:"Necesitas un precio justo como base de negociación para comprar o vender."},
  {icon:<IcChart/>,title:"Planificación estratégica",desc:"Saber cuánto vale tu empresa hoy para decidir si crecer, buscar inversión o vender."},
  {icon:<IcTrend/>,title:"Rondas de inversión",desc:"Referencia de valoración sólida antes de sentarte a negociar con un inversor."},
];
const TESTIMONIALS=[
  {text:"En menos de una hora tenía un informe profesional que me ahorró miles de euros en asesores.",author:"Carlos M.",role:"CEO, empresa de logística · Madrid"},
  {text:"Me permitió presentar un informe serio al juzgado sin esperar semanas ni gastar una fortuna.",author:"Laura G.",role:"Fundadora, consultoría IT · Barcelona"},
  {text:"Como asesor fiscal, lo recomiendo a todos mis clientes PYME. Rápido, profesional y asequible.",author:"Miguel R.",role:"Asesor fiscal · Valencia"},
];
const FAQS=[
  {q:"¿Qué metodología utilizáis?",a:"Combinamos tres métodos: múltiplos de transacciones comparables en España (ajustados por sector y tamaño), un DCF simplificado, y un scoring cualitativo de 10 factores."},
  {q:"¿Es válida para presentar en un juzgado?",a:"Nuestros informes son indicativos y orientativos. Son una excelente base para negociaciones. Para valoraciones vinculantes, recomendamos complementar con un perito judicial."},
  {q:"¿Cuánto tiempo tarda?",a:"Ambos informes se generan automáticamente en minutos. El Informe Esencial incluye las tres metodologías de valoración. El Profesional añade benchmarking sectorial, análisis de sensibilidad, recomendaciones de creación de valor y nota del analista."},
  {q:"¿Mis datos están seguros?",a:"Totalmente. No compartimos tus datos financieros con terceros. Toda la información se procesa de forma confidencial."},
  {q:"¿Para qué tamaño de empresa funciona?",a:"Está diseñado para PYMEs españolas con facturación entre 1 y 100 millones de euros."},
  {q:"¿Puedo modificar los datos y recalcular?",a:"Sí. Puedes cambiar los datos y obtener una nueva estimación sin coste adicional durante 30 días."},
];

// ─── VALUATION ENGINE ────────────────────────────────────────
function getSizeAdj(r){const m=r/1e6;for(const s of SIZE_ADJUSTMENTS)if(m<=s.max)return s.adj;return 0.10}
function calcQS(a){let t=0,mx=0;QUAL_QUESTIONS.forEach(q=>{const v=a[q.id];if(v!==undefined)t+=(v+1)*q.weight;mx+=5*q.weight});return mx>0?Math.round((t/mx)*100):50}
function getSP(s){if(s<=30)return 0.25;if(s<=60)return 0.50;if(s<=80)return 0.75;return 0.90}
function getW(s){if(s<=30)return 0.20;if(s<=60)return 0.16;if(s<=80)return 0.13;return 0.10}
function pE(v){if(!v)return 0;return parseFloat(String(v).replace(/[.\s]/g,"").replace(",","."))||0}

function runValuation(data){
  const sector=SECTORS.find(s=>s.id===data.sector);if(!sector)return null;
  const rev=pE(data.revenue),resExp=pE(data.resExplotacion),amort=pE(data.amortizacion),ebitda=resExp+amort;
  const deuda=pE(data.deuda),caja=pE(data.caja),dfn=deuda-caja;
  const rE1=pE(data.resExp1),a1=pE(data.amort1)||amort,ebitda1=rE1?(rE1+a1):ebitda;
  const rE2=pE(data.resExp2),a2=pE(data.amort2)||amort,ebitda2=rE2?(rE2+a2):ebitda1;
  const qualScore=calcQS(data.qualAnswers||{}),percentile=getSP(qualScore),wacc=getW(qualScore);
  const baseMultiple=sector.evEbitda,sizeAdj=getSizeAdj(rev),adjMultiple=baseMultiple*(1+sizeAdj);
  const lowMult=adjMultiple*0.70,highMult=adjMultiple*1.30;
  const selectedMult=lowMult+(highMult-lowMult)*percentile;
  const evMultiples=ebitda>0?ebitda*selectedMult:rev*sector.evRevenue,eqMultiples=evMultiples-dfn;
  const growthHist=ebitda2>0&&ebitda>0?Math.pow(ebitda/ebitda2,1/2)-1:0.05;
  const cappedGrowth=Math.max(0.02,Math.min(growthHist,0.20));
  const fadeRate=(cappedGrowth-TERMINAL_GROWTH)/PROJECTION_YEARS;
  let sumPvFcf=0,lastFcf=0,projEbitda=ebitda,prevRev=rev;
  for(let y=1;y<=PROJECTION_YEARS;y++){const g=cappedGrowth-fadeRate*(y-1);projEbitda*=(1+g);const projRev=prevRev*(1+g);const fcf=projEbitda*(1-TAX_RATE)-projRev*sector.capexPct-(projRev-prevRev)*sector.wcPct;sumPvFcf+=fcf/Math.pow(1+wacc,y);lastFcf=fcf;prevRev=projRev}
  const pvTerminal=(lastFcf*(1+TERMINAL_GROWTH)/(wacc-TERMINAL_GROWTH))/Math.pow(1+wacc,PROJECTION_YEARS);
  const evDcf=sumPvFcf+pvTerminal,eqDcf=evDcf-dfn;
  const qualMid=(evMultiples+evDcf)/2,qualAdj=qualMid*((qualScore-50)/200);
  const evBlended=evMultiples*0.60+evDcf*0.20+(qualMid+qualAdj)*0.20,eqBlended=Math.max(0,evBlended-dfn);
  return{sector,rev,ebitda,dfn,qualScore,percentile,wacc,baseMultiple,sizeAdj,adjMultiple,selectedMult,evMultiples,eqMultiples:Math.max(0,eqMultiples),evDcf,eqDcf:Math.max(0,eqDcf),cappedGrowth,evBlended,eqBlended,eqLow:Math.max(0,eqBlended*0.80),eqHigh:eqBlended*1.20,sumPvFcf,pvTerminal}
}
const fmtM=(n)=>{if(n==null||isNaN(n))return"–";if(Math.abs(n)>=1e6)return(n/1e6).toFixed(1).replace(".",",")+("M€");if(Math.abs(n)>=1e3)return Math.round(n/1e3)+"k€";return Math.round(n)+"€"};

// ─── COMPONENTS ──────────────────────────────────────────────
const Ck=()=><svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
function Anim({children,className=""}){const ref=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:0.12});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect()},[]);return<div ref={ref} className={`anim ${v?"vis":""} ${className}`}>{children}</div>}
function FAQ({item}){const[open,setOpen]=useState(false);return<div className={`faq-i ${open?"open":""}`}><button className="faq-q" onClick={()=>setOpen(!open)}>{item.q}<span className="faq-tg">+</span></button>{open&&<div className="faq-a">{item.a}</div>}</div>}

function EuroInput({value,onChange,placeholder,helper}){
  const display=value?Number(value).toLocaleString("es-ES"):"";
  return<div style={{position:"relative"}}><input type="text" inputMode="numeric" placeholder={placeholder} value={display} onChange={e=>{onChange(e.target.value.replace(/[^0-9]/g,""))}} style={{paddingRight:32}}/><span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"var(--ink3)",fontWeight:600,pointerEvents:"none"}}>€</span></div>
}

// ─── LANDING ─────────────────────────────────────────────────
function LandingPage({onStart,scrollToRef}){
  const scrollTo=(id)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return<>
    <section className="hero">
      <div className="h-badge"><span className="dot"/>Más de 100 empresas ya han confiado en nosotros</div>
      <h1>Descubre cuánto vale <em>tu empresa</em> en 15 minutos</h1>
      <p className="h-sub">Obtén una valoración profesional de tu PYME por una fracción de lo que cuesta un asesor. Metodología contrastada, informe inmediato, 100% confidencial.</p>
      <div className="h-ctas"><button className="btn-h" onClick={onStart}>Obtener mi valoración →</button><button className="btn-gh" onClick={()=>scrollTo("como")}>Ver cómo funciona</button></div>
      <div className="h-proof"><div className="h-proof-i"><Ck/> Resultado en minutos</div><div className="h-proof-d"/><div className="h-proof-i"><Ck/> Desde 149€</div><div className="h-proof-d"/><div className="h-proof-i"><Ck/> 100% confidencial</div></div>
    </section>
    <div className="trust"><div className="trust-l">La confianza de los empresarios españoles, en cifras</div><div className="trust-s"><div><div className="trust-n">+100</div><div className="trust-t">Empresas valoradas</div></div><div><div className="trust-n">15</div><div className="trust-t">Sectores cubiertos</div></div><div><div className="trust-n">4,8/5</div><div className="trust-t">Valoración media</div></div><div><div className="trust-n">&lt;24h</div><div className="trust-t">Entrega del informe</div></div></div></div>
    <section className="sec" id="situaciones"><Anim><div className="sec-l">¿Para qué necesitas una valoración?</div><h2 className="sec-t">Situaciones donde te podemos ayudar</h2><p className="sec-sub">Cada empresa tiene sus circunstancias. Estos son los motivos más frecuentes.</p></Anim><Anim><div className="cgrid">{USE_CASES.map((c,i)=><div className="ccard" key={i}><div className="ccard-icon">{c.icon}</div><div className="ccard-t">{c.title}</div><div className="ccard-d">{c.desc}</div></div>)}</div></Anim></section>
    <section className="sec-fw" id="como"><div className="sec-fw-inner sec-c"><Anim><div className="sec-l">Proceso</div><h2 className="sec-t">Cómo funciona</h2><p className="sec-sub">Tres pasos simples. Sin reuniones, sin esperas.</p></Anim><Anim><div className="steps"><div className="step"><div className="step-n">1</div><h3>Introduce tus datos</h3><p>Completa un formulario guiado con la información básica de tu empresa. Te llevará unos 15 minutos.</p></div><div className="step"><div className="step-n">2</div><h3>Calculamos tu valoración</h3><p>Nuestro motor aplica tres metodologías: múltiplos de mercado, DCF y scoring cualitativo.</p></div><div className="step"><div className="step-n">3</div><h3>Recibe tu informe</h3><p>Descarga un informe PDF profesional con el rango de valoración y desglose completo.</p></div></div></Anim></div></section>
    <section className="sec sec-c" id="precios" ref={scrollToRef}><Anim><div className="sec-l">Precios</div><h2 className="sec-t">Elige tu plan de valoración</h2><p className="sec-sub">Sin sorpresas. Pago único, sin suscripciones.</p></Anim><Anim><div className="pgrid">
      <div className="pcard"><div className="p-name">Estimación rápida</div><div className="p-amt">Gratis</div><div className="p-desc">Un rango orientativo para hacerte una primera idea.</div><div className="p-feats"><div className="p-feat"><Ck/> Rango de valoración en pantalla</div><div className="p-feat"><Ck/> Basado en múltiplos sectoriales</div><div className="p-feat"><Ck/> Resultado inmediato</div></div><button className="p-btn p-btn-o" onClick={onStart}>Empezar gratis</button></div>
      <div className="pcard feat"><div className="p-badge">Más popular</div><div className="p-name">Informe Esencial</div><div className="p-amt">149€ <span>+ IVA</span></div><div className="p-desc">Informe completo con tres metodologías. Ideal para negociaciones.</div><div className="p-feats"><div className="p-feat"><Ck/> Todo lo del plan gratuito</div><div className="p-feat"><Ck/> Informe PDF profesional</div><div className="p-feat"><Ck/> Múltiplos + DCF + Quality Score</div><div className="p-feat"><Ck/> Desglose por metodología</div><div className="p-feat"><Ck/> 30 días para recalcular</div></div><button className="p-btn p-btn-p" onClick={onStart}>Obtener informe esencial</button></div>
      <div className="pcard"><div className="p-name">Informe Profesional</div><div className="p-amt">299€ <span>+ IVA</span></div><div className="p-desc">Análisis en profundidad con benchmarking, sensibilidad y recomendaciones de valor.</div><div className="p-feats"><div className="p-feat"><Ck/> Todo lo del plan Esencial</div><div className="p-feat"><Ck/> Benchmarking sectorial</div><div className="p-feat"><Ck/> Análisis de sensibilidad</div><div className="p-feat"><Ck/> Palancas de creación de valor</div><div className="p-feat"><Ck/> Nota del Analista</div></div><button className="p-btn p-btn-o" onClick={onStart}>Obtener informe profesional</button></div>
    </div></Anim></section>
    <section className="sec-fw"><div className="sec-fw-inner"><Anim><div className="sec-l" style={{textAlign:"center"}}>Testimonios</div><h2 className="sec-t" style={{textAlign:"center"}}>Lo que dicen nuestros clientes</h2><p className="sec-sub" style={{textAlign:"center",margin:"0 auto 44px"}}>Empresarios y asesores que ya han utilizado nuestro servicio.</p></Anim><Anim><div className="tgrid">{TESTIMONIALS.map((t,i)=><div className="tcard" key={i}><div className="t-stars">★★★★★</div><div className="t-text">&ldquo;{t.text}&rdquo;</div><div className="t-auth">{t.author}</div><div className="t-role">{t.role}</div></div>)}</div></Anim></div></section>
    <section className="sec sec-c" id="faq"><Anim><div className="sec-l">Preguntas frecuentes</div><h2 className="sec-t">¿Tienes dudas?</h2><p className="sec-sub">Las respuestas a las preguntas que más nos hacen.</p></Anim><Anim><div className="faq-list">{FAQS.map((f,i)=><FAQ key={i} item={f}/>)}</div></Anim></section>
    <Anim><div className="cta-ban"><h2>¿Listo para saber cuánto vale tu empresa?</h2><p>Empieza gratis y obtén una estimación en menos de 15 minutos.</p><button className="cta-btn2" onClick={onStart}>Obtener mi valoración →</button></div></Anim>
  </>
}

// ─── APP STEPS ───────────────────────────────────────────────
const APP_STEPS=[{id:"company",label:"Empresa"},{id:"financials",label:"Financieros"},{id:"qualitative",label:"Cualitativo"},{id:"email",label:"Contacto"},{id:"results",label:"Resultado"}];

function StepCompany({data,onChange}){return<div className="fade-in"><h2 className="app-title">Tu empresa</h2><p className="app-sub">Información básica sobre la compañía para contextualizar la valoración.</p><div className="fgrid"><div className="fld fw"><label>Nombre de la empresa</label><input type="text" placeholder="Ej: Tech Solutions SL" value={data.name||""} onChange={e=>onChange("name",e.target.value)}/></div><div className="fld fw"><label>Página web <span className="u">(opcional)</span></label><input type="url" placeholder="Ej: www.techsolutions.es" value={data.website||""} onChange={e=>onChange("website",e.target.value)}/></div><div className="fld fw"><label>Sector</label><select value={data.sector||""} onChange={e=>onChange("sector",e.target.value)}><option value="">Selecciona un sector</option>{SECTORS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div><div className="fld"><label>Año de fundación</label><input type="number" placeholder="Ej: 2010" value={data.founded||""} onChange={e=>onChange("founded",e.target.value)}/></div><div className="fld"><label>Número de empleados</label><input type="number" placeholder="Ej: 45" value={data.employees||""} onChange={e=>onChange("employees",e.target.value)}/></div><div className="fld fw"><label>Provincia</label><input type="text" placeholder="Ej: Barcelona" value={data.province||""} onChange={e=>onChange("province",e.target.value)}/></div><div className="fld fw"><label>¿Cómo nos has conocido? <span className="u">(opcional)</span></label><select value={data.referralSource||""} onChange={e=>onChange("referralSource",e.target.value)}><option value="">Selecciona una opción</option><option value="google">Búsqueda en Google</option><option value="redes_sociales">Redes sociales</option><option value="recomendacion">Recomendación de un conocido</option><option value="gestoria">Gestoría / Asesoría fiscal</option><option value="abogados">Despacho de abogados</option><option value="consultoria">Consultoría / Asesoría estratégica</option><option value="banca">Entidad bancaria</option><option value="evento">Evento o conferencia</option><option value="prensa">Prensa o medios</option><option value="otro">Otro</option></select></div><div className="fld fw"><label>Código de referencia <span className="u">(opcional)</span></label><input type="text" placeholder="Ej: GES-001" value={data.referralCode||""} onChange={e=>onChange("referralCode",e.target.value)}/></div></div></div>}

function StepFinancials({data,onChange}){return<div className="fade-in"><h2 className="app-title">Datos financieros</h2><p className="app-sub">Introduce las cifras clave del último ejercicio cerrado. Todos los importes en euros.</p><div className="fgrid">
  <div className="fld-sep">Cuenta de resultados</div>
  <div className="fld"><label>Facturación / Ventas</label><EuroInput value={data.revenue} onChange={v=>onChange("revenue",v)} placeholder="Ej: 3500000"/><span className="hlp">Importe neto de la cifra de negocios</span></div>
  <div className="fld"><label>Resultado de explotación</label><EuroInput value={data.resExplotacion} onChange={v=>onChange("resExplotacion",v)} placeholder="Ej: 420000"/><span className="hlp">Beneficio operativo (BAII)</span></div>
  <div className="fld"><label>Amortización del inmovilizado</label><EuroInput value={data.amortizacion} onChange={v=>onChange("amortizacion",v)} placeholder="Ej: 85000"/><span className="hlp">Dotación anual a la amortización</span></div>
  <div className="fld"><label>Inversión anual</label><EuroInput value={data.inversion} onChange={v=>onChange("inversion",v)} placeholder="Opcional"/><span className="hlp">Compra de activos fijos. Dejar vacío para estimación sectorial</span></div>
  <div className="fld-sep">Balance: posición financiera</div>
  <div className="fld"><label>Deuda financiera</label><EuroInput value={data.deuda} onChange={v=>onChange("deuda",v)} placeholder="Ej: 800000"/><span className="hlp">Préstamos bancarios, deuda con socios, leasing financiero</span></div>
  <div className="fld"><label>Caja y equivalentes</label><EuroInput value={data.caja} onChange={v=>onChange("caja",v)} placeholder="Ej: 350000"/><span className="hlp">Efectivo, cuentas corrientes, inversiones a corto plazo</span></div>
  <div className="fld-sep">Ejercicios anteriores (para calcular tendencia)</div>
  <div className="fld"><label>Resultado de explotación hace 1 año</label><EuroInput value={data.resExp1} onChange={v=>onChange("resExp1",v)} placeholder="Ej: 380000"/></div>
  <div className="fld"><label>Resultado de explotación hace 2 años</label><EuroInput value={data.resExp2} onChange={v=>onChange("resExp2",v)} placeholder="Ej: 340000"/></div>
</div></div>}

function StepQualitative({data,onChange}){const answers=data.qualAnswers||{};const answered=Object.keys(answers).length;return<div className="fade-in"><h2 className="app-title">Análisis cualitativo</h2><p className="app-sub">Responde estas preguntas para ajustar la valoración. <strong>{answered}/10 respondidas</strong></p>{QUAL_QUESTIONS.map(q=>{const wl=q.weight===3?"hi":q.weight===2?"md":"lo";const wt=q.weight===3?"Impacto alto":q.weight===2?"Impacto medio":"Impacto bajo";return<div key={q.id} className={`qcard ${answers[q.id]!==undefined?"ans":""}`}><div className="q-hdr"><span className={`q-bdg ${wl}`}>{wt}</span><span className="q-lbl">{q.label}</span></div><p className="q-txt">{q.question}</p><div className="q-opts">{q.options.map((opt,i)=><button key={i} className={`q-opt ${answers[q.id]===i?"sel":""}`} onClick={()=>onChange("qualAnswers",{...answers,[q.id]:i})}>{opt}</button>)}</div></div>})}</div>}

function StepEmail({data,onChange}){
  return<div className="fade-in">
    <div style={{textAlign:"center",padding:"20px 0 10px"}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:"var(--blueS)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg></div>
      <h2 className="app-title">Un último paso antes de ver tu valoración</h2>
      <p className="app-sub" style={{maxWidth:480,margin:"0 auto"}}>Introduce tu email para recibir los resultados y poder acceder a tu informe en cualquier momento.</p>
    </div>
    <div style={{maxWidth:420,margin:"0 auto"}}>
      <div className="fgrid">
        <div className="fld fw"><label>Nombre completo</label><input type="text" placeholder="Ej: Juan García López" value={data.contactName||""} onChange={e=>onChange("contactName",e.target.value)}/></div>
        <div className="fld fw"><label>Email profesional</label><input type="email" placeholder="Ej: juan@miempresa.es" value={data.contactEmail||""} onChange={e=>onChange("contactEmail",e.target.value)}/></div>
        <div className="fld fw"><label>Teléfono <span className="u">(opcional)</span></label><input type="tel" placeholder="Ej: 612 345 678" value={data.contactPhone||""} onChange={e=>onChange("contactPhone",e.target.value)}/></div>
      </div>
      <p style={{fontSize:12,color:"var(--ink3)",marginTop:16,lineHeight:1.5,textAlign:"center"}}>Tus datos son confidenciales. No compartimos tu información con terceros. Al continuar, aceptas nuestra <a href="#" style={{color:"var(--blue)"}}>política de privacidad</a>.</p>
    </div>
  </div>
}


function CompanyAnalysis({data,onAnalysisReady}){
  const[analysis,setAnalysis]=useState(null);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState(null);
  const fetched=useRef(false);
  useEffect(()=>{
    if(fetched.current)return;fetched.current=true;
    const sector=SECTORS.find(s=>s.id===data.sector);
    const prompt=`Eres un analista de valoración de empresas. Genera un análisis cualitativo breve y profesional de la siguiente empresa. Responde SOLO con un JSON válido, sin backticks ni markdown.
Datos: Nombre: ${data.name||"No proporcionado"}, Web: ${data.website||"No proporcionada"}, Sector: ${sector?.label||"No especificado"}, Fundación: ${data.founded||"No proporcionado"}, Empleados: ${data.employees||"No proporcionado"}, Provincia: ${data.province||"No proporcionada"}, Facturación: ${pE(data.revenue).toLocaleString("es-ES")}€
Genera JSON con: {"descripcion":"2-4 frases","historia":"2-4 frases","modelo":"2-4 frases","oferta":"2-4 frases","geografia":"2-4 frases","metricas":"2-4 frases"} Todo en español. Si no conoces la empresa, genera análisis plausible basado en sector y tamaño.`;
    const apiKey=process.env.NEXT_PUBLIC_ANTHROPIC_KEY;
    if(!apiKey){setError("Análisis no disponible en este momento.");setLoading(false);return}
    fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:1000,messages:[{role:"user",content:prompt}]})})
    .then(r=>r.json()).then(d=>{
      const txt=d.content?.map(i=>i.text||"").join("")||"";
      try{const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());setAnalysis(parsed);if(onAnalysisReady)onAnalysisReady(parsed)}catch(e){setError("No se pudo generar el análisis.")}
      setLoading(false);
    }).catch(()=>{setError("Error de conexión.");setLoading(false)});
  },[]);
  if(loading)return<div className="r-sec"><h3>Análisis de la compañía</h3><div style={{padding:"24px 0",textAlign:"center"}}><div style={{fontSize:32,marginBottom:12}}>🔍</div><p style={{fontSize:15,color:"var(--ink2)",margin:0,fontWeight:500}}>Analizando {data.name||"la empresa"}...</p><p style={{fontSize:13,color:"var(--ink3)",margin:"6px 0 0"}}>Estamos investigando el negocio, su sector y sus características para generar un análisis personalizado.</p></div></div>;
  if(error||!analysis)return<div className="r-sec"><h3>Análisis de la compañía</h3><p style={{fontSize:14,color:"var(--ink3)"}}>{error||"Análisis no disponible."}</p></div>;
  const sections=[{title:"Descripción del negocio",text:analysis.descripcion},{title:"Historia y trayectoria",text:analysis.historia},{title:"Modelo de negocio",text:analysis.modelo},{title:"Oferta de productos/servicios",text:analysis.oferta},{title:"Presencia geográfica",text:analysis.geografia},{title:"Métricas operativas clave",text:analysis.metricas}];
  return<div className="r-sec"><h3>Análisis de la compañía</h3>{sections.map((s,i)=>s.text?<div key={i} style={{marginBottom:i<sections.length-1?16:0}}><p style={{fontSize:13,fontWeight:600,color:"var(--ink)",marginBottom:3}}>{s.title}</p><p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,margin:0}}>{s.text}</p></div>:null)}</div>
}

function getQualExplanation(qId,idx){
  const e={
    recurrence:["La empresa tiene muy poca recurrencia, dependiendo de la captación constante de nuevos clientes.","Cierta base de ingresos recurrentes, aunque la mayor parte es variable.","Base sólida de ingresos recurrentes que aporta estabilidad, con margen de mejora.","La mayoría de ingresos son recurrentes, proporcionando gran visibilidad.","Prácticamente toda la facturación es recurrente, maximizando previsibilidad y valor."],
    concentration:["Concentración muy elevada, riesgo significativo si se pierde un cliente principal.","Dependencia alta de principales clientes. Diversificar mejoraría el perfil de riesgo.","Concentración moderada con equilibrio razonable entre principales y resto de cartera.","Cartera bien diversificada, reduciendo significativamente el riesgo de dependencia.","Excelente diversificación. Ningún cliente individual representa un riesgo material."],
    founder:["Empresa completamente dependiente del fundador. Su ausencia paralizaría las operaciones.","Dependencia muy alta del fundador. Las operaciones sufrirían un impacto severo.","El fundador es importante pero existe estructura para mantener la operativa con impacto moderado.","Equipo capaz de gestionar operaciones con impacto menor en ausencia del fundador.","Empresa opera independientemente del fundador, con procesos y equipo consolidados."],
    margins:["Márgenes en caída significativa, indicando presión competitiva o problemas de eficiencia.","Ligera contracción de márgenes que conviene monitorizar.","Márgenes estables, reflejando gestión operativa consistente.","Mejora gradual de márgenes indica buena evolución y posibles economías de escala.","Márgenes mejorados notablemente, sugiriendo fuerte poder de fijación de precios."],
    moat:["Sin ventajas competitivas diferenciadas, vulnerable a competencia por precio.","Ventajas menores insuficientes para crear una barrera de entrada significativa.","Alguna ventaja competitiva que proporciona cierta protección frente a competencia.","Ventajas claras y difíciles de replicar que refuerzan la posición de mercado.","Ventajas muy fuertes (marca, tecnología, patentes) que otorgan posición privilegiada."],
    team:["Gestión exclusiva del fundador, sin equipo directivo estructurado.","Una persona clave además del fundador, pero estructura directiva insuficiente.","Equipo directivo en construcción, con funciones clave aún sin cubrir.","Equipo directivo completo y funcional, operativa profesionalizada.","Equipo directivo senior de primer nivel, maximizando confianza de inversores."],
    scalability:["Modelo requiere crecimiento proporcional de costes, limitando la escalabilidad.","Escalar sería muy complicado sin inversiones significativas en estructura.","Podría escalar con cierta inversión, manteniendo parte de costes fijos estables.","Buena escalabilidad, permite crecer sin aumentar proporcionalmente los costes.","Totalmente escalable con costes marginales muy bajos. Muy valorado en valoración."],
    geo:["Opera exclusivamente en mercado nacional, dependiente de la economía local.","Presencia internacional incipiente que podría desarrollarse.","Diversificación internacional moderada, cierta protección frente a riesgos locales.","Buena diversificación geográfica, reduce dependencia de un único mercado.","Excelente presencia internacional que diversifica riesgos significativamente."],
    digital:["Procesos muy poco digitalizados, puede limitar eficiencia y competitividad.","Digitalización baja. Invertir en tecnología mejoraría significativamente la operativa.","Nivel medio de digitalización. Procesos principales funcionan con margen de mejora.","Buen nivel de digitalización, opera con eficiencia.","Totalmente digitalizada con procesos optimizados, reforzando competitividad."],
    regulation:["Sector sin barreras de entrada significativas, facilita aparición de competidores.","Barreras de entrada muy bajas, poca protección frente a nuevos entrantes.","Barreras moderadas que dificultan parcialmente la entrada de nuevos competidores.","Barreras altas protegen la posición competitiva de la empresa.","Barreras muy elevadas, protección significativa y sostenida a operadores existentes."]
  };
  return e[qId]?.[idx]||"";
}

function ProfessionalAnalysis({data,r,qualDetails,onReady}){
  const[analysis,setAnalysis]=useState(null);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState(null);
  const fetched=useRef(false);
  useEffect(()=>{
    if(fetched.current)return;fetched.current=true;
    const sector=SECTORS.find(s=>s.id===data.sector);
    const weakFactors=qualDetails.filter(d=>d.score<50).map(d=>d.label).join(", ")||"ninguno identificado";
    const strongFactors=qualDetails.filter(d=>d.score>=70).map(d=>d.label).join(", ")||"ninguno destacado";
    const prompt=`Eres un analista senior de M&A especializado en PYMEs españolas. Genera un análisis profesional para un informe de valoración. Responde SOLO con JSON válido, sin backticks.
Empresa: ${data.name||"No proporcionada"}, Sector: ${sector?.label||"No especificado"}, Facturación: ${(r.rev/1e6).toFixed(1)}M€, EBITDA: ${(r.ebitda/1e6).toFixed(2)}M€, Quality Score: ${r.qualScore}/100.
Puntos débiles: ${weakFactors}. Puntos fuertes: ${strongFactors}.
Genera JSON con:
{
  "benchmarking": {
    "intro": "2-3 frases contextualizando la empresa en su sector",
    "margen_ebitda_empresa": número_porcentaje_sin_signo,
    "margen_ebitda_sector": número_porcentaje_sin_signo,
    "crecimiento_empresa": número_porcentaje_sin_signo,
    "crecimiento_sector": número_porcentaje_sin_signo,
    "multiplo_empresa": número,
    "multiplo_sector": número,
    "conclusion": "2-3 frases sobre el posicionamiento relativo"
  },
  "recomendaciones": [
    {"titulo": "string corto", "descripcion": "1-2 frases accionables", "impacto": "alto|medio|bajo", "plazo": "corto|medio|largo"},
    {"titulo": "...", "descripcion": "...", "impacto": "...", "plazo": "..."},
    {"titulo": "...", "descripcion": "...", "impacto": "...", "plazo": "..."}
  ],
  "nota_analista": "3-4 frases valoración global. Tono profesional."
}
Todo en español. Sé específico y accionable.`;
    const apiKey=process.env.NEXT_PUBLIC_ANTHROPIC_KEY;
    if(!apiKey){setError("Análisis no disponible.");setLoading(false);return}
    fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:2000,messages:[{role:"user",content:prompt}]})})
    .then(res=>res.json()).then(d=>{
      if(d.type==="error"){setError("Error API: "+d.error?.message);setLoading(false);return}
      const txt=d.content?.map(i=>i.text||"").join("")||"";
      try{
        const clean=txt.replace(/```json|```/g,"").trim();
        const parsed=JSON.parse(clean);
        setAnalysis(parsed);if(onReady)onReady(parsed);
      }catch(e){
        console.error("Parse error:",e.message,"Raw:",txt.slice(0,300));
        setError("Error procesando respuesta: "+e.message);
      }
      setLoading(false);
    }).catch((e)=>{setError("Error de conexión: "+e.message);setLoading(false)});
  },[]);
  if(loading)return<div className="r-sec" style={{textAlign:"center",padding:"32px 0"}}><div style={{fontSize:36,marginBottom:12}}>📊</div><p style={{fontSize:15,fontWeight:500,color:"var(--ink2)",margin:0}}>Generando análisis profesional...</p><p style={{fontSize:13,color:"var(--ink3)",margin:"6px 0 0"}}>Analizando benchmarking sectorial y generando recomendaciones personalizadas.</p></div>;
  if(error||!analysis)return<div className="r-sec"><p style={{color:"var(--ink3)",fontSize:14}}>{error||"Análisis no disponible."}</p></div>;
  const impactoColor={alto:"var(--green)",medio:"var(--blue)",bajo:"var(--amber)"};
  const plazoLabel={corto:"Corto plazo (0-6m)",medio:"Medio plazo (6-18m)",largo:"Largo plazo (18m+)"};
  const b=analysis.benchmarking;
  const benchRows=b?[
    {label:"Margen EBITDA",empresa:b.margen_ebitda_empresa?.toFixed(1)+"%",sector:b.margen_ebitda_sector?.toFixed(1)+"%",mejor:b.margen_ebitda_empresa>=b.margen_ebitda_sector},
    {label:"Crecimiento",empresa:b.crecimiento_empresa?.toFixed(1)+"%",sector:b.crecimiento_sector?.toFixed(1)+"%",mejor:b.crecimiento_empresa>=b.crecimiento_sector},
    {label:"Múltiplo EV/EBITDA",empresa:b.multiplo_empresa?.toFixed(1)+"x",sector:b.multiplo_sector?.toFixed(1)+"x",mejor:b.multiplo_empresa>=b.multiplo_sector},
  ]:[];
  return<>
    {/* Benchmarking */}
    <div className="r-sec">
      <h3>Benchmarking sectorial</h3>
      {b&&<><p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,marginBottom:16}}>{b.intro}</p>
      <div style={{overflowX:"auto"}}><table className="m-tbl" style={{minWidth:320}}><thead><tr><th>Indicador</th><th style={{whiteSpace:"nowrap"}}>Tu empresa</th><th style={{whiteSpace:"nowrap"}}>Sector</th><th style={{whiteSpace:"nowrap"}}>Posición</th></tr></thead>
      <tbody>{benchRows.map((row,i)=><tr key={i}><td><strong>{row.label}</strong></td><td style={{fontWeight:600,color:row.mejor?"var(--green)":"var(--amber)",whiteSpace:"nowrap"}}>{row.empresa}</td><td style={{whiteSpace:"nowrap"}}>{row.sector}</td><td style={{whiteSpace:"nowrap"}}>{row.mejor?<span style={{color:"var(--green)",fontWeight:600}}>▲ Encima</span>:<span style={{color:"var(--amber)",fontWeight:600}}>▼ Debajo</span>}</td></tr>)}</tbody>
      </table></div>
      <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,marginTop:16}}>{b.conclusion}</p></>}
    </div>
    {/* Sensibilidad */}
    <SensibilityAnalysis r={r}/>
    {/* Recomendaciones */}
    {analysis.recomendaciones&&<div className="r-sec">
      <h3>Recomendaciones de creación de valor</h3>
      <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,marginBottom:20}}>Basadas en los puntos de mejora identificados en el análisis cualitativo, estas son las palancas con mayor potencial para aumentar el valor de tu empresa.</p>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {analysis.recomendaciones.map((rec,i)=><div key={i} style={{border:"1.5px solid var(--brd)",borderRadius:"var(--rs)",padding:"16px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
            <span style={{background:"var(--navy)",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{i+1}</span>
            <strong style={{fontSize:15,color:"var(--ink)"}}>{rec.titulo}</strong>
            <span style={{marginLeft:"auto",display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={{background:impactoColor[rec.impacto]||"var(--blue)",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600}}>Impacto {rec.impacto}</span>
              <span style={{background:"var(--bg)",border:"1.5px solid var(--brd)",borderRadius:20,padding:"2px 10px",fontSize:11,color:"var(--ink2)"}}>{plazoLabel[rec.plazo]||rec.plazo}</span>
            </span>
          </div>
          <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,margin:0}}>{rec.descripcion}</p>
        </div>)}
      </div>
    </div>}
    {/* Nota analista */}
    {analysis.nota_analista&&<div className="r-sec" style={{background:"var(--bg)",border:"1.5px solid var(--brd)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div><p style={{fontWeight:700,color:"var(--ink)",margin:0,fontSize:14}}>Nota del analista</p><p style={{fontSize:12,color:"var(--ink3)",margin:0}}>SP Financial Advisory LLC · {new Date().toLocaleDateString("es-ES",{month:"long",year:"numeric"})}</p></div>
      </div>
      <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.65,margin:0,fontStyle:"italic"}}>"{analysis.nota_analista}"</p>
    </div>}
  </>;
}

function SensibilityAnalysis({r}){
  const ebitdaVars=[-0.20,-0.10,0,0.10,0.20];
  const multVars=[-2,-1,0,1,2];
  const baseEbitda=r.ebitda,baseMult=r.selectedMult,baseDfn=r.dfn;
  const calcEq=(ebitdaDelta,multDelta)=>{
    const ev=(baseEbitda*(1+ebitdaDelta))*(baseMult+multDelta);
    return Math.max(0,ev-baseDfn);
  };
  return<div className="r-sec">
    <h3>Análisis de sensibilidad</h3>
    <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,marginBottom:16}}>¿Cómo cambia el valor de las participaciones si varía el EBITDA o el múltiplo aplicado? Esta tabla muestra el rango de valores posibles en diferentes escenarios.</p>
    <div style={{overflowX:"auto"}}>
      <table className="m-tbl" style={{minWidth:500}}>
        <thead>
          <tr>
            <th style={{background:"var(--navy)",color:"#fff"}}>EBITDA \ Múltiplo</th>
            {multVars.map(m=><th key={m} style={{background:"var(--navy)",color:"#fff",textAlign:"center"}}>{m===0?`${baseMult.toFixed(1)}x (base)`:`${(baseMult+m).toFixed(1)}x`}</th>)}
          </tr>
        </thead>
        <tbody>
          {ebitdaVars.map((e,ei)=>{
            const rowEbitda=baseEbitda*(1+e);
            return<tr key={ei}>{[<td key="lbl" style={{fontWeight:600,whiteSpace:"nowrap"}}>{e===0?`${(rowEbitda/1e6).toFixed(2)}M€ (base)`:e>0?`+${(e*100).toFixed(0)}% (${(rowEbitda/1e6).toFixed(2)}M€)`:`${(e*100).toFixed(0)}% (${(rowEbitda/1e6).toFixed(2)}M€)`}</td>,...multVars.map(m=>{
              const val=calcEq(e,m);
              const isBase=e===0&&m===0;
              const pct=r.eqBlended>0?(val/r.eqBlended-1):0;
              const bg=isBase?"var(--navy)":pct>0.15?"#d1fae5":pct>0?"#e8eefb":pct>-0.15?"#fff7ed":"#fee2e2";
              const color=isBase?"#fff":pct>0.15?"var(--green)":pct>0?"var(--blue)":pct>-0.15?"var(--amber)":"var(--red)";
              return<td key={m} style={{textAlign:"center",background:bg,color,fontWeight:isBase?700:500,fontSize:13}}>{(val/1e6).toFixed(1)}M€</td>;
            })]}</tr>;
          })}
        </tbody>
      </table>
    </div>
    <p style={{fontSize:12,color:"var(--ink3)",marginTop:10}}>Valores en millones de euros. La celda azul oscuro representa el escenario base.</p>
  </div>;
}



// ─── STRIPE CHECKOUT ─────────────────────────────────────
async function initiateCheckout(plan, data) {
  try {
    saveToGoogleSheets(data, plan);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        email: data.contactEmail || "",
        name:  data.contactName  || "",
        empresa: data.name || "",
      }),
    });
    const json = await res.json();
    if (json.url) {
      sessionStorage.setItem("vte_data", JSON.stringify(data));
      window.location.href = json.url;
    } else {
      alert("Error iniciando el pago: " + (json.error || "inténtalo de nuevo"));
    }
  } catch (e) {
    alert("Error de conexión. Inténtalo de nuevo.");
  }
}

// ─── GOOGLE SHEETS ───────────────────────────────────────
async function saveToGoogleSheets(data, plan) {
  let SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL;
  if (!SHEETS_URL) return;
  if (!SHEETS_URL.startsWith("http")) SHEETS_URL = "https://" + SHEETS_URL;
  try {
    const r = runValuation(data);
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        fecha: new Date().toISOString(),
        nombre: data.contactName || "",
        email: data.contactEmail || "",
        telefono: data.contactPhone || "",
        empresa: data.name || "",
        sector: data.sector || "",
        provincia: data.province || "",
        empleados: data.employees || "",
        fundacion: data.founded || "",
        web: data.website || "",
        facturacion: data.revenue || "",
        ebitda: r ? Math.round(r.ebitda) : "",
        dfn: r ? Math.round(r.dfn) : "",
        quality_score: r ? r.qualScore : "",
        equity_value: r ? Math.round(r.eqBlended) : "",
        plan: plan || "free",
        como_conocido: data.referralSource || "",
        codigo_referencia: data.referralCode || "",
      }),
    });
  } catch (e) {
    console.warn("Sheets save failed:", e.message);
  }
}

function StepResults({data,onBack,onHome,returnPlan}){
  const[plan,setPlan]=useState("free");const planRef=useRef("free");
  useEffect(()=>{if(returnPlan){const p=returnPlan==="professional_upgrade"?"professional":returnPlan;setPlan(p);planRef.current=p;}},[returnPlan]);
  const[pdfLoading,setPdfLoading]=useState(false);
  const[companyAnalysis,setCompanyAnalysis]=useState(null);
  const[professionalAnalysis,setProfessionalAnalysis]=useState(null);
  const professionalAnalysisRef=useRef(null);
  const companyAnalysisRef=useRef(null);
  const pdfRef=useRef(null);
  const r=runValuation(data);if(!r)return<p>Error en los datos. Vuelve atr\u00e1s para corregir.</p>;
  const scoreColor=r.qualScore>70?"var(--green)":r.qualScore>40?"var(--blue)":"var(--amber)";
  const qualDetails=QUAL_QUESTIONS.map(q=>{const val=(data.qualAnswers||{})[q.id];const score=val!==undefined?((val+1)/5)*100:0;return{id:q.id,label:q.label,score:Math.round(score),color:score>=70?"var(--green)":score>=40?"var(--blue)":"var(--amber)",optionIndex:val}});
  const fmtPct=(n)=>(n*100).toFixed(1).replace(".",",")+"%";

  const generatePDF=()=>{
    setPdfLoading(true);
    const run=()=>{try{buildPDFDoc()}catch(e){console.error("PDF error:",e);alert("Error generando PDF: "+e.message);setPdfLoading(false)}};
    if(window.jspdf){setTimeout(run,50);return}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload=()=>setTimeout(run,50);
    s.onerror=()=>{alert("Error cargando jsPDF");setPdfLoading(false)};
    document.head.appendChild(s);
  };
  function buildPDFDoc(){const professionalAnalysis=professionalAnalysisRef.current;const companyAnalysis=companyAnalysisRef.current;
    const{jsPDF}=window.jspdf;const doc=new jsPDF({unit:"mm",format:"a4"});
    const W=210,H=297,M=18,CW=W-2*M;let y=0;
    const NY="#0f1a2e",BL="#1a56db",GY="#6b7a96",IK="#0b1222",I2="#374259",GR="#0d7c3d",AM="#c2790e",RD="#b91c1c";
    const bh=18,gap=8,bbW=48,sx=(W-3*bbW-2*gap)/2;
    function ck(n){if(y+n>H-20){doc.addPage();y=20}return y}
    function sT(t){y=ck(14);doc.setFontSize(13);doc.setTextColor(IK);doc.setFont("helvetica","bold");doc.text(t,M,y);y+=8;doc.setFont("helvetica","normal")}
    function bT(t){doc.setFontSize(9.5);doc.setTextColor(I2);doc.setFont("helvetica","normal");const l=doc.splitTextToSize(t,CW);y=ck(l.length*4.5);doc.text(l,M,y);y+=l.length*4.5+2}
    function box3(x,yy,bg,lbl,val,lc,vc){doc.setFillColor(bg);doc.roundedRect(x,yy,bbW,bh,2,2,"F");doc.setFontSize(7);doc.setTextColor(lc);doc.text(lbl,x+bbW/2,yy+6,{align:"center"});doc.setFontSize(12);doc.setTextColor(vc);doc.setFont("helvetica","bold");doc.text(val,x+bbW/2,yy+14,{align:"center"});doc.setFont("helvetica","normal")}
    function sign(x,yy,t){doc.setFontSize(16);doc.setTextColor(GY);doc.setFont("helvetica","normal");doc.text(t,x,yy+12,{align:"center"})}
    function donut(cx,cy,radius,pct,color){const bg="#e4e8f1";const startAngle=-Math.PI/2;const endAngle=startAngle+2*Math.PI*(pct/100);doc.setDrawColor(bg);doc.setLineWidth(2.5);for(let a=0;a<2*Math.PI;a+=0.05){const x1=cx+radius*Math.cos(a),y1=cy+radius*Math.sin(a),x2=cx+radius*Math.cos(a+0.05),y2=cy+radius*Math.sin(a+0.05);doc.line(x1,y1,x2,y2)}doc.setDrawColor(color);doc.setLineWidth(2.5);if(pct>0){for(let a=startAngle;a<endAngle;a+=0.05){const ae=Math.min(a+0.05,endAngle);const x1=cx+radius*Math.cos(a),y1=cy+radius*Math.sin(a),x2=cx+radius*Math.cos(ae),y2=cy+radius*Math.sin(ae);doc.line(x1,y1,x2,y2)}}doc.setFontSize(10);doc.setTextColor(IK);doc.setFont("helvetica","bold");doc.text(pct+"%",cx,cy+1,{align:"center"});doc.setFont("helvetica","normal")}

    const isPro=planRef.current==="professional";

    // ═══ COVER ═══
    doc.setFillColor(NY);doc.rect(0,0,W,H,"F");
    doc.setFontSize(16);doc.setTextColor("#ffffff");doc.setFont("helvetica","bold");doc.text("valoratuempresa.es",M,50);
    doc.setDrawColor(BL);doc.setLineWidth(0.8);doc.line(M,55,W-M,55);
    doc.setFontSize(28);doc.text("Informe de Valoraci\u00f3n",M,75);
    doc.setFontSize(22);doc.text(isPro?"Profesional":"Esencial",M,87);

    doc.setFontSize(26);doc.setTextColor("#ffffff");doc.setFont("helvetica","bold");doc.text(data.name||"Empresa",M,115);
    doc.setFontSize(14);doc.setFont("helvetica","normal");doc.setTextColor("#8899bb");
    doc.text(r.sector.label,M,128);
    doc.text((data.province||"Espa\u00f1a")+", "+new Date().toLocaleDateString("es-ES",{month:"long",year:"numeric"}),M,138);
    doc.setFontSize(9);doc.setTextColor("#556688");
    doc.text("Preparado por SP Financial Advisory LLC",M,H-30);
    doc.text("Documento confidencial",M,H-24);

    // ═══ INDEX ═══
    doc.addPage();y=30;
    doc.setFontSize(20);doc.setTextColor(IK);doc.setFont("helvetica","bold");doc.text("\u00cdndice",M,y);y+=12;
    doc.setDrawColor(BL);doc.setLineWidth(0.5);doc.line(M,y,W-M,y);y+=12;
    const tocItems=[
      {n:"1",t:"Valoraci\u00f3n"},
      {n:"2",t:"An\u00e1lisis de la Compa\u00f1\u00eda"},
      {n:"3",t:"Desglose por Metodolog\u00eda & Puente de Valoraci\u00f3n"},
      {n:"4",t:"Quality Score"},
      {n:"5",t:"Hip\u00f3tesis del Modelo Financiero & Composici\u00f3n DCF"},
      ...(isPro?[
        {n:"6",t:"Benchmarking Sectorial"},
        {n:"7",t:"An\u00e1lisis de Sensibilidad"},
        {n:"8",t:"Recomendaciones de Creaci\u00f3n de Valor"},
        {n:"9",t:"Nota del Analista"},
      ]:[]),
    ];
    tocItems.forEach(item=>{
      doc.setFontSize(11);doc.setTextColor(BL);doc.setFont("helvetica","bold");doc.text(item.n+".",M,y);
      doc.setTextColor(IK);doc.text(item.t,M+10,y);
      y+=10;
    });

    // ═══ SECTION 1: VALORACIÓN ═══
    doc.addPage();y=25;
    doc.setFontSize(16);doc.setTextColor(BL);doc.setFont("helvetica","bold");doc.text("1. VALORACI\u00d3N",M,y);y+=12;
    doc.setFillColor(NY);doc.roundedRect(M,y,CW,45,3,3,"F");
    doc.setFontSize(9);doc.setTextColor("#8899bb");doc.text("VALOR DE LAS PARTICIPACIONES (EQUITY VALUE)",W/2,y+12,{align:"center"});
    doc.setFontSize(26);doc.setTextColor("#ffffff");doc.setFont("helvetica","bold");doc.text(fmtM(r.eqBlended),W/2,y+28,{align:"center"});
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor("#8899bb");doc.text("Rango: "+fmtM(r.eqLow)+" \u2013 "+fmtM(r.eqHigh),W/2,y+38,{align:"center"});
    y+=55;
    const mt=[{l:"Valor Compa\u00f1\u00eda (EV)",v:fmtM(r.evBlended)},{l:"Deuda Financiera Neta",v:fmtM(r.dfn)},{l:"M\u00faltiplo aplicado",v:r.selectedMult.toFixed(1)+"x"},{l:"Quality Score",v:r.qualScore+"/100"}];
    const bw=(CW-6)/2;mt.forEach((m,i)=>{const col=i%2,row=Math.floor(i/2),bx=M+col*(bw+6),by=y+row*(bh+4);doc.setFillColor("#f0f4fa");doc.roundedRect(bx,by,bw,bh,2,2,"F");doc.setFontSize(7.5);doc.setTextColor(GY);doc.text(m.l,bx+4,by+6);doc.setFontSize(12);doc.setTextColor(IK);doc.setFont("helvetica","bold");doc.text(m.v,bx+4,by+14);doc.setFont("helvetica","normal")});
    y+=2*(bh+4)+10;

    // ═══ SECTION 2: ANÁLISIS COMPAÑÍA ═══
    doc.addPage();y=25;
    doc.setFontSize(16);doc.setTextColor(BL);doc.setFont("helvetica","bold");doc.text("2. AN\u00c1LISIS DE LA COMPA\u00d1\u00cdA",M,y);y+=12;
    if(companyAnalysis){
      [{t:"Descripci\u00f3n del negocio",v:companyAnalysis.descripcion},{t:"Historia y trayectoria",v:companyAnalysis.historia},{t:"Modelo de negocio",v:companyAnalysis.modelo},{t:"Oferta de productos/servicios",v:companyAnalysis.oferta},{t:"Presencia geogr\u00e1fica",v:companyAnalysis.geografia},{t:"M\u00e9tricas operativas clave",v:companyAnalysis.metricas}].forEach(f=>{
        if(!f.v)return;y=ck(16);doc.setFontSize(10);doc.setTextColor(IK);doc.setFont("helvetica","bold");doc.text(f.t,M,y);y+=5.5;
        doc.setFont("helvetica","normal");doc.setTextColor(I2);doc.setFontSize(9.5);const l=doc.splitTextToSize(f.v,CW);y=ck(l.length*4.2);doc.text(l,M,y);y+=l.length*4.2+5;
      });
    }else{doc.setFontSize(10);doc.setTextColor(GY);doc.text("An\u00e1lisis no disponible.",M,y);y+=10}

    // ═══ SECTION 3: METODOLOGÍA & PUENTE ═══
    doc.addPage();y=25;
    doc.setFontSize(16);doc.setTextColor(BL);doc.setFont("helvetica","bold");doc.text("3. DESGLOSE POR METODOLOG\u00cdA & PUENTE DE VALORACI\u00d3N",M,y);y+=12;
    sT("Desglose por metodolog\u00eda");
    bT("Para determinar el valor de "+(data.name||"la empresa")+", se han aplicado dos metodolog\u00edas: m\u00faltiplos de mercado (60%) y descuento de flujos de caja (20%), con un ajuste cualitativo (20%).");
    y=ck(35);let tx=M;doc.setFillColor(NY);doc.rect(M,y,CW,7,"F");doc.setFontSize(7.5);doc.setTextColor("#ffffff");doc.setFont("helvetica","bold");
    ["M\u00e9todo","Valor Comp.","Valor Partic.","Peso"].forEach((h,i)=>{doc.text(h,tx+2,y+5);tx+=[50,40,48,24][i]});y+=7;doc.setFont("helvetica","normal");doc.setTextColor(IK);doc.setFontSize(9);
    [["M\u00faltiplos comparables",fmtM(r.evMultiples),fmtM(r.eqMultiples),"60%"],["DCF simplificado",fmtM(r.evDcf),fmtM(r.eqDcf),"20%"],["Ajuste cualitativo","","Score "+r.qualScore+"/100","20%"],["Valoraci\u00f3n ponderada",fmtM(r.evBlended),fmtM(r.eqBlended),"100%"]].forEach((rw,ri)=>{tx=M;if(ri===3)doc.setFont("helvetica","bold");if(ri%2===0){doc.setFillColor("#f7f8fb");doc.rect(M,y,CW,7,"F")}rw.forEach((c,ci)=>{doc.text(c,tx+2,y+5);tx+=[50,40,48,24][ci]});y+=7;doc.setFont("helvetica","normal")});y+=10;
    sT("Puente de valoraci\u00f3n");y=ck(25);
    box3(sx,y,"#e8eefb","Valor Compa\u00f1\u00eda",fmtM(r.evBlended),GY,BL);sign(sx+bbW+gap/2,y,r.dfn>0?"\u2212":"+");box3(sx+bbW+gap,y,r.dfn>0?"#fee2e2":"#e6f7ed","Deuda Fin. Neta",fmtM(Math.abs(r.dfn)),GY,r.dfn>0?RD:GR);sign(sx+2*bbW+1.5*gap,y,"=");box3(sx+2*(bbW+gap),y,NY,"Valor Participaciones",fmtM(r.eqBlended),"#8899bb","#ffffff");y+=bh+10;

    // ═══ SECTION 4: QUALITY SCORE WITH DONUTS ═══
    doc.addPage();y=25;
    doc.setFontSize(16);doc.setTextColor(BL);doc.setFont("helvetica","bold");doc.text("4. QUALITY SCORE",M,y);y+=12;
    doc.setFontSize(11);doc.setTextColor(IK);doc.setFont("helvetica","bold");doc.text("Puntuaci\u00f3n global: "+r.qualScore+"/100",M,y);
    doc.setFont("helvetica","normal");doc.setFontSize(9.5);doc.setTextColor(I2);doc.text("  (percentil "+Math.round(r.percentile*100)+")",M+55,y);y+=10;

    // Grid of donuts: 2 columns x 5 rows
    const colW=CW/2;const donutR=9;const rowH=38;
    qualDetails.forEach((d,i)=>{
      const col=i%2;const rowIdx=Math.floor(i/2);
      if(col===0)y=ck(rowH);
      const cx=M+col*colW+donutR+2;
      const cy=y+donutR;
      const clr=d.score>=70?GR:d.score>=40?BL:AM;
      donut(cx,cy,donutR,d.score,clr);
      // Label and explanation
      const textX=cx+donutR+6;const textW=colW-donutR*2-12;
      doc.setFontSize(10);doc.setTextColor(IK);doc.setFont("helvetica","bold");doc.text(d.label,textX,cy-5);
      doc.setFontSize(8);doc.setTextColor(GY);doc.setFont("helvetica","normal");doc.text(d.score+"/100",textX,cy);
      const ex=getQualExplanation(d.id,d.optionIndex);
      if(ex&&d.score>0){
        doc.setFontSize(8);doc.setTextColor(I2);
        const lines=doc.splitTextToSize(ex,textW);
        doc.text(lines.slice(0,3),textX,cy+5);
      }
      if(col===1)y+=rowH;
    });
    if(qualDetails.length%2===1)y+=rowH;

    // ═══ SECTION 5: DCF & COMPOSITION ═══
    doc.addPage();y=25;
    doc.setFontSize(16);doc.setTextColor(BL);doc.setFont("helvetica","bold");const s5lines=doc.splitTextToSize("5. HIP\u00d3TESIS DEL MODELO FINANCIERO & COMPOSICI\u00d3N DCF",CW);doc.text(s5lines,M,y);y+=s5lines.length*7+5;
    sT("Hip\u00f3tesis del modelo financiero (DCF)");
    bT("Estima el valor en funci\u00f3n del dinero que generar\u00e1 la empresa en el futuro, descontado a valor presente.");
    y=ck(50);tx=M;doc.setFillColor(NY);doc.rect(M,y,CW,7,"F");doc.setFontSize(7.5);doc.setTextColor("#ffffff");doc.setFont("helvetica","bold");
    doc.text("Par\u00e1metro",M+2,y+5);doc.text("Valor",M+55,y+5);doc.text("Descripci\u00f3n",M+95,y+5);y+=7;doc.setFont("helvetica","normal");
    [["EBITDA",fmtM(r.ebitda),"Res. explotaci\u00f3n + amortizaci\u00f3n"],["Crecimiento",fmtPct(r.cappedGrowth)+"\u2192"+fmtPct(TERMINAL_GROWTH),"Basado en hist\u00f3rico"],["WACC",fmtPct(r.wacc),"Tasa de descuento"],["Impuestos",fmtPct(TAX_RATE),"IS Espa\u00f1a"],["g terminal",fmtPct(TERMINAL_GROWTH),"Crecimiento perpetuo"],["Proyecci\u00f3n",PROJECTION_YEARS+" a\u00f1os","Horizonte expl\u00edcito"]].forEach((rw,ri)=>{if(ri%2===0){doc.setFillColor("#f7f8fb");doc.rect(M,y,CW,7,"F")}doc.setFontSize(8.5);doc.setTextColor(IK);doc.setFont("helvetica","bold");doc.text(rw[0],M+2,y+5);doc.setFont("helvetica","normal");doc.text(rw[1],M+55,y+5);doc.setFontSize(7.5);doc.setTextColor(GY);doc.text(rw[2],M+95,y+5);y+=7});y+=10;

    sT("Composici\u00f3n del valor por DCF");y=ck(30);
    box3(sx,y,"#e8eefb","VP flujos proyectados",fmtM(r.sumPvFcf),GY,BL);sign(sx+bbW+gap/2,y,"+");
    box3(sx+bbW+gap,y,"#fef6e7","VP valor terminal",fmtM(r.pvTerminal),GY,AM);sign(sx+2*bbW+1.5*gap,y,"=");
    box3(sx+2*(bbW+gap),y,NY,"Valor Compa\u00f1\u00eda (DCF)",fmtM(r.evDcf),"#8899bb","#ffffff");y+=bh+10;

    // ═══ SECTIONS 6-9: PROFESSIONAL ONLY ═══
    if(isPro&&professionalAnalysis){
      const pa=professionalAnalysis;

      // ── SECTION 6: BENCHMARKING ──
      doc.addPage();y=25;
      doc.setFontSize(16);doc.setTextColor(BL);doc.setFont("helvetica","bold");doc.text("6. BENCHMARKING SECTORIAL",M,y);y+=12;
      if(pa.benchmarking){
        const b=pa.benchmarking;
        bT(b.intro||"");y+=4;
        // Table header
        y=ck(40);
        const bCols=[70,30,30,30];const bHeaders=["Indicador","Tu empresa","Sector mediana","Posici\u00f3n"];
        let bx=M;doc.setFillColor(NY);doc.rect(M,y,CW,7,"F");doc.setFontSize(7.5);doc.setTextColor("#ffffff");doc.setFont("helvetica","bold");
        bHeaders.forEach((h,i)=>{doc.text(h,bx+2,y+5);bx+=bCols[i]});y+=7;doc.setFont("helvetica","normal");
        const bRows=[
          ["Margen EBITDA",(b.margen_ebitda_empresa||0).toFixed(1)+"%",(b.margen_ebitda_sector||0).toFixed(1)+"%",(b.margen_ebitda_empresa||0)>=(b.margen_ebitda_sector||0)?"Por encima":"Por debajo"],
          ["Crecimiento",(b.crecimiento_empresa||0).toFixed(1)+"%",(b.crecimiento_sector||0).toFixed(1)+"%",(b.crecimiento_empresa||0)>=(b.crecimiento_sector||0)?"Por encima":"Por debajo"],
          ["M\u00faltiplo EV/EBITDA",(b.multiplo_empresa||0).toFixed(1)+"x",(b.multiplo_sector||0).toFixed(1)+"x",(b.multiplo_empresa||0)>=(b.multiplo_sector||0)?"Por encima":"Por debajo"],
        ];
        bRows.forEach((row,ri)=>{
          bx=M;if(ri%2===0){doc.setFillColor("#f7f8fb");doc.rect(M,y,CW,7,"F")}
          doc.setFontSize(8.5);doc.setTextColor(IK);doc.setFont("helvetica","bold");doc.text(row[0],bx+2,y+5);bx+=bCols[0];
          doc.setFont("helvetica","normal");const isAbove=row[3]==="Por encima";
          doc.setTextColor(isAbove?GR:AM);doc.text(row[1],bx+2,y+5);bx+=bCols[1];
          doc.setTextColor(I2);doc.text(row[2],bx+2,y+5);bx+=bCols[2];
          doc.setTextColor(isAbove?GR:AM);doc.setFont("helvetica","bold");doc.text(row[3],bx+2,y+5);
          doc.setFont("helvetica","normal");y+=7;
        });
        y+=8;if(b.conclusion){doc.setTextColor(I2);bT(b.conclusion)}
      }

      // ── SECTION 7: SENSIBILIDAD ──
      doc.addPage();y=25;
      doc.setFontSize(16);doc.setTextColor(BL);doc.setFont("helvetica","bold");doc.text("7. AN\u00c1LISIS DE SENSIBILIDAD",M,y);y+=12;
      bT("La siguiente tabla muestra c\u00f3mo var\u00eda el valor de las participaciones seg\u00fan el EBITDA (\u00b120%) y el m\u00faltiplo aplicado (\u00b12x). La celda azul oscuro es el escenario base.");
      y+=6;
      const eVars=[-0.20,-0.10,0,0.10,0.20];const mVars=[-2,-1,0,1,2];
      const cellW=CW/6;const cellH=9;
      // Header row
      y=ck(cellH*(eVars.length+2));
      doc.setFillColor(NY);doc.rect(M,y,cellW,cellH,"F");
      mVars.forEach((mv,mi)=>{
        doc.setFillColor(NY);doc.rect(M+cellW*(mi+1),y,cellW,cellH,"F");
        doc.setFontSize(7);doc.setTextColor("#ffffff");doc.setFont("helvetica","bold");
        const label=mv===0?r.selectedMult.toFixed(1)+"x (base)":(r.selectedMult+mv).toFixed(1)+"x";
        doc.text(label,M+cellW*(mi+1)+cellW/2,y+6,{align:"center"});
      });
      doc.setFontSize(7);doc.setTextColor("#ffffff");doc.text("EBITDA \\ M\u00faltiplo",M+cellW/2,y+6,{align:"center"});
      y+=cellH;
      eVars.forEach((ev)=>{
        const rowEbitda=r.ebitda*(1+ev);
        const rowLbl=ev===0?r.ebitda>0?(r.ebitda/1e6).toFixed(2)+"M\u20ac (base)":"-":(ev>0?"+":"")+(ev*100).toFixed(0)+"% ("+((r.ebitda*(1+ev))/1e6).toFixed(2)+"M\u20ac)";
        doc.setFillColor(ev===0?"#e8eefb":"#f7f8fb");doc.rect(M,y,cellW,cellH,"F");
        doc.setFontSize(6.5);doc.setTextColor(IK);doc.setFont("helvetica",ev===0?"bold":"normal");
        doc.text(rowLbl,M+cellW/2,y+6,{align:"center"});
        mVars.forEach((mv,mi)=>{
          const val=Math.max(0,(rowEbitda*(r.selectedMult+mv))-r.dfn);
          const isBase=ev===0&&mv===0;const pct=r.eqBlended>0?val/r.eqBlended-1:0;
          const bg=isBase?NY:pct>0.15?"#d1fae5":pct>0?"#e8eefb":pct>-0.15?"#fff7ed":"#fee2e2";
          const tc=isBase?"#ffffff":pct>0.15?GR:pct>0?BL:pct>-0.15?AM:RD;
          doc.setFillColor(bg);doc.rect(M+cellW*(mi+1),y,cellW,cellH,"F");
          doc.setFontSize(7);doc.setTextColor(tc);doc.setFont("helvetica",isBase?"bold":"normal");
          doc.text((val/1e6).toFixed(1)+"M\u20ac",M+cellW*(mi+1)+cellW/2,y+6,{align:"center"});
        });
        y+=cellH;
      });
      y+=10;doc.setFontSize(7.5);doc.setTextColor(GY);doc.setFont("helvetica","normal");doc.text("Valores en millones de euros. Celda azul oscuro = escenario base.",M,y);y+=8;

      // ── SECTION 8: RECOMENDACIONES ──
      doc.addPage();y=25;
      doc.setFontSize(16);doc.setTextColor(BL);doc.setFont("helvetica","bold");doc.text("8. RECOMENDACIONES DE CREACI\u00d3N DE VALOR",M,y);y+=12;
      bT("Basadas en los puntos de mejora identificados en el an\u00e1lisis cualitativo, estas son las palancas con mayor potencial para aumentar el valor de la empresa.");
      y+=6;
      if(pa.recomendaciones){
        pa.recomendaciones.forEach((rec,ri)=>{
          const impColor={alto:GR,medio:BL,bajo:AM};const ic=impColor[rec.impacto]||BL;
          const descLines=doc.splitTextToSize(rec.descripcion||"",CW-4);
          const blockH=10+descLines.length*4.5+8;
          y=ck(blockH);
          // Badge de impacto
          doc.setFillColor(ic);doc.roundedRect(M,y,28,6,1,1,"F");
          doc.setFontSize(7);doc.setTextColor("#ffffff");doc.setFont("helvetica","bold");
          doc.text("Impacto "+(rec.impacto||"").toUpperCase(),M+2,y+4.2);
          // Número y título
          doc.setFontSize(10);doc.setTextColor(IK);doc.setFont("helvetica","bold");
          doc.text((ri+1)+". "+(rec.titulo||""),M+31,y+4.5);
          y+=10;
          // Descripción
          doc.setFont("helvetica","normal");doc.setTextColor(I2);doc.setFontSize(9);
          doc.text(descLines,M+2,y);
          y+=descLines.length*4.5+10;
          // Separador
          doc.setDrawColor("#e4e8f1");doc.setLineWidth(0.3);doc.line(M,y-4,W-M,y-4);
        });
      }

      // ── SECTION 9: NOTA DEL ANALISTA ──
      doc.addPage();y=25;
      doc.setFontSize(16);doc.setTextColor(BL);doc.setFont("helvetica","bold");doc.text("9. NOTA DEL ANALISTA",M,y);y+=14;
      // Nota - calcular líneas con fuente más pequeña para que quepa
      doc.setFontSize(9);
      const noteLines=pa.nota_analista?doc.splitTextToSize("\u201c"+pa.nota_analista+"\u201d",CW-20):["(Sin nota del analista)"];
      const noteH=Math.max(30,noteLines.length*5.5+20);
      doc.setFillColor("#f7f8fb");doc.roundedRect(M,y,CW,noteH,3,3,"F");
      doc.setDrawColor(BL);doc.setLineWidth(0.4);doc.line(M,y,M,y+noteH);
      doc.setTextColor(I2);doc.setFont("helvetica","italic");
      doc.text(noteLines,M+10,y+10);
      y+=noteH+16;
      // Firma al final de la última página
      const lastPage=doc.getNumberOfPages();
      doc.setPage(lastPage);
      const sigY=H-38;
      doc.setDrawColor("#e4e8f1");doc.setLineWidth(0.3);doc.line(M,sigY,W-M,sigY);
      doc.setFontSize(9);doc.setFont("helvetica","bold");doc.setTextColor(IK);doc.text("SP Financial Advisory LLC",M,sigY+7);
      doc.setFont("helvetica","normal");doc.setTextColor(GY);doc.setFontSize(8);
      doc.text("Analista de valoraci\u00f3n · "+new Date().toLocaleDateString("es-ES",{month:"long",year:"numeric"}),M,sigY+13);
      doc.text("An\u00e1lisis indicativo. Para uso exclusivo del destinatario.",M,sigY+19);
    }

    // Footers on all pages
    const tp=doc.getNumberOfPages();for(let i=1;i<=tp;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(GY);doc.text("valoratuempresa.es \u00b7 SP Financial Advisory LLC",W/2,H-10,{align:"center"});doc.text("P\u00e1g. "+i+"/"+tp,W-M,H-10,{align:"right"})}
    doc.save((isPro?"Valoracion_Profesional_":"Valoracion_Esencial_")+(data.name||"empresa").replace(/[^a-zA-Z0-9]/g,"_")+"_"+new Date().toISOString().slice(0,10)+".pdf");
    setPdfLoading(false);
  }

  return<div className="fade-in">
    <h2 className="app-title">Resultado de la valoración</h2>
    <p className="app-sub">{data.name||"Tu empresa"} · {r.sector.label}</p>

    {/* Hero - always visible */}
    <div className="r-hero"><div className="r-hero-l">Valor de las participaciones (Equity Value)</div><div className="r-hero-v">{fmtM(r.eqBlended)}</div><div className="r-hero-rng">Rango: {fmtM(r.eqLow)} – {fmtM(r.eqHigh)}</div></div>
    <div className="r-grid">
      <div className="r-card"><div className="r-card-t">Valor de la Compañía (Enterprise Value)</div><div className="r-card-v">{fmtM(r.evBlended)}</div><div className="r-card-d">Antes de deducir deuda</div></div>
      <div className="r-card"><div className="r-card-t">Deuda Financiera Neta</div><div className="r-card-v">{fmtM(r.dfn)}</div><div className="r-card-d">{r.dfn>0?"Se deduce del EV":"Caja neta — suma al EV"}</div></div>
      <div className="r-card"><div className="r-card-t">Múltiplo aplicado</div><div className="r-card-v">{r.selectedMult.toFixed(1)}x</div><div className="r-card-d">EV/EBITDA · Base: {r.baseMultiple.toFixed(1)}x, ajuste: {r.sizeAdj>=0?"+":""}{(r.sizeAdj*100).toFixed(0)}%</div></div>
      <div className="r-card"><div className="r-card-t">Quality Score</div><div className="r-card-v" style={{color:scoreColor}}>{r.qualScore}/100</div><div className="r-card-d">Percentil {Math.round(r.percentile*100)} del rango</div></div>
    </div>

    {/* Paywall - shown when plan is free */}
    {plan==="free"&&<>
      <div className="paywall">
        <h3>Desbloquea el informe completo</h3>
        <p>Obtén el desglose detallado por metodología, Quality Score por cada factor, hipótesis del DCF y descarga tu informe en PDF.</p>
        <div className="paywall-btns">
          <button className="pw-btn pw-btn-p" onClick={()=>initiateCheckout("essential",data)}>Informe Esencial · 149€ + IVA</button>
          <button className="pw-btn pw-btn-o" onClick={()=>initiateCheckout("professional",data)}>Informe Profesional · 299€ + IVA</button>
        </div>
        <p style={{fontSize:12,color:"var(--ink3)",marginTop:14}}>De momento, el pago no está activado. Haz clic para previsualizar el informe.</p>
      </div>
      {/* Blurred preview of methodology table */}
      <div style={{position:"relative"}}>
        <div style={{filter:"blur(6px)",pointerEvents:"none",userSelect:"none",opacity:0.5}}>
          <div className="r-sec"><h3>Análisis de la compañía</h3><p style={{color:"var(--ink3)",fontSize:14}}>Descripción del negocio, historia, modelo operativo, oferta de productos y servicios, presencia geográfica y métricas operativas clave...</p></div>
          <div className="r-sec"><h3>Desglose por metodología</h3><div style={{overflowX:"auto"}}><table className="m-tbl" style={{minWidth:320}}><thead><tr><th>Método</th><th>EV</th><th>Equity</th><th>Peso</th></tr></thead><tbody><tr><td>Múltiplos</td><td>{fmtM(r.evMultiples)}</td><td>{fmtM(r.eqMultiples)}</td><td>60%</td></tr><tr><td>DCF</td><td>{fmtM(r.evDcf)}</td><td>{fmtM(r.eqDcf)}</td><td>20%</td></tr><tr><td>Ajuste cualitativo</td><td colSpan="2" style={{textAlign:"center"}}>Score {r.qualScore}/100</td><td>20%</td></tr><tr><td><strong>Ponderada</strong></td><td><strong>{fmtM(r.evBlended)}</strong></td><td><strong>{fmtM(r.eqBlended)}</strong></td><td><strong>100%</strong></td></tr></tbody></table></div></div>
        </div>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"var(--w)",border:"2px solid var(--blue)",borderRadius:12,padding:"16px 28px",textAlign:"center",boxShadow:"0 4px 24px rgba(0,0,0,0.12)"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:4}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <p style={{fontSize:14,fontWeight:600,color:"var(--ink)",margin:0}}>Disponible en el Informe Esencial</p>
        </div>
      </div>
    </>}

    {/* ESSENTIAL PLAN - full content */}
    {plan==="essential"&&<>
      {/* Success banner - not in PDF */}
      <div style={{background:"var(--greenS)",border:"1.5px solid #b8e6c8",borderRadius:"var(--rs)",padding:"16px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:12}}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div><p style={{fontSize:15,fontWeight:600,color:"var(--green)",margin:0}}>Informe Esencial desbloqueado</p><p style={{fontSize:13,color:"var(--ink3)",margin:0}}>Enviado a {data.contactEmail||"tu email"}</p></div>
      </div>



      {/* AI Company Analysis */}
      <CompanyAnalysis data={data} onAnalysisReady={(ca)=>{setCompanyAnalysis(ca);companyAnalysisRef.current=ca;}}/>

      {/* Methodology with explanation */}
      <div className="r-sec">
        <h3>Desglose por metodología</h3>
        <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,marginBottom:16}}>Para determinar el valor de <strong>{data.name||"tu empresa"}</strong>, hemos aplicado dos metodologías de valoración complementarias. El método de <strong>múltiplos de mercado</strong> (60% del peso) compara tu empresa con transacciones reales de compañías similares en España. El método de <strong>descuento de flujos de caja (DCF)</strong> (20% del peso) estima el valor intrínseco en función de la capacidad futura de generar beneficios. Un <strong>ajuste cualitativo</strong> (20% del peso) posiciona tu empresa dentro del rango según las características específicas de tu negocio.</p>
        <div style={{overflowX:"auto"}}><table className="m-tbl" style={{minWidth:320}}>
          <thead><tr><th>Método</th><th>EV</th><th>Equity</th><th>Peso</th></tr></thead>
          <tbody>
            <tr><td>Múltiplos</td><td>{fmtM(r.evMultiples)}</td><td>{fmtM(r.eqMultiples)}</td><td>60%</td></tr>
            <tr><td>DCF</td><td>{fmtM(r.evDcf)}</td><td>{fmtM(r.eqDcf)}</td><td>20%</td></tr>
            <tr><td>Ajuste cualitativo</td><td colSpan="2" style={{textAlign:"center"}}>Score {r.qualScore}/100</td><td>20%</td></tr>
            <tr><td><strong>Ponderada</strong></td><td><strong>{fmtM(r.evBlended)}</strong></td><td><strong>{fmtM(r.eqBlended)}</strong></td><td><strong>100%</strong></td></tr>
          </tbody>
        </table></div>
      </div>

      {/* Quality Score detailed breakdown */}
      <div className="r-sec">
        <h3>Quality Score · Análisis detallado</h3>
        <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,marginBottom:16}}>El Quality Score evalúa 10 características cualitativas de tu empresa que influyen directamente en su valor. Cada factor recibe una puntuación de 0 a 100, ponderada según su impacto en la valoración.</p>
        <div>{qualDetails.map((d,i)=><div key={i} style={{marginBottom:16,paddingBottom:i<qualDetails.length-1?16:0,borderBottom:i<qualDetails.length-1?"1px solid var(--brd)":"none"}}><div className="sc-row"><span className="sc-lbl">{d.label}</span><div className="sc-bg"><div className="sc-fill" style={{width:d.score+"%",background:d.color}}/></div><span className="sc-val">{d.score}</span></div>{d.optionIndex!==undefined&&d.score>0&&<p style={{fontSize:13,color:"var(--ink3)",lineHeight:1.55,margin:"6px 0 0",paddingLeft:142}}>{getQualExplanation(d.id,d.optionIndex)}</p>}{(d.optionIndex===undefined||d.score===0)&&<p style={{fontSize:13,color:"var(--ink3)",lineHeight:1.55,margin:"6px 0 0",paddingLeft:142,fontStyle:"italic"}}>No se ha proporcionado información sobre este factor.</p>}</div>)}</div>
        <div style={{marginTop:16,padding:"12px 16px",background:"var(--bg)",borderRadius:"var(--rs)",fontSize:13,color:"var(--ink2)"}}>
          <strong>Interpretación:</strong> Tu Quality Score de <strong style={{color:scoreColor}}>{r.qualScore}/100</strong> sitúa tu empresa en el <strong>percentil {Math.round(r.percentile*100)}</strong> del rango de valoración de tu sector. {r.qualScore>=70?"Tu empresa muestra fortalezas significativas que justifican una valoración por encima de la mediana.":r.qualScore>=40?"Tu empresa se sitúa en la zona media del rango. Hay margen de mejora en varios factores.":"Tu empresa presenta áreas de riesgo que presionan la valoración a la baja. Mejorar estos factores podría aumentar significativamente el valor."}
        </div>
      </div>

      {/* DCF Assumptions */}
      <div className="r-sec">
        <h3>Hipótesis del modelo financiero (DCF)</h3>
        <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,marginBottom:16}}>El método de Descuento de Flujos de Caja (DCF) estima cuánto vale tu empresa hoy en función del dinero que generará en el futuro. Proyectamos los beneficios operativos a {PROJECTION_YEARS} años y los traemos a valor presente aplicando una tasa de descuento que refleja el riesgo de tu negocio.</p>
        <table className="m-tbl dcf-tbl">
          <thead><tr><th>Parámetro</th><th>Valor</th><th>Qué significa</th></tr></thead>
          <tbody>
            <tr><td><strong>EBITDA calculado</strong></td><td>{fmtM(r.ebitda)}</td><td style={{fontSize:13,color:"var(--ink3)"}}>Resultado de explotación + amortización. Es el beneficio operativo antes de intereses, impuestos y amortizaciones.</td></tr>
            <tr><td><strong>Crecimiento proyectado</strong></td><td>{fmtPct(r.cappedGrowth)} → {fmtPct(TERMINAL_GROWTH)}</td><td style={{fontSize:13,color:"var(--ink3)"}}>Ritmo de crecimiento del EBITDA, basado en tu evolución histórica. Se reduce gradualmente hasta el crecimiento a largo plazo.</td></tr>
            <tr><td><strong>WACC</strong></td><td>{fmtPct(r.wacc)}</td><td style={{fontSize:13,color:"var(--ink3)"}}>Rentabilidad mínima que un inversor exigiría. A mayor riesgo (Quality Score bajo), mayor WACC y menor valoración.</td></tr>
            <tr><td><strong>Tasa impositiva</strong></td><td>{fmtPct(TAX_RATE)}</td><td style={{fontSize:13,color:"var(--ink3)"}}>Tipo del Impuesto de Sociedades en España aplicado sobre el beneficio operativo.</td></tr>
            <tr><td><strong>Crecimiento terminal</strong></td><td>{fmtPct(TERMINAL_GROWTH)}</td><td style={{fontSize:13,color:"var(--ink3)"}}>Tasa de crecimiento indefinido después del período de proyección, basada en el PIB español a largo plazo.</td></tr>
            <tr><td><strong>Período de proyección</strong></td><td>{PROJECTION_YEARS} años</td><td style={{fontSize:13,color:"var(--ink3)"}}>Horizonte temporal de proyección explícita de los flujos de caja.</td></tr>
          </tbody>
        </table>
      </div>

      {/* DCF Visual breakdown */}
      <div className="r-sec">
        <h3>Composición del valor por DCF</h3>
        <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,marginBottom:16}}>El valor de la compañía por DCF se compone de dos elementos: el valor presente de los flujos de caja de los próximos {PROJECTION_YEARS} años, y el valor terminal que representa todos los flujos futuros a partir de ese momento.</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap",padding:"16px 0"}}>
          <div style={{textAlign:"center",padding:"14px 22px",background:"var(--blueS)",borderRadius:"var(--rs)",minWidth:160,flex:"1 1 160px",maxWidth:200}}><div style={{fontSize:11,color:"var(--ink3)",marginBottom:4}}>VP flujos proyectados</div><div style={{fontSize:20,fontWeight:600,color:"var(--blue)"}}>{fmtM(r.sumPvFcf)}</div><div style={{fontSize:11,color:"var(--ink3)",marginTop:4}}>Años 1-{PROJECTION_YEARS}</div></div>
          <span style={{fontSize:22,color:"var(--ink3)",fontWeight:300}}>+</span>
          <div style={{textAlign:"center",padding:"14px 22px",background:"var(--amberS)",borderRadius:"var(--rs)",minWidth:160,flex:"1 1 160px",maxWidth:200}}><div style={{fontSize:11,color:"var(--ink3)",marginBottom:4}}>VP valor terminal</div><div style={{fontSize:20,fontWeight:600,color:"var(--amber)"}}>{fmtM(r.pvTerminal)}</div><div style={{fontSize:11,color:"var(--ink3)",marginTop:4}}>Año {PROJECTION_YEARS}+</div></div>
          <span style={{fontSize:22,color:"var(--ink3)",fontWeight:300}}>=</span>
          <div style={{textAlign:"center",padding:"14px 22px",background:"var(--navy)",borderRadius:"var(--rs)",minWidth:160,flex:"1 1 160px",maxWidth:200}}><div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginBottom:4}}>Valor Compañía (DCF)</div><div style={{fontSize:20,fontWeight:600,color:"#fff"}}>{fmtM(r.evDcf)}</div></div>
        </div>
      </div>

      {/* Valuation bridge */}
      <div className="r-sec">
        <h3>Puente de valoración</h3>
        <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,marginBottom:16}}>El valor de las participaciones se obtiene restando la deuda financiera neta del valor de la compañía. Si la empresa tiene más caja que deuda, este importe se suma al valor.</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap",padding:"16px 0"}}>
          <div style={{textAlign:"center",padding:"14px 22px",background:"var(--blueS)",borderRadius:"var(--rs)",minWidth:160,flex:"1 1 160px",maxWidth:200}}><div style={{fontSize:11,color:"var(--ink3)",marginBottom:2}}>Valor Compañía</div><div style={{fontSize:20,fontWeight:600,color:"var(--blue)"}}>{fmtM(r.evBlended)}</div></div>
          <span style={{fontSize:22,color:"var(--ink3)",fontWeight:300}}>{r.dfn>0?"−":"+"}</span>
          <div style={{textAlign:"center",padding:"14px 22px",background:r.dfn>0?"var(--redS)":"var(--greenS)",borderRadius:"var(--rs)",minWidth:160,flex:"1 1 160px",maxWidth:200}}><div style={{fontSize:11,color:"var(--ink3)",marginBottom:2}}>Deuda Fin. Neta</div><div style={{fontSize:20,fontWeight:600,color:r.dfn>0?"var(--red)":"var(--green)"}}>{fmtM(Math.abs(r.dfn))}</div></div>
          <span style={{fontSize:22,color:"var(--ink3)",fontWeight:300}}>=</span>
          <div style={{textAlign:"center",padding:"14px 22px",background:"var(--navy)",borderRadius:"var(--rs)",minWidth:160,flex:"1 1 160px",maxWidth:200}}><div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginBottom:2}}>Valor Participaciones</div><div style={{fontSize:20,fontWeight:600,color:"#fff"}}>{fmtM(r.eqBlended)}</div></div>
        </div>
      </div>



      {/* Download button */}
      <div style={{textAlign:"center",margin:"28px 0"}}>
        <button className="btn btn-p" style={{padding:"14px 36px",fontSize:16}} disabled={pdfLoading} onClick={generatePDF}>
          {pdfLoading?<>Generando PDF...</>:<><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg> Descargar informe PDF</>}
        </button>
      </div>

      {/* Upgrade to Professional */}
      <div style={{background:"linear-gradient(135deg,#0f1a2e 0%,#1a3a6e 100%)",borderRadius:"var(--r)",padding:"32px",textAlign:"center",margin:"8px 0 28px",color:"#fff"}}>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:10}}>¿Quieres ir más allá?</p>
        <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:24,marginBottom:10,color:"#fff"}}>Upgrade al Informe Profesional</h3>
        <div style={{display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap",marginBottom:20,fontSize:14,color:"rgba(255,255,255,0.75)"}}>
          <span>✓ Análisis de sensibilidad</span><span>✓ Benchmarking sectorial</span><span>✓ Palancas de creación de valor</span><span>✓ Nota del analista</span>
        </div>
        <button className="pw-btn pw-btn-p" style={{fontSize:16,padding:"13px 32px",background:"#fff",color:"var(--navy)",fontWeight:700}} onClick={()=>initiateCheckout("professional_upgrade",data)}>Upgrade por solo 150€ + IVA →
        </button>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:10}}>De momento el pago no está activado. Haz clic para previsualizar.</p>
      </div>
    </>}

    {/* PROFESSIONAL PLAN */}
    {plan==="professional"&&<>
      <div style={{background:"linear-gradient(135deg,#0f1a2e,#1a3a6e)",borderRadius:"var(--rs)",padding:"16px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:12}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <div><p style={{fontSize:15,fontWeight:700,color:"#fff",margin:0}}>Informe Profesional desbloqueado</p><p style={{fontSize:13,color:"rgba(255,255,255,0.6)",margin:0}}>Incluye todo el Informe Esencial más análisis avanzado</p></div>
      </div>

      {/* Reutilizamos el contenido del Essential */}
      <CompanyAnalysis data={data} onAnalysisReady={(ca)=>{setCompanyAnalysis(ca);companyAnalysisRef.current=ca;}}/>
      <div className="r-sec">
        <h3>Desglose por metodología</h3>
        <p style={{fontSize:14,color:"var(--ink2)",lineHeight:1.6,marginBottom:16}}>Para determinar el valor de <strong>{data.name||"tu empresa"}</strong>, hemos aplicado dos metodologías complementarias: <strong>múltiplos de mercado</strong> (60%), <strong>descuento de flujos de caja DCF</strong> (20%) y un <strong>ajuste cualitativo</strong> (20%).</p>
        <div style={{overflowX:"auto"}}><table className="m-tbl" style={{minWidth:320}}><thead><tr><th>Método</th><th>EV</th><th>Equity</th><th>Peso</th></tr></thead><tbody><tr><td>Múltiplos</td><td>{fmtM(r.evMultiples)}</td><td>{fmtM(r.eqMultiples)}</td><td>60%</td></tr><tr><td>DCF</td><td>{fmtM(r.evDcf)}</td><td>{fmtM(r.eqDcf)}</td><td>20%</td></tr><tr><td>Ajuste cualitativo</td><td colSpan="2" style={{textAlign:"center"}}>Score {r.qualScore}/100</td><td>20%</td></tr><tr><td><strong>Ponderada</strong></td><td><strong>{fmtM(r.evBlended)}</strong></td><td><strong>{fmtM(r.eqBlended)}</strong></td><td><strong>100%</strong></td></tr></tbody></table></div>
      </div>
      <div className="r-sec">
        <h3>Quality Score · Análisis detallado</h3>
        <div>{qualDetails.map((d,i)=><div key={i} style={{marginBottom:16,paddingBottom:i<qualDetails.length-1?16:0,borderBottom:i<qualDetails.length-1?"1px solid var(--brd)":"none"}}><div className="sc-row"><span className="sc-lbl">{d.label}</span><div className="sc-bg"><div className="sc-fill" style={{width:d.score+"%",background:d.color}}/></div><span className="sc-val">{d.score}</span></div>{d.optionIndex!==undefined&&d.score>0&&<p style={{fontSize:13,color:"var(--ink3)",lineHeight:1.55,margin:"6px 0 0",paddingLeft:142}}>{getQualExplanation(d.id,d.optionIndex)}</p>}</div>)}</div>
      </div>

      {/* Professional-only content */}
      <ProfessionalAnalysis data={data} r={r} qualDetails={qualDetails} onReady={(pa)=>{setProfessionalAnalysis(pa);professionalAnalysisRef.current=pa;}}/>

      {/* DCF */}
      <div className="r-sec">
        <h3>Hipótesis del modelo financiero (DCF)</h3>
        <table className="m-tbl dcf-tbl"><thead><tr><th>Parámetro</th><th>Valor</th><th>Qué significa</th></tr></thead><tbody><tr><td><strong>EBITDA calculado</strong></td><td>{fmtM(r.ebitda)}</td><td style={{fontSize:13,color:"var(--ink3)"}}>Resultado de explotación + amortización.</td></tr><tr><td><strong>Crecimiento proyectado</strong></td><td>{fmtPct(r.cappedGrowth)} → {fmtPct(TERMINAL_GROWTH)}</td><td style={{fontSize:13,color:"var(--ink3)"}}>Basado en evolución histórica, se reduce gradualmente.</td></tr><tr><td><strong>WACC</strong></td><td>{fmtPct(r.wacc)}</td><td style={{fontSize:13,color:"var(--ink3)"}}>Tasa de descuento ajustada por riesgo.</td></tr><tr><td><strong>Tasa impositiva</strong></td><td>{fmtPct(TAX_RATE)}</td><td style={{fontSize:13,color:"var(--ink3)"}}>IS España.</td></tr><tr><td><strong>Crecimiento terminal</strong></td><td>{fmtPct(TERMINAL_GROWTH)}</td><td style={{fontSize:13,color:"var(--ink3)"}}>PIB español largo plazo.</td></tr><tr><td><strong>Período de proyección</strong></td><td>{PROJECTION_YEARS} años</td><td style={{fontSize:13,color:"var(--ink3)"}}>Horizonte explícito.</td></tr></tbody></table>
      </div>
      <div className="r-sec">
        <h3>Puente de valoración</h3>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap",padding:"16px 0"}}>
          <div style={{textAlign:"center",padding:"14px 22px",background:"var(--blueS)",borderRadius:"var(--rs)",minWidth:160,flex:"1 1 160px",maxWidth:200}}><div style={{fontSize:11,color:"var(--ink3)",marginBottom:2}}>Valor Compañía</div><div style={{fontSize:20,fontWeight:600,color:"var(--blue)"}}>{fmtM(r.evBlended)}</div></div>
          <span style={{fontSize:22,color:"var(--ink3)",fontWeight:300}}>{r.dfn>0?"−":"+"}</span>
          <div style={{textAlign:"center",padding:"14px 22px",background:r.dfn>0?"var(--redS)":"var(--greenS)",borderRadius:"var(--rs)",minWidth:160,flex:"1 1 160px",maxWidth:200}}><div style={{fontSize:11,color:"var(--ink3)",marginBottom:2}}>Deuda Fin. Neta</div><div style={{fontSize:20,fontWeight:600,color:r.dfn>0?"var(--red)":"var(--green)"}}>{fmtM(Math.abs(r.dfn))}</div></div>
          <span style={{fontSize:22,color:"var(--ink3)",fontWeight:300}}>=</span>
          <div style={{textAlign:"center",padding:"14px 22px",background:"var(--navy)",borderRadius:"var(--rs)",minWidth:160,flex:"1 1 160px",maxWidth:200}}><div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginBottom:2}}>Valor Participaciones</div><div style={{fontSize:20,fontWeight:600,color:"#fff"}}>{fmtM(r.eqBlended)}</div></div>
        </div>
      </div>

      <div style={{textAlign:"center",margin:"28px 0"}}>
        {!professionalAnalysis&&<p style={{fontSize:13,color:"var(--ink3)",marginBottom:12}}>⏳ Espera a que termine de generarse el análisis antes de descargar el PDF.</p>}
        <button className="btn btn-p" style={{padding:"14px 36px",fontSize:16}} disabled={pdfLoading||!professionalAnalysis} onClick={generatePDF}>
          {pdfLoading?<>Generando PDF...</>:<><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg> Descargar informe PDF Profesional</>}
        </button>
      </div>
    </>}

    <div className="discl"><strong>Aviso legal:</strong> Esta valoración tiene carácter indicativo y orientativo.</div>
    <div className="btn-row"><button className="btn btn-g" onClick={onBack}>← Modificar datos</button><button className="btn btn-g" onClick={onHome}>Volver al inicio</button></div>
  </div>
}

// ─── APP WRAPPER ─────────────────────────────────────────────
function ValuationApp({onHome,returnPlan}){
  const[step,setStep]=useState(0);
  const[data,setData]=useState(()=>{
    if(typeof window!=="undefined"&&window.sessionStorage){
      try{const s=sessionStorage.getItem("vte_data");if(s){const d=JSON.parse(s);sessionStorage.removeItem("vte_data");return d;}}catch(e){}
    }
    return{qualAnswers:{}};
  });
  const topRef=useRef(null);useEffect(()=>{if(returnPlan){setStep(4)}},[returnPlan]);
  const onChange=(k,v)=>setData(d=>({...d,[k]:v}));
  const canNext=()=>{
    if(step===0)return data.sector;
    if(step===1)return data.revenue&&data.resExplotacion;
    if(step===2)return Object.keys(data.qualAnswers||{}).length>=5;
    if(step===3)return data.contactEmail&&data.contactEmail.includes("@");
    return false;
  };
  const go=(dir)=>{const ns=step+dir;if(ns===4&&dir===1){saveToGoogleSheets(data,'free')}setStep(s=>s+dir);setTimeout(()=>{window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0},50)};
  return<div className="app-overlay"><div ref={topRef}/>
    <div className="app-hdr"><div className="app-hdr-inner"><div className="app-hdr-left"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg><span className="app-hdr-title">Herramienta de valoración</span></div><div className="app-hdr-right">Paso {step+1} de {APP_STEPS.length} · <strong>{APP_STEPS[step].label}</strong></div></div><div className="app-hdr-prog"><div className="app-hdr-bar" style={{width:`${((step+1)/APP_STEPS.length)*100}%`}}/></div></div>
    <div className="app-main">
      {step===0&&<StepCompany data={data} onChange={onChange}/>}
      {step===1&&<StepFinancials data={data} onChange={onChange}/>}
      {step===2&&<StepQualitative data={data} onChange={onChange}/>}
      {step===3&&<StepEmail data={data} onChange={onChange}/>}
      {step===4&&<StepResults data={data} onBack={()=>go(-1)} onHome={onHome} returnPlan={returnPlan}/>}
      {step<4&&<div className="btn-row">{step>0?<button className="btn btn-g" onClick={()=>go(-1)}>← Atrás</button>:<button className="btn btn-g" onClick={onHome}>← Volver al inicio</button>}<button className="btn btn-p" disabled={!canNext()} onClick={()=>go(1)}>{step===3?"Ver mi valoración →":step===2?"Siguiente →":"Siguiente →"}</button></div>}
    </div>
  </div>
}

// ─── LEGAL PAGES ─────────────────────────────────────────────
function LegalPage({title, children, onHome}){
  return<div style={{paddingTop:68,minHeight:"100vh",background:"var(--bg)"}}>
    <div style={{maxWidth:760,margin:"0 auto",padding:"48px 24px 80px"}}>
      <button className="btn btn-g" onClick={onHome} style={{marginBottom:28}}>← Volver al inicio</button>
      <h1 style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:32,fontWeight:400,marginBottom:8}}>{title}</h1>
      <p style={{fontSize:13,color:"var(--ink3)",marginBottom:32}}>Última actualización: marzo 2026</p>
      <div className="legal-content">{children}</div>
    </div>
  </div>
}

function PrivacyPolicy({onHome}){
  return<LegalPage title="Política de privacidad" onHome={onHome}>
    <h2>1. Responsable del tratamiento</h2>
    <p>SP Financial Advisory LLC, con domicilio en 1209 Mountain Road Place Northeast, Albuquerque, NM 87110, United States (en adelante, "el Responsable"), es la entidad responsable del tratamiento de los datos personales recogidos a través del sitio web valoratuempresa.es.</p>
    <p>Email de contacto: info@valoratuempresa.es</p>

    <h2>2. Datos que recogemos</h2>
    <p>A través de nuestro servicio de valoración de empresas, podemos recoger las siguientes categorías de datos:</p>
    <p><strong>Datos de la empresa:</strong> nombre, sector, provincia, año de fundación, número de empleados.</p>
    <p><strong>Datos financieros:</strong> facturación, resultado de explotación, amortización, deuda financiera, caja, inversión anual y datos de ejercicios anteriores.</p>
    <p><strong>Datos cualitativos:</strong> respuestas al cuestionario de análisis cualitativo (recurrencia, concentración de clientes, equipo directivo, etc.).</p>
    <p><strong>Datos de contacto:</strong> dirección de email (cuando el usuario la proporciona voluntariamente para recibir comunicaciones).</p>
    <p><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo, páginas visitadas y duración de la visita, recogidos automáticamente mediante cookies y tecnologías similares.</p>

    <h2>3. Finalidad del tratamiento</h2>
    <p>Los datos recogidos se utilizan exclusivamente para las siguientes finalidades:</p>
    <p>• Generar la valoración indicativa de la empresa del usuario.</p>
    <p>• Elaborar y entregar el informe de valoración contratado.</p>
    <p>• Gestionar el proceso de pago y facturación.</p>
    <p>• Enviar comunicaciones relacionadas con el servicio contratado.</p>
    <p>• Mejorar nuestro servicio y la experiencia del usuario mediante análisis estadísticos agregados.</p>

    <h2>4. Base legal del tratamiento</h2>
    <p>El tratamiento de los datos se basa en:</p>
    <p>• <strong>Ejecución de un contrato:</strong> el tratamiento es necesario para prestar el servicio de valoración solicitado por el usuario.</p>
    <p>• <strong>Consentimiento:</strong> para el envío de comunicaciones comerciales y el uso de cookies no esenciales.</p>
    <p>• <strong>Interés legítimo:</strong> para la mejora del servicio y la prevención del fraude.</p>

    <h2>5. Conservación de los datos</h2>
    <p>Los datos financieros introducidos por el usuario se conservarán durante un máximo de 30 días desde la última actividad del usuario, salvo que exista una relación contractual vigente. Los datos asociados a informes adquiridos se conservarán durante el período legalmente exigido para obligaciones fiscales y contables.</p>

    <h2>6. Comunicación de datos a terceros</h2>
    <p>No compartimos datos personales ni financieros con terceros, salvo en los siguientes casos:</p>
    <p>• <strong>Proveedores de servicios de pago:</strong> Stripe, Inc. procesa los datos de pago necesarios para completar la transacción. Stripe actúa como responsable independiente del tratamiento de los datos de pago.</p>
    <p>• <strong>Proveedores de hosting:</strong> Vercel, Inc. aloja nuestra plataforma.</p>
    <p>• <strong>Obligación legal:</strong> cuando sea requerido por ley o por una autoridad judicial o administrativa competente.</p>

    <h2>7. Transferencias internacionales</h2>
    <p>Dado que SP Financial Advisory LLC tiene su sede en Estados Unidos, los datos podrán ser transferidos y tratados en Estados Unidos. Estas transferencias se realizan con las garantías adecuadas, incluyendo las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea y el cumplimiento del marco EU-US Data Privacy Framework, cuando sea aplicable.</p>

    <h2>8. Derechos del usuario (RGPD)</h2>
    <p>Aunque SP Financial Advisory LLC está constituida en Estados Unidos, al dirigir sus servicios a usuarios en el Espacio Económico Europeo, cumple con el Reglamento General de Protección de Datos (RGPD). Como usuario, tienes derecho a:</p>
    <p>• <strong>Acceso:</strong> solicitar una copia de tus datos personales.</p>
    <p>• <strong>Rectificación:</strong> corregir datos inexactos o incompletos.</p>
    <p>• <strong>Supresión:</strong> solicitar la eliminación de tus datos ("derecho al olvido").</p>
    <p>• <strong>Limitación:</strong> solicitar la restricción del tratamiento de tus datos.</p>
    <p>• <strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</p>
    <p>• <strong>Oposición:</strong> oponerte al tratamiento de tus datos en determinadas circunstancias.</p>
    <p>Para ejercer cualquiera de estos derechos, envía un email a info@valoratuempresa.es. Responderemos en un plazo máximo de 30 días.</p>
    <p>Asimismo, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si consideras que el tratamiento de tus datos no se ajusta a la normativa vigente.</p>

    <h2>9. Cookies</h2>
    <p>Nuestro sitio web utiliza cookies propias y de terceros con las siguientes finalidades:</p>
    <p>• <strong>Cookies técnicas (esenciales):</strong> necesarias para el funcionamiento del sitio web y del servicio de valoración.</p>
    <p>• <strong>Cookies analíticas:</strong> utilizamos Google Analytics para analizar el uso del sitio web de forma agregada. Puedes consultar la política de privacidad de Google en policies.google.com/privacy.</p>
    <p>• <strong>Cookies de pago:</strong> Stripe utiliza cookies para procesar los pagos de forma segura.</p>
    <p>Puedes configurar tu navegador para rechazar cookies o para que te avise cuando se envíen. Ten en cuenta que si desactivas las cookies esenciales, es posible que algunas funcionalidades del sitio no estén disponibles.</p>

    <h2>10. Seguridad</h2>
    <p>Adoptamos medidas técnicas y organizativas adecuadas para proteger los datos personales contra el acceso no autorizado, la pérdida, la destrucción o la alteración. Toda la comunicación entre tu navegador y nuestro servidor se realiza mediante protocolo HTTPS con cifrado TLS.</p>

    <h2>11. Modificaciones</h2>
    <p>Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. Cualquier cambio será publicado en esta página con la fecha de última actualización.</p>
  </LegalPage>
}

function LegalNotice({onHome}){
  return<LegalPage title="Aviso legal" onHome={onHome}>
    <h2>1. Datos identificativos</h2>
    <p>En cumplimiento del deber de información, se facilitan los siguientes datos del titular del sitio web:</p>
    <p><strong>Titular:</strong> SP Financial Advisory LLC</p>
    <p><strong>Domicilio:</strong> 1209 Mountain Road Place Northeast, Albuquerque, NM 87110, United States</p>
    <p><strong>Email de contacto:</strong> info@valoratuempresa.es</p>
    <p><strong>Sitio web:</strong> valoratuempresa.es</p>

    <h2>2. Objeto del sitio web</h2>
    <p>El sitio web valoratuempresa.es tiene como finalidad ofrecer un servicio de valoración indicativa de empresas dirigido principalmente a pequeñas y medianas empresas (PYMEs) en España. El servicio incluye la generación de estimaciones de valor basadas en metodologías de valoración estándar (múltiplos de mercado, descuento de flujos de caja y análisis cualitativo).</p>

    <h2>3. Naturaleza del servicio</h2>
    <p>Las valoraciones proporcionadas por valoratuempresa.es tienen carácter exclusivamente indicativo y orientativo. En ningún caso constituyen:</p>
    <p>• Asesoramiento financiero, fiscal, legal o de inversión.</p>
    <p>• Una valoración pericial con validez legal o vinculante.</p>
    <p>• Una recomendación de compra, venta o cualquier otra operación corporativa.</p>
    <p>• Una auditoría o verificación de los datos financieros proporcionados por el usuario.</p>
    <p>El usuario es el único responsable de la veracidad y exactitud de los datos introducidos en la plataforma. SP Financial Advisory LLC no verifica la información proporcionada por los usuarios.</p>

    <h2>4. Limitación de responsabilidad</h2>
    <p>SP Financial Advisory LLC no se responsabiliza de:</p>
    <p>• Las decisiones tomadas por los usuarios basándose en los resultados de la valoración.</p>
    <p>• Los daños o perjuicios de cualquier naturaleza que puedan derivarse del uso de la información proporcionada.</p>
    <p>• La exactitud de los resultados, que dependen de la calidad de los datos introducidos y de las condiciones del mercado.</p>
    <p>• Las interrupciones del servicio, errores técnicos o fallos de seguridad ajenos a su control.</p>
    <p>Para la toma de decisiones de inversión, compraventa de empresas, procesos judiciales o cualquier otra actuación con implicaciones legales o financieras, se recomienda encarecidamente contratar los servicios de un asesor profesional cualificado.</p>

    <h2>5. Propiedad intelectual e industrial</h2>
    <p>Todos los contenidos del sitio web (textos, diseños, logotipos, código fuente, metodologías, algoritmos, gráficos y elementos multimedia) son propiedad de SP Financial Advisory LLC o de sus licenciantes, y están protegidos por las leyes de propiedad intelectual e industrial aplicables.</p>
    <p>Queda prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación de los contenidos del sitio web sin la autorización expresa y por escrito de SP Financial Advisory LLC.</p>

    <h2>6. Legislación aplicable y jurisdicción</h2>
    <p>Las presentes condiciones se rigen por la legislación aplicable al usuario según su lugar de residencia. Para usuarios residentes en España o en el Espacio Económico Europeo, se aplicarán las normas de protección del consumidor de su jurisdicción, incluyendo el Reglamento General de Protección de Datos (RGPD).</p>
    <p>Para la resolución de cualquier controversia, las partes se someterán a los juzgados y tribunales competentes según la legislación aplicable al consumidor.</p>

    <h2>7. Modificaciones</h2>
    <p>SP Financial Advisory LLC se reserva el derecho de modificar el presente aviso legal en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el sitio web.</p>
  </LegalPage>
}

// ─── MAIN ────────────────────────────────────────────────────
export default function App(){
  const[view,setView]=useState("landing");const pricingRef=useRef(null);
  const[returnPlan,setReturnPlan]=useState(null);
  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    const payment=p.get("payment");
    const plan=p.get("plan");
    if(payment==="success"&&plan){
      setReturnPlan(plan);
      setView("app");
      window.history.replaceState({},"","/");
      window.scrollTo({top:0,behavior:"smooth"});
    }
    if(payment==="cancelled"){
      window.history.replaceState({},"","/");
    }
  },[]);
  const handleStart=()=>{setView("app");window.scrollTo({top:0,behavior:"smooth"})};
  const handleHome=()=>{setView("landing");window.scrollTo({top:0,behavior:"smooth"})};
  const scrollTo=(id)=>{if(view!=="landing"){setView("landing");setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"}),100)}else document.getElementById(id)?.scrollIntoView({behavior:"smooth"})};
  const goPrivacy=()=>{setView("privacy");window.scrollTo({top:0,behavior:"smooth"})};
  useEffect(()=>{const h=e=>{if(e.detail==="privacy")goPrivacy();if(e.detail==="legal")goLegal();};window.addEventListener("vte:navigate",h);return()=>window.removeEventListener("vte:navigate",h);},[]);
  const goLegal=()=>{setView("legal");window.scrollTo({top:0,behavior:"smooth"})};
  return<>
    <nav className="nav"><a className="nav-logo" onClick={handleHome}>valora<span>tuempresa</span>.es</a><div className="nav-links">{view==="landing"&&<><button className="nav-lk" onClick={()=>scrollTo("situaciones")}>Situaciones frecuentes</button><button className="nav-lk" onClick={()=>scrollTo("como")}>Cómo funciona</button><button className="nav-lk" onClick={()=>scrollTo("precios")}>Precios</button><button className="nav-lk" onClick={()=>scrollTo("faq")}>FAQ</button></>}<button className="nav-cta" onClick={handleStart}>Valorar mi empresa</button></div></nav>
    {view==="landing"?<><LandingPage onStart={handleStart} scrollToRef={pricingRef}/><footer className="footer"><div style={{marginBottom:6}}><span style={{fontWeight:800,color:"var(--ink)"}}>valora<span style={{color:"var(--blue)"}}>tuempresa</span>.es</span></div>© 2026 SP Financial Advisory LLC · <a href="#" onClick={e=>{e.preventDefault();goPrivacy()}}>Política de privacidad</a> · <a href="#" onClick={e=>{e.preventDefault();goLegal()}}>Aviso legal</a></footer></>
    :view==="privacy"?<PrivacyPolicy onHome={handleHome}/>
    :view==="legal"?<LegalNotice onHome={handleHome}/>
    :<ValuationApp onHome={handleHome} returnPlan={returnPlan}/>}
  </>
}
