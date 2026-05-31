"use client";

const LOGOS = ["Tencent Games","NetEase","Bambu Lab","HTC","SONY","Haier","replit","stability.ai","Autodesk","Unity","Epic","Valve"];

export default function LogoBar() {
  return (
    <div style={{
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "32px 0",
      overflow: "hidden",
      position: "relative",
      background: "var(--bg-2)",
    }}>
      <div style={{
        fontSize: "9px", letterSpacing: "0.2em",
        textTransform: "uppercase", color: "var(--text-3)",
        textAlign: "center", marginBottom: "24px",
        fontFamily: "var(--font-mono)",
      }}>Trusted by the world's best teams</div>

      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          display: "flex", gap: "72px", animation: "scroll 28s linear infinite",
          width: "max-content",
        }}>
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <span key={i} style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "13px", color: "var(--text-3)",
              letterSpacing: "0.06em", whiteSpace: "nowrap",
              textTransform: "uppercase",
              transition: "color 0.3s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
            >{logo}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
