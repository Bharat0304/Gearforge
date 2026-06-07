"use client";
import { useState, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface VerifyResult {
  passed: boolean;
  score: number;
  summary: string;
  completedItems: string[];
  missingParts: string[];
  incorrectParts: string[];
  feedback: string[];
  nextAction: string;
  readyForNextStep: boolean;
}

// ─── Mock AI verification (replace with real API call) ───────────────────────
async function runVerification(
  imageFile: File,
  prompt: string,
  generationStage: string
): Promise<VerifyResult> {
  // Simulate API latency
  await new Promise(r => setTimeout(r, 1800 + Math.random() * 800));

  // --- REPLACE THIS BLOCK with your real backend call ---
  // const form = new FormData();
  // form.append("image", imageFile);
  // const uploadRes = await fetch("http://localhost:3000/api/v1/upload", { method: "POST", body: form, headers: { Authorization: "Bearer <token>" } });
  // const uploadData = await uploadRes.json();
  // const verifyRes = await fetch("http://localhost:3000/api/v1/verify", { 
  //   method: "POST", 
  //   headers: { "Content-Type": "application/json", Authorization: "Bearer <token>" },
  //   body: JSON.stringify({ id: "<generation_id>", step: generationStage, filepath: uploadData.filepath })
  // });
  // const verifyData = await verifyRes.json();
  // return JSON.parse(verifyData.response.choices[0].message.content);
  // ------------------------------------------------------

  // Deterministic mock based on filename seed
  const seed = imageFile.name.length + prompt.length;
  const score = Math.min(98, 42 + (seed % 50) + Math.floor(Math.random() * 20));
  const passed = score >= 70;

  return {
    passed,
    score,
    summary: passed 
      ? "Assembly is progressing correctly." 
      : "Assembly is progressing correctly but remains incomplete.",
    completedItems: [
      "Frame assembled",
      "Landing gear installed"
    ],
    missingParts: passed ? [] : [
      "1 Brushless Motor",
      "GPS Module"
    ],
    incorrectParts: [],
    feedback: [
      "The frame appears correctly assembled.",
      "Three motors are visible.",
      "GPS module is not visible."
    ],
    nextAction: passed ? "Proceed to the next step." : "Install the remaining motor and GPS module.",
    readyForNextStep: passed
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = passed ? "#22c55e" : "#ffaa00";

  return (
    <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
      <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <circle
          cx="55" cy="55" r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>
          score
        </span>
      </div>
    </div>
  );
}

// ─── Main VerifyPanel ─────────────────────────────────────────────────────────
interface VerifyPanelProps {
  currentPrompt?: string;
  currentStage?: string;
}

export default function VerifyPanel({
  currentPrompt = "",
  currentStage = "Render Complete",
}: VerifyPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(currentPrompt);
  const [stage, setStage] = useState(currentStage);
  const [status, setStatus] = useState<"idle" | "verifying" | "done" | "error">("idle");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [activeTab, setActiveTab] = useState<"feedback" | "parts">("feedback");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setStatus("idle");
    setResult(null);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onVerify = async () => {
    if (!imageFile || !prompt.trim()) return;
    setStatus("verifying");
    setResult(null);
    try {
      const res = await runVerification(imageFile, prompt, stage);
      setResult(res);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const statusColor = result
    ? result.passed ? "#22c55e" : "#ffaa00"
    : "var(--accent)";

  const statusLabel = result
    ? result.passed ? "✓ Passed" : "⚠ Needs Attention"
    : "";

  return (
    <>
      {/* ── Inject keyframes ── */}
      <style>{`
        @keyframes verifyFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes verifySpinner { to { transform: rotate(360deg); } }
        @keyframes verifyPulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
        @keyframes scanLine {
          0%   { top: 0; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* ── Trigger Button ── */}
      <button
        onClick={() => setIsOpen(true)}
        title="Verify render against prompt"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 14px",
          background: "var(--surface)",
          border: "1px solid var(--border-2)",
          borderRadius: 8,
          color: "var(--accent-2)",
          fontFamily: "var(--font-mono)",
          fontSize: 11, fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.18s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "var(--accent-2)";
          e.currentTarget.style.background = "rgba(255,170,0,0.06)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "var(--border-2)";
          e.currentTarget.style.background = "var(--surface)";
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.8"/>
        </svg>
        Verify Render
      </button>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 900,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            animation: "verifyFadeIn 0.2s ease",
          }}
        />
      )}

      {/* ── Panel ── */}
      {isOpen && (
        <div style={{
          position: "fixed",
          top: 0, right: 0, bottom: 0,
          width: "clamp(340px, 38vw, 520px)",
          zIndex: 950,
          background: "var(--bg-2)",
          borderLeft: "1px solid var(--border-2)",
          display: "flex", flexDirection: "column",
          animation: "verifyFadeIn 0.28s cubic-bezier(.2,0,.2,1)",
          overflow: "hidden",
        }}>

          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28,
                background: "rgba(255,170,0,0.1)",
                border: "1px solid rgba(255,170,0,0.3)",
                borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>
                  Render Verification
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1 }}>
                  AI-powered direction check
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 4, display: "flex" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>

            {/* Upload zone */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                style={{
                  border: `1.5px dashed ${dragOver ? "var(--accent-2)" : imageUrl ? "var(--border-2)" : "var(--border-2)"}`,
                  borderRadius: 10,
                  padding: imageUrl ? 0 : "28px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragOver ? "rgba(255,170,0,0.04)" : "var(--surface)",
                  transition: "all 0.18s",
                  overflow: "hidden",
                  position: "relative",
                  minHeight: imageUrl ? 160 : "auto",
                }}
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Upload preview"
                      style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }}
                    />
                    {/* Scan line animation while verifying */}
                    {status === "verifying" && (
                      <div style={{
                        position: "absolute", left: 0, right: 0, height: 2,
                        background: "linear-gradient(90deg, transparent, var(--accent-2), transparent)",
                        animation: "scanLine 1.4s linear infinite",
                      }} />
                    )}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(12,11,9,0.7) 0%, transparent 50%)",
                      display: "flex", alignItems: "flex-end", padding: 12,
                    }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>
                        {imageFile?.name} · Click to replace
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: 40, height: 40, margin: "0 auto 12px",
                      background: "var(--bg-3)", borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>
                      Drop render image here
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.06em" }}>
                      PNG, JPG, WEBP — or click to browse
                    </div>
                  </>
                )}
              </div>
              <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>

            {/* Config */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 5 }}>
                  Original Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Paste the prompt used for this generation…"
                  style={{
                    width: "100%", background: "var(--surface)",
                    border: "1px solid var(--border-2)", borderRadius: 8,
                    padding: "9px 12px", color: "var(--text)",
                    fontFamily: "var(--font-display)", fontSize: 12,
                    resize: "vertical", minHeight: 60, outline: "none",
                    lineHeight: 1.6, transition: "border-color 0.15s",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--accent-2)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "var(--border-2)"; }}
                />
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 5 }}>
                  Generation Stage
                </label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  style={{
                    width: "100%", background: "var(--surface)",
                    border: "1px solid var(--border-2)", borderRadius: 8,
                    padding: "9px 12px", color: "var(--text)",
                    fontFamily: "var(--font-mono)", fontSize: 11,
                    outline: "none", cursor: "pointer",
                  }}
                >
                  <option>Render Complete</option>
                  <option>Mid-Generation</option>
                  <option>Draft / Iteration 1</option>
                  <option>Final Export</option>
                </select>
              </div>

              {/* Run button */}
              <button
                onClick={onVerify}
                disabled={!imageFile || !prompt.trim() || status === "verifying"}
                style={{
                  width: "100%", padding: "11px",
                  background: (!imageFile || !prompt.trim() || status === "verifying")
                    ? "var(--bg-3)" : "var(--accent)",
                  color: (!imageFile || !prompt.trim() || status === "verifying") ? "var(--text-3)" : "#fff",
                  border: "none", borderRadius: 8,
                  fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  cursor: (!imageFile || !prompt.trim() || status === "verifying") ? "not-allowed" : "pointer",
                  transition: "all 0.18s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {status === "verifying" ? (
                  <>
                    <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "verifySpinner 0.7s linear infinite" }} />
                    Analysing render…
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    Run Verification
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {status === "done" && result && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", animation: "verifyFadeIn 0.35s ease" }}>

                {/* Score header */}
                <div style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", alignItems: "center", gap: 18,
                }}>
                  <ScoreRing score={result.score} passed={result.passed} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "3px 10px",
                      background: result.passed ? "rgba(34,197,94,0.1)" : "rgba(255,170,0,0.1)",
                      borderRadius: 4,
                      fontSize: 11, fontWeight: 700,
                      color: statusColor,
                      fontFamily: "var(--font-mono)",
                      marginBottom: 8,
                      letterSpacing: "0.06em",
                    }}>
                      {statusLabel}
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>
                      {result.summary}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", marginTop: 6 }}>
                      Ready for next step: {result.readyForNextStep ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                {/* Actionable Next Step */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "rgba(255,170,0,0.03)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 5, fontWeight: 700 }}>
                    Next Action
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5, fontWeight: 500 }}>
                    {result.nextAction}
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                  {(["feedback", "parts"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        flex: 1, padding: "10px 0",
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "var(--font-mono)", fontSize: 10,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        color: activeTab === tab ? "var(--text)" : "var(--text-3)",
                        borderBottom: activeTab === tab ? "1.5px solid var(--accent)" : "1.5px solid transparent",
                        marginBottom: -1, transition: "all 0.15s",
                      }}
                    >
                      {tab === "feedback" ? `Feedback (${result.feedback.length})` : `Parts Review`}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {activeTab === "feedback" && (
                  <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {result.feedback.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 10,
                          padding: "11px 14px",
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          animation: `verifyFadeIn 0.35s ease ${i * 0.07}s both`,
                        }}
                      >
                        <span style={{
                          width: 18, height: 18, borderRadius: "50%",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid var(--border-2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, fontSize: 9, color: "var(--text-3)", fontWeight: 700,
                        }}>
                          {i + 1}
                        </span>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "parts" && (
                  <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                    
                    {/* Completed Items */}
                    {result.completedItems.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          COMPLETED
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {result.completedItems.map((item, i) => (
                            <div key={i} style={{ fontSize: 12, color: "var(--text-2)", paddingLeft: 18, position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: 6, width: 4, height: 4, borderRadius: "50%", background: "#22c55e" }} />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Parts */}
                    {result.missingParts.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#ffaa00", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                          MISSING
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {result.missingParts.map((item, i) => (
                            <div key={i} style={{ fontSize: 12, color: "var(--text-2)", paddingLeft: 18, position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: 6, width: 4, height: 4, borderRadius: "50%", background: "#ffaa00" }} />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Incorrect Parts */}
                    {result.incorrectParts.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#ff6235", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          INCORRECT
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {result.incorrectParts.map((item, i) => (
                            <div key={i} style={{ fontSize: 12, color: "var(--text-2)", paddingLeft: 18, position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: 6, width: 4, height: 4, borderRadius: "50%", background: "#ff6235" }} />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.completedItems.length === 0 && result.missingParts.length === 0 && result.incorrectParts.length === 0 && (
                      <div style={{ fontSize: 12, color: "var(--text-3)", fontStyle: "italic" }}>
                        No specific parts highlighted.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Error state */}
            {status === "error" && (
              <div style={{ padding: "24px 20px", textAlign: "center" }}>
                <div style={{
                  padding: 16, background: "rgba(255,98,53,0.06)",
                  border: "1px solid rgba(255,98,53,0.2)", borderRadius: 10,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", marginBottom: 6 }}>Verification Failed</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>Check your connection and try again.</div>
                  <button onClick={onVerify} style={{ marginTop: 14, padding: "8px 20px", background: "var(--accent)", border: "none", borderRadius: 7, color: "#fff", fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
