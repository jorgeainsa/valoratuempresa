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
  {q:"¿Cuánto tiempo tarda?",a:"El Informe Esencial se genera automáticamente (unos 15 minutos). El Profesional tarda 24-48h porque incluye revisión por un analista."},
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
  return<div style={{position:"relative"}}><input type="text" inputMode="numeric" placeholder={placeholder} value={value||""} onChange={e=>{onChange(e.target.value.replace(/[^0-9]/g,""))}} style={{paddingRight:32}}/><span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"var(--ink3)",fontWeight:600,pointerEvents:"none"}}>€</span></div>
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
      <div className="pcard"><div className="p-name">Informe Profesional</div><div className="p-amt">299€ <span>+ IVA</span></div><div className="p-desc">Análisis en profundidad con revisión por un analista experto.</div><div className="p-feats"><div className="p-feat"><Ck/> Todo lo del plan Esencial</div><div className="p-feat"><Ck/> Benchmarking sectorial</div><div className="p-feat"><Ck/> Análisis de sensibilidad</div><div className="p-feat"><Ck/> Revisión por analista experto</div><div className="p-feat"><Ck/> Entrega en 24-48h</div></div><button className="p-btn p-btn-o" onClick={onStart}>Obtener informe profesional</button></div>
    </div></Anim></section>
    <section className="sec-fw"><div className="sec-fw-inner"><Anim><div className="sec-l" style={{textAlign:"center"}}>Testimonios</div><h2 className="sec-t" style={{textAlign:"center"}}>Lo que dicen nuestros clientes</h2><p className="sec-sub" style={{textAlign:"center",margin:"0 auto 44px"}}>Empresarios y asesores que ya han utilizado nuestro servicio.</p></Anim><Anim><div className="tgrid">{TESTIMONIALS.map((t,i)=><div className="tcard" key={i}><div className="t-stars">★★★★★</div><div className="t-text">&ldquo;{t.text}&rdquo;</div><div className="t-auth">{t.author}</div><div className="t-role">{t.role}</div></div>)}</div></Anim></div></section>
    <section className="sec sec-c" id="faq"><Anim><div className="sec-l">Preguntas frecuentes</div><h2 className="sec-t">¿Tienes dudas?</h2><p className="sec-sub">Las respuestas a las preguntas que más nos hacen.</p></Anim><Anim><div className="faq-list">{FAQS.map((f,i)=><FAQ key={i} item={f}/>)}</div></Anim></section>
    <Anim><div className="cta-ban"><h2>¿Listo para saber cuánto vale tu empresa?</h2><p>Empieza gratis y obtén una estimación en menos de 15 minutos.</p><button className="cta-btn2" onClick={onStart}>Obtener mi valoración →</button></div></Anim>
  </>
}

// ─── APP STEPS ───────────────────────────────────────────────
const APP_STEPS=[{id:"company",label:"Empresa"},{id:"financials",label:"Financieros"},{id:"qualitative",label:"Cualitativo"},{id:"results",label:"Resultado"}];

