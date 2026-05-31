"use client";

const LINKS = {
  Product: ["Text to 3D", "Image to 3D", "Sketch to 3D", "CAD Tools", "Physics Engine", "Pricing"],
  Developers: ["API Reference", "SDK", "Webhooks", "Status", "Changelog"],
  Company: ["About", "Blog", "Careers", "Privacy", "Terms"],
};

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-2)",
      borderTop: "1px solid var(--border-2)",
    }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "72px 64px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "64px" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{
                width: 26, height: 26,
                background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 800, letterSpacing: "0.1em", color: "var(--text)" }}>GEARFORGE</span>
            </div>
            <p style={{ color: "var(--text-3)", fontSize: "13px", lineHeight: 1.7, maxWidth: "240px" }}>
              The AI-native 3D design platform. From idea to production asset in seconds.
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
              {["𝕏", "gh", "in"].map((icon, i) => (
                <div key={i} style={{
                  width: "32px", height: "32px",
                  border: "1px solid var(--border-2)",
                  borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-3)", fontSize: "12px", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "var(--font-mono)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
                }}
                >{icon}</div>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "9px",
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--accent)", marginBottom: "20px",
              }}>{group}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {links.map(link => (
                  <a key={link} href="#" style={{
                    color: "var(--text-3)", textDecoration: "none",
                    fontSize: "13px", transition: "color 0.2s",
                    fontFamily: "var(--font-display)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
                  >{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: "1px", background: "var(--border)", marginBottom: "28px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.04em" }}>
            © 2026 Gearforge Technologies, Inc.
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent)", opacity: 0.5, letterSpacing: "0.06em" }}>
            MADE FOR BUILDERS, BY BUILDERS
          </span>
        </div>
      </div>
    </footer>
  );
}
