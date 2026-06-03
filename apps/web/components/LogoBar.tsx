"use client";
export default function LogoBar() {
  const logos = ["RIOT GAMES", "ILM", "NEXON", "EPIC GAMES", "AUTODESK", "UNITY", "BLIZZARD", "UBISOFT", "CD PROJEKT", "ROCKSTAR"];
  const doubled = [...logos, ...logos];
  return (
    <div style={{ padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 60, width: "max-content", animation: "marquee 22s linear infinite" }}>
        {doubled.map((l, i) => (
          <span key={i} style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".2em", color: "var(--text3)", whiteSpace: "nowrap", textTransform: "uppercase" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}
