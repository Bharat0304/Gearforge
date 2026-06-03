"use client";
const STEPS = [
  { n: "01", t: "Describe or Upload", d: "Type a prompt, upload an image, or drag in a sketch. Our AI understands any input format." },
  { n: "02", t: "AI Generates", d: "Our pipeline processes your input through neural geometry synthesis in under 8 seconds." },
  { n: "03", t: "Refine & Edit", d: "Tweak materials, scale, poly count, and topology with intelligent in-context editing tools." },
  { n: "04", t: "Export & Deploy", d: "One-click export to your preferred format and push directly to your game engine or DCC." },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "100px 40px", background: "var(--bg2)" }}>
      <div style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--red)", marginBottom: 20 }}>// Workflow</div>
      <h2 style={{ fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 800, lineHeight: .88, letterSpacing: "-.025em" }}>
        How it<br /><em style={{ fontFamily: "var(--fs)", fontStyle: "italic", fontWeight: 400 }}>works.</em>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 56 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{
            padding: "40px 28px 40px 0",
            borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}>
            <div style={{ fontFamily: "var(--fm)", fontSize: 64, fontWeight: 300, color: "rgba(255,255,255,0.06)", lineHeight: 1, marginBottom: 20 }}>{s.n}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: "-.01em" }}>{s.t}</div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