function StepCompany({data,onChange}){return<div className="fade-in"><h2 className="app-title">Tu empresa</h2><p className="app-sub">Información básica sobre la compañía para contextualizar la valoración.</p><div className="fgrid"><div className="fld fw"><label>Nombre de la empresa</label><input type="text" placeholder="Ej: Tech Solutions SL" value={data.name||""} onChange={e=>onChange("name",e.target.value)}/></div><div className="fld fw"><label>Sector</label><select value={data.sector||""} onChange={e=>onChange("sector",e.target.value)}><option value="">Selecciona un sector</option>{SECTORS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div><div className="fld"><label>Año de fundación</label><input type="number" placeholder="Ej: 2010" value={data.founded||""} onChange={e=>onChange("founded",e.target.value)}/></div><div className="fld"><label>Número de empleados</label><input type="number" placeholder="Ej: 45" value={data.employees||""} onChange={e=>onChange("employees",e.target.value)}/></div><div className="fld fw"><label>Provincia</label><input type="text" placeholder="Ej: Barcelona" value={data.province||""} onChange={e=>onChange("province",e.target.value)}/></div></div></div>}

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

function StepResults({data,onBack,onHome}){
  const r=runValuation(data);if(!r)return<p>Error en los datos. Vuelve atrás para corregir.</p>;
  const scoreColor=r.qualScore>70?"var(--green)":r.qualScore>40?"var(--blue)":"var(--amber)";
  const qualDetails=QUAL_QUESTIONS.map(q=>{const val=(data.qualAnswers||{})[q.id];const score=val!==undefined?((val+1)/5)*100:0;return{label:q.label,score:Math.round(score),color:score>=70?"var(--green)":score>=40?"var(--blue)":"var(--amber)"}});
  return<div className="fade-in">
    <h2 className="app-title">Resultado de la valoración</h2>
    <p className="app-sub">{data.name||"Tu empresa"} · {r.sector.label}</p>
    <div className="r-hero"><div className="r-hero-l">Equity Value estimado</div><div className="r-hero-v">{fmtM(r.eqBlended)}</div><div className="r-hero-rng">Rango: {fmtM(r.eqLow)} – {fmtM(r.eqHigh)}</div></div>
    <div className="r-grid">
      <div className="r-card"><div className="r-card-t">Enterprise Value</div><div className="r-card-v">{fmtM(r.evBlended)}</div><div className="r-card-d">Antes de deducir deuda</div></div>
      <div className="r-card"><div className="r-card-t">Deuda Financiera Neta</div><div className="r-card-v">{fmtM(r.dfn)}</div><div className="r-card-d">{r.dfn>0?"Se deduce del EV":"Caja neta — suma al EV"}</div></div>
      <div className="r-card"><div className="r-card-t">Múltiplo aplicado</div><div className="r-card-v">{r.selectedMult.toFixed(1)}x</div><div className="r-card-d">EV/EBITDA · Base: {r.baseMultiple.toFixed(1)}x, ajuste: {r.sizeAdj>=0?"+":""}{(r.sizeAdj*100).toFixed(0)}%</div></div>
      <div className="r-card"><div className="r-card-t">Quality Score</div><div className="r-card-v" style={{color:scoreColor}}>{r.qualScore}/100</div><div className="r-card-d">Percentil {Math.round(r.percentile*100)} del rango</div></div>
    </div>
    <div className="paywall"><h3>Desbloquea el informe completo</h3><p>Obtén el PDF profesional con el desglose por metodología, Quality Score detallado, benchmarking sectorial y recomendaciones.</p><div className="paywall-btns"><button className="pw-btn pw-btn-p" onClick={()=>alert("Estamos en fase de lanzamiento. Próximamente podrás descargar tu informe.")}>Informe Esencial · 149€ + IVA</button><button className="pw-btn pw-btn-o" onClick={()=>alert("Estamos en fase de lanzamiento. Próximamente podrás descargar tu informe.")}>Informe Profesional · 299€ + IVA</button></div></div>
    <div className="r-sec"><h3>Desglose por metodología (vista previa)</h3><table className="m-tbl"><thead><tr><th>Método</th><th>Enterprise Value</th><th>Equity Value</th><th>Peso</th></tr></thead><tbody><tr><td>Múltiplos comparables</td><td>{fmtM(r.evMultiples)}</td><td>{fmtM(r.eqMultiples)}</td><td>60%</td></tr><tr><td>DCF simplificado</td><td>{fmtM(r.evDcf)}</td><td>{fmtM(r.eqDcf)}</td><td>20%</td></tr><tr><td>Ajuste cualitativo</td><td colSpan="2" style={{textAlign:"center"}}>Score {r.qualScore}/100</td><td>20%</td></tr><tr><td>Valoración ponderada</td><td>{fmtM(r.evBlended)}</td><td>{fmtM(r.eqBlended)}</td><td>100%</td></tr></tbody></table></div>
    <div className="r-sec"><h3>Quality Score · Desglose</h3><div>{qualDetails.map((d,i)=><div className="sc-row" key={i}><span className="sc-lbl">{d.label}</span><div className="sc-bg"><div className="sc-fill" style={{width:d.score+"%",background:d.color}}/></div><span className="sc-val">{d.score}</span></div>)}</div></div>
    <div className="discl"><strong>Aviso legal:</strong> Esta valoración tiene carácter indicativo y orientativo.</div>
    <div className="btn-row"><button className="btn btn-g" onClick={onBack}>← Modificar datos</button><button className="btn btn-g" onClick={onHome}>Volver al inicio</button></div>
  </div>
}

// ─── APP WRAPPER ─────────────────────────────────────────────
function ValuationApp({onHome}){
  const[step,setStep]=useState(0);const[data,setData]=useState({qualAnswers:{}});const topRef=useRef(null);
  const onChange=(k,v)=>setData(d=>({...d,[k]:v}));
  const canNext=()=>{if(step===0)return data.sector;if(step===1)return data.revenue&&data.resExplotacion;if(step===2)return Object.keys(data.qualAnswers||{}).length>=5;return false};
  const go=(dir)=>{setStep(s=>s+dir);topRef.current?.scrollIntoView({behavior:"smooth"})};
  return<div className="app-overlay"><div ref={topRef}/>
    <div className="app-hdr"><div className="app-hdr-inner"><div className="app-hdr-left"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg><span className="app-hdr-title">Herramienta de valoración</span></div><div className="app-hdr-right">Paso {step+1} de {APP_STEPS.length} · <strong>{APP_STEPS[step].label}</strong></div></div><div className="app-hdr-prog"><div className="app-hdr-bar" style={{width:`${((step+1)/APP_STEPS.length)*100}%`}}/></div></div>
    <div className="app-main">
      {step===0&&<StepCompany data={data} onChange={onChange}/>}
      {step===1&&<StepFinancials data={data} onChange={onChange}/>}
      {step===2&&<StepQualitative data={data} onChange={onChange}/>}
      {step===3&&<StepResults data={data} onBack={()=>go(-1)} onHome={onHome}/>}
      {step<3&&<div className="btn-row">{step>0?<button className="btn btn-g" onClick={()=>go(-1)}>← Atrás</button>:<button className="btn btn-g" onClick={onHome}>← Volver al inicio</button>}<button className="btn btn-p" disabled={!canNext()} onClick={()=>go(1)}>{step===2?"Ver valoración →":"Siguiente →"}</button></div>}
    </div>
  </div>
}

// ─── MAIN ────────────────────────────────────────────────────
export default function App(){
  const[view,setView]=useState("landing");const pricingRef=useRef(null);
  const handleStart=()=>{setView("app");window.scrollTo({top:0,behavior:"smooth"})};
  const handleHome=()=>{setView("landing");window.scrollTo({top:0,behavior:"smooth"})};
  const scrollTo=(id)=>{if(view!=="landing"){setView("landing");setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"}),100)}else document.getElementById(id)?.scrollIntoView({behavior:"smooth"})};
  return<>
    <nav className="nav"><a className="nav-logo" onClick={handleHome}>valora<span>tuempresa</span>.es</a><div className="nav-links">{view==="landing"&&<><button className="nav-lk" onClick={()=>scrollTo("situaciones")}>Situaciones frecuentes</button><button className="nav-lk" onClick={()=>scrollTo("como")}>Cómo funciona</button><button className="nav-lk" onClick={()=>scrollTo("precios")}>Precios</button><button className="nav-lk" onClick={()=>scrollTo("faq")}>FAQ</button></>}<button className="nav-cta" onClick={handleStart}>Valorar mi empresa</button></div></nav>
    {view==="landing"?<><LandingPage onStart={handleStart} scrollToRef={pricingRef}/><footer className="footer"><div style={{marginBottom:6}}><span style={{fontWeight:800,color:"var(--ink)"}}>valora<span style={{color:"var(--blue)"}}>tuempresa</span>.es</span></div>© 2026 SP Financial Advisory LLC · <a href="#">Política de privacidad</a> · <a href="#">Aviso legal</a></footer></>:<ValuationApp onHome={handleHome}/>}
  </>
}
