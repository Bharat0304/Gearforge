"use client";
const TESTI = [
  { q: "Gearforge cut our asset pipeline from weeks to hours. The quality is genuinely production-ready.", name: "Alex Chen", role: "3D Artist · Riot Games" },
  { q: "I used to spend 3 days on hero props. Now I iterate 10 concepts in an afternoon. Game changer.", name: "Maria Santos", role: "Indie Dev · Solo Studio" },
  { q: "The PBR output is exceptional. With minor tweaks it goes straight into our look-dev pipeline.", name: "James Wright", role: "VFX Lead · ILM" },
  { q: "The sketch-to-3D pipeline is magic. Our concept artists finally have a direct path to production.", name: "Yuna Park", role: "Art Director · NEXON" },
];

export default function Testimonials() {
  return (
    <section style={{ padding: "100px 40px" }}>
      <div style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--red)", marginBottom: 20 }}>// Creators Say</div>
      <h2 style={{ fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 800, lineHeight: .88, letterSpacing: "-.025em" }}>
        Loved by<br /><em style={{ fontFamily: "var(--fs)", fontStyle: "italic", fontWeight: 400 }}>creators.</em>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid rgba(255,255,255,0.06)", marginTop: 56 }}>
        {TESTI.map((t, i) => (
          <div key={i} style={{
            padding: "44px 40px",
            borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
            borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}>
            <p style={{ fontFamily: "var(--fs)", fontSize: 19, fontStyle: "italic", lineHeight: 1.6, color: "var(--text2)", marginBottom: 28 }}>"{t.q}"</p>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--text3)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 3 }}>{t.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
