"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("vte_cookies")) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("vte_cookies", "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("vte_cookies", "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "#0f1b2d", borderTop: "1px solid rgba(255,255,255,0.1)",
      padding: "16px 24px", display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: 16, flexWrap: "wrap",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
    }}>
      <p style={{
        margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)",
        lineHeight: 1.5, flex: "1 1 300px", maxWidth: 680,
      }}>
        Usamos cookies propias y de terceros (Google Analytics, Stripe) para analizar el uso del sitio y procesar pagos de forma segura.{" "}
        <a href="#" onClick={e => { e.preventDefault(); }} style={{ color: "#60a5fa", textDecoration: "underline" }}>
          Política de cookies
        </a>
      </p>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button onClick={reject} style={{
          padding: "8px 18px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)",
          background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: 13,
          cursor: "pointer", fontWeight: 500,
        }}>
          Solo esenciales
        </button>
        <button onClick={accept} style={{
          padding: "8px 18px", borderRadius: 6, border: "none",
          background: "#2563eb", color: "#fff", fontSize: 13,
          cursor: "pointer", fontWeight: 600,
        }}>
          Aceptar todas
        </button>
      </div>
    </div>
  );
}
