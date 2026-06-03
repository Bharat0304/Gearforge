"use client";
export default function Footer() {
  return (
    <footer style={{ padding: "60px 40px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "var(--bg2)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>Gearforge</div>
          <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7, maxWidth: 260 }}>The AI workspace for production-ready 3D asset generation. Built for creators who ship.</p>
        </div>
        {[
          { title: "Product", links: ["Features", "Pricing", "Changelog", "API Docs"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
          { title: "Legal", links: ["Privacy", "Terms", "Security"] },
        ].map((col, i) => (
          <div key={i}>
            <div style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 16 }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((l) => (
                <a key={l} href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, textDecoration: "none", transition: "color .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                >{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>© 2025 Gearforge Inc. All rights reserved.</div>
        <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Made for creators ⟡</div>
      </div>
    </footer>
  );
}
