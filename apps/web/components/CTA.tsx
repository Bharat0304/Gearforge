"use client";
import Link from "next/link";

export default function CTA() {
  return (
    <section style={{ padding: "120px 40px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(255,68,34,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <h2 style={{ fontSize: "clamp(56px,8vw,112px)", fontWeight: 800, lineHeight: .84, letterSpacing: "-.025em", marginBottom: 40, position: "relative" }}>
        Ready to<br />
        <em style={{ fontFamily: "var(--fs)", fontStyle: "italic", fontWeight: 400, color: "var(--red)" }}>forge?</em>
      </h2>
      <p style={{ fontSize: 17, color: "var(--text2)", marginBottom: 40, position: "relative" }}>Join 80,000+ creators building the next generation of 3D content.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", position: "relative" }}>
        <Link href="/signup" style={{
          padding: "14px 32px", background: "var(--red)", color: "#fff",
          fontSize: 13, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
          textDecoration: "none", transition: "all .2s",
        }}>Start for Free</Link>
        <Link href="/signin" style={{
          padding: "13px 28px", background: "transparent", color: "var(--text)",
          border: "1px solid rgba(255,255,255,0.18)", fontSize: 13, fontWeight: 600,
          textDecoration: "none", transition: "all .2s",
        }}>Sign In</Link>
      </div>
    </section>
  );
}
