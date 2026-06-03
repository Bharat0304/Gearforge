"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

type WSState = "empty" | "generating" | "result" | "error";

const PROJECTS = [
  { icon: "🚁", name: "Surveillance Drone v3", status: "completed", time: "2m ago" },
  { icon: "🦾", name: "Robotic Arm 6DOF", status: "rendering", time: "now" },
  { icon: "🏭", name: "Warehouse AMR Bot", status: "completed", time: "1h ago" },
  { icon: "🚀", name: "Rocket Nozzle", status: "failed", time: "3h ago" },
];

const STATUS_COLORS: Record<string, string> = {
  completed: "#22c55e",
  rendering: "var(--amber)",
  failed: "#ef4444",
};

const SB_ITEMS = [
  { icon: "⊞", label: "Dashboard", active: true },
  { icon: "◈", label: "Projects", badge: "12" },
  { icon: "◷", label: "History" },
  { icon: "◇", label: "Assets" },
  { icon: "▦", label: "Templates" },
];

const CODE_SNIPPET = `<span style="color:#c792ea">import</span> bpy
<span style="color:#c792ea">import</span> math

<span style="color:rgba(255,255,255,0.25)"># Clear scene</span>
bpy.ops.object.<span style="color:#82aaff">select_all</span>(action=<span style="color:#c3e88d">'SELECT'</span>)
bpy.ops.object.<span style="color:#82aaff">delete</span>()

<span style="color:#c792ea">def</span> <span style="color:#82aaff">create_drone</span>():
  bpy.ops.mesh.<span style="color:#82aaff">primitive_cube_add</span>(
    size=<span style="color:#f78c6c">0.3</span>, location=(<span style="color:#f78c6c">0</span>,<span style="color:#f78c6c">0</span>,<span style="color:#f78c6c">0</span>))
  body = bpy.context.object
  body.name = <span style="color:#c3e88d">"drone_body"</span>
  body.scale = (<span style="color:#f78c6c">1.6</span>,<span style="color:#f78c6c">1.6</span>,<span style="color:#f78c6c">0.35</span>)`;

export default function DashboardPage() {
  const [wsState, setWsState] = useState<WSState>("empty");
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("generate");
  const [generating, setGenerating] = useState(false);
  const [tlStep, setTlStep] = useState(0);
  const [generatedCode, setGeneratedCode] = useState("");
  const [mediaPaths, setMediaPaths] = useState({ png: "", mp4: "", glb: "", blend: "" });
  const [activePreview, setActivePreview] = useState<"glb" | "mp4" | "png">("glb");
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [renderError, setRenderError] = useState("");
  const [generatedComponents, setGeneratedComponents] = useState<any[]>([]);
  const [assemblySteps, setAssemblySteps] = useState<string[]>([]);
  const [componentLinks, setComponentLinks] = useState<Record<string, any[]>>({});
  const [loadingLinks, setLoadingLinks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!document.getElementById("model-viewer-script")) {
      const script = document.createElement("script");
      script.id = "model-viewer-script";
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
      document.head.appendChild(script);
    }
  }, []);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(url, "_blank");
    }
  };

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setWsState("generating");
    setGenerating(true);
    setTlStep(1);
    setRenderError("");
    
    try {
      // 1. Generate code using LLM
      const askRes = await fetch("http://localhost:3000/api/v1/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt })
      });
      const askData = await askRes.json();
      if (!askRes.ok) throw new Error(askData.error || "Failed to generate code");
      
      setGeneratedCode(askData.response.blenderCode || askData.response);
      setGeneratedComponents(askData.response.components || []);
      setAssemblySteps(askData.response.assemblySteps || []);
      setComponentLinks({});
      setTlStep(2);

      // 2. Send to blender service to render
      setTlStep(3);
      const sendRes = await fetch("http://localhost:3000/api/v1/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: askData.id })
      });
      const sendData = await sendRes.json();
      
      if (!sendRes.ok || sendData.result?.success === false) {
        setRenderError(sendData.result?.stderr || sendData.error || "Render failed");
        setWsState("error");
        setGenerating(false);
        return;
      }

      const pngName = sendData.result?.renderPath?.split('/').pop() || "";
      const mp4Name = sendData.videoResult?.videoPath?.split('/').pop() || "";
      const glbName = sendData.result?.glbPath?.split('/').pop() || "";
      const blendName = sendData.result?.blendPath?.split('/').pop() || "";

      setMediaPaths({
        png: pngName ? `http://localhost:3000/media/${pngName}` : "",
        mp4: mp4Name ? `http://localhost:3000/media/${mp4Name}` : "",
        glb: glbName ? `http://localhost:3000/media/${glbName}` : "",
        blend: blendName ? `http://localhost:3000/media/${blendName}` : ""
      });
      
      if (glbName) setActivePreview("glb");
      else if (mp4Name) setActivePreview("mp4");
      else setActivePreview("png");
      
      setTlStep(4);
      setWsState("result");
    } catch (err: any) {
      setRenderError(err.message || "An unexpected error occurred");
      setWsState("error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 300px", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>

      {/* SIDEBAR */}
      <aside style={{ background: "var(--surf)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, background: "linear-gradient(135deg,#ff4422,#ffaa00)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Gearforge</span>
        </div>

        <div style={{ padding: 8 }}>
          <button onClick={() => setWsState("empty")} style={{
            width: "100%", padding: "10px 12px", background: "var(--red)", color: "#fff",
            border: "none", fontFamily: "var(--fn)", fontSize: 12, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, letterSpacing: ".04em",
            transition: "background .15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "#ff6644")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--red)")}
          >+ New Generation</button>
        </div>

        <div style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text3)", padding: "12px 16px 6px", fontFamily: "var(--fm)" }}>Workspace</div>
        {SB_ITEMS.map((item) => (
          <button key={item.label} style={{
            display: "flex", alignItems: "center", gap: 9, padding: "8px 16px",
            cursor: "pointer", fontSize: 13, fontWeight: 500, color: item.active ? "#fff" : "var(--text2)",
            border: "none", background: item.active ? "var(--surf2)" : "none", width: "100%", textAlign: "left",
            borderLeft: item.active ? "2px solid var(--red)" : "2px solid transparent",
            transition: "all .12s", fontFamily: "var(--fn)",
          }}
            onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = "var(--surf2)"; e.currentTarget.style.color = "#fff"; } }}
            onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text2)"; } }}
          >
            <span style={{ fontSize: 14, opacity: .7 }}>{item.icon}</span>
            {item.label}
            {item.badge && <span style={{ marginLeft: "auto", background: "var(--red)", color: "#fff", fontFamily: "var(--fm)", fontSize: 9, padding: "2px 6px" }}>{item.badge}</span>}
          </button>
        ))}

        <div style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text3)", padding: "12px 16px 6px", fontFamily: "var(--fm)" }}>Recent</div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 8px" }}>
          {PROJECTS.map((p, i) => (
            <button key={i} style={{
              width: "100%", padding: 10, background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
              marginBottom: 6, cursor: "pointer", textAlign: "left", transition: "all .15s", display: "block",
              fontFamily: "var(--fn)",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
              <div style={{ fontSize: 10, fontFamily: "var(--fm)", color: "var(--text3)" }}>
                <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: STATUS_COLORS[p.status] ?? "var(--text3)", marginRight: 4, verticalAlign: "middle" }} />
                {p.status} · {p.time}
              </div>
            </button>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "8px 16px" }}>
          {["⚙ Settings", "? Docs"].map((item) => (
            <button key={item} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--text2)", border: "none", background: "none", width: "100%", textAlign: "left", fontFamily: "var(--fn)", transition: "color .12s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}
            >{item}</button>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000", fontFamily: "var(--fm)" }}>AC</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Alex Chen</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".06em" }}>Pro Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER WORKSPACE */}
      <main style={{ background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "var(--surf)", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{wsState === "result" ? "Surveillance Drone" : wsState === "generating" ? "Robotic Arm v2" : "Dashboard"}</div>
            <div style={{ fontSize: 11, fontFamily: "var(--fm)", color: "var(--text3)" }}>
              {wsState === "result" ? "Completed · 6.8s" : wsState === "generating" ? "Generating…" : "4 projects · Last active 2m ago"}
            </div>
          </div>
          <Link href="/" style={{ fontSize: 11, fontFamily: "var(--fm)", color: "var(--text3)", textDecoration: "none" }}>← Home</Link>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", background: "var(--surf)", flexShrink: 0 }}>
          {[{ id: "generate", label: "Generate" }, { id: "history", label: "History" }, { id: "templates", label: "Templates" }, { id: "settings", label: "Settings" }].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "11px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: "none", background: "none", fontFamily: "var(--fn)",
              color: activeTab === t.id ? "#fff" : "var(--text3)",
              borderBottom: activeTab === t.id ? "2px solid var(--red)" : "2px solid transparent",
              marginBottom: -1, transition: "all .12s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Prompt box */}
          <div style={{ border: "1px solid rgba(255,255,255,0.1)", background: "var(--surf)", transition: "border-color .2s" }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")}
            onBlurCapture={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          >
            <textarea
              id="main-ta"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe what you want to build... e.g. Create a surveillance drone with four propellers and a front camera"
              style={{ width: "100%", minHeight: 96, padding: "14px 16px", background: "transparent", border: "none", color: "#fff", fontFamily: "var(--fn)", fontSize: 14, resize: "none", outline: "none", lineHeight: 1.6 }}
            />
            <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg2)" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Surveillance drone", "Robotic arm", "Warehouse bot", "CNC frame"].map((c) => (
                  <button key={c} onClick={() => setPrompt("Create a " + c + " with detailed mechanical components")}
                    style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--text3)", background: "var(--bg)", border: "1px solid rgba(255,255,255,0.08)", padding: "3px 8px", cursor: "pointer", transition: "all .12s", letterSpacing: ".04em" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text3)"; }}
                  >{c}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ padding: "8px 14px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text2)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--fn)", transition: "all .12s" }}>✦ Improve</button>
                <button onClick={handleGenerate} style={{
                  padding: "8px 18px", background: generating ? "var(--surf3)" : "var(--red)", color: "#fff",
                  border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--fn)",
                  display: "flex", alignItems: "center", gap: 8, letterSpacing: ".04em", transition: "all .15s",
                }}>
                  {generating ? <><span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Generating…</> : "⚡ Generate"}
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {wsState !== "empty" && (
            <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "var(--surf)", padding: "14px 16px" }}>
              {wsState === "result" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", marginBottom: 14 }}>
                  <span style={{ color: "#22c55e" }}>✓</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#22c55e" }}>Generation complete</span>
                  <span style={{ marginLeft: "auto", fontFamily: "var(--fm)", fontSize: 10, color: "var(--text3)" }}>6.8s · Blender 4.1</span>
                </div>
              )}
              {wsState === "error" && (
                <div style={{ background: "rgba(255,68,34,0.06)", border: "1px solid rgba(255,68,34,0.25)", padding: 16, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>⚠ Render Failed</div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--text2)", lineHeight: 1.6, marginBottom: 14, whiteSpace: "pre-wrap" }}>
                    {renderError || "An unknown error occurred during generation."}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setWsState("generating")} style={{ padding: "7px 12px", background: "transparent", border: "1px solid rgba(255,68,34,0.3)", color: "var(--red)", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--fn)" }}>Fix with AI</button>
                    <button onClick={() => setWsState("generating")} style={{ padding: "7px 12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text2)", fontSize: 11, cursor: "pointer", fontFamily: "var(--fn)" }}>Retry</button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { label: "Prompt received", sub: "Parsed in 12ms", done: tlStep >= 1 },
                  { label: "AI generating code", sub: "Claude Sonnet · 1.2s", done: tlStep >= 2 },
                  { label: "Blender rendering", sub: tlStep >= 3 && tlStep < 4 ? "In progress…" : "4.8s · 1024×1024 · Cycles", active: tlStep === 3, done: tlStep >= 4 },
                  { label: "Export ready", sub: "PNG · .blend · OBJ available", done: tlStep >= 4 },
                ].map((step, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "9px 0" }}>
                      <div style={{
                        width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                        background: step.done ? "rgba(34,197,94,0.12)" : step.active ? "rgba(255,68,34,0.1)" : "rgba(255,255,255,0.04)",
                      }}>
                        {step.done ? <span style={{ fontSize: 10, color: "#22c55e" }}>✓</span>
                          : step.active ? <span style={{ width: 10, height: 10, border: "2px solid rgba(255,255,255,0.15)", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                            : null}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: step.done ? "#fff" : step.active ? "#fff" : "var(--text3)" }}>{step.label}</div>
                        <div style={{ fontSize: 11, fontFamily: "var(--fm)", color: step.active ? "var(--red)" : "var(--text3)", marginTop: 2 }}>{step.sub}</div>
                      </div>
                    </div>
                    {i < 3 && <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.08)", marginLeft: 8 }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error trigger */}
          <button onClick={() => setWsState("error")} style={{
            alignSelf: "flex-start", padding: "6px 12px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--text3)", fontSize: 11, fontFamily: "var(--fm)", cursor: "pointer",
          }}>⚠ Simulate Error</button>

          {/* History grid */}
          {activeTab === "history" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {PROJECTS.map((p, i) => (
                <div key={i} style={{ border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", cursor: "pointer", background: "var(--surf)", transition: "border-color .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, background: "var(--bg2)" }}>{p.icon}</div>
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 10, fontFamily: "var(--fm)", color: "var(--text3)", display: "flex", justifyContent: "space-between" }}>
                      <span><span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: STATUS_COLORS[p.status] ?? "var(--text3)", marginRight: 4, verticalAlign: "middle" }} />{p.status}</span>
                      <span>{p.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside style={{ background: "var(--surf)", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "auto" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Preview</span>
          <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--text3)", letterSpacing: ".08em", textTransform: "uppercase" }}>Live</span>
        </div>

        {/* Render preview */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ padding: "11px 16px", fontSize: 11, fontWeight: 700, color: "var(--text2)", fontFamily: "var(--fm)", textTransform: "uppercase", letterSpacing: ".06em" }}>Render Preview</div>
          <div style={{ padding: "0 16px 16px" }}>
            <div id="render-preview-container" style={{ border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "1", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              {wsState === "result" ? (
                <>
                  {activePreview === "mp4" && mediaPaths.mp4 ? (
                    <video src={mediaPaths.mp4} autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : activePreview === "png" && mediaPaths.png ? (
                    <img src={mediaPaths.png} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Rendered Preview" />
                  ) : activePreview === "glb" && mediaPaths.glb ? (
                    <model-viewer src={mediaPaths.glb} auto-rotate camera-controls style={{ width: "100%", height: "100%", backgroundColor: "var(--bg)" }}></model-viewer>
                  ) : (
                    <div style={{ fontSize: 64, animation: "float3d 3.5s ease infinite" }}>🚁</div>
                  )}
                  
                  <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4 }}>
                     {mediaPaths.glb && <button onClick={() => setActivePreview("glb")} style={{ background: activePreview === "glb" ? "var(--red)" : "rgba(0,0,0,0.6)", color: "#fff", border: "none", padding: "4px 8px", fontSize: 10, cursor: "pointer", fontFamily: "var(--fm)" }}>3D</button>}
                     {mediaPaths.mp4 && <button onClick={() => setActivePreview("mp4")} style={{ background: activePreview === "mp4" ? "var(--red)" : "rgba(0,0,0,0.6)", color: "#fff", border: "none", padding: "4px 8px", fontSize: 10, cursor: "pointer", fontFamily: "var(--fm)" }}>VIDEO</button>}
                     {mediaPaths.png && <button onClick={() => setActivePreview("png")} style={{ background: activePreview === "png" ? "var(--red)" : "rgba(0,0,0,0.6)", color: "#fff", border: "none", padding: "4px 8px", fontSize: 10, cursor: "pointer", fontFamily: "var(--fm)" }}>IMAGE</button>}
                  </div>
                </>
              ) : wsState === "generating" ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 32, height: 32, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
                  <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--text3)" }}>Rendering…</div>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 40, opacity: .2, display: "block", marginBottom: 8 }}>◈</span>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--text3)", letterSpacing: ".06em" }}>No render yet</div>
                </div>
              )}
            </div>
            {wsState === "result" && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <div style={{ position: "relative", flex: 1 }}>
                   <button onClick={() => setDownloadOpen(!downloadOpen)} style={{ width: "100%", padding: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text2)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--fn)", transition: "all .12s" }}
                     onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
                     onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text2)"; }}
                   >↓ Download ▾</button>
                   {downloadOpen && (
                     <div style={{ position: "absolute", bottom: "calc(100% + 4px)", left: 0, width: "100%", background: "var(--surf3)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", zIndex: 20 }}>
                        {mediaPaths.glb && <button onClick={() => handleDownload(mediaPaths.glb, "model.glb")} style={{ padding: "8px 12px", color: "#fff", textDecoration: "none", fontSize: 11, fontFamily: "var(--fn)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", width: "100%" }}>GLB Model</button>}
                        {mediaPaths.blend && <button onClick={() => handleDownload(mediaPaths.blend, "scene.blend")} style={{ padding: "8px 12px", color: "#fff", textDecoration: "none", fontSize: 11, fontFamily: "var(--fn)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", width: "100%" }}>Blender Scene</button>}
                        {mediaPaths.mp4 && <button onClick={() => handleDownload(mediaPaths.mp4, "video.mp4")} style={{ padding: "8px 12px", color: "#fff", textDecoration: "none", fontSize: 11, fontFamily: "var(--fn)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", width: "100%" }}>MP4 Video</button>}
                        {mediaPaths.png && <button onClick={() => handleDownload(mediaPaths.png, "render.png")} style={{ padding: "8px 12px", color: "#fff", textDecoration: "none", fontSize: 11, fontFamily: "var(--fn)", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", width: "100%" }}>PNG Image</button>}
                     </div>
                   )}
                </div>
                <button onClick={() => {
                  const previewEl = document.getElementById("render-preview-container");
                  if (previewEl) {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      previewEl.requestFullscreen();
                    }
                  }
                }} style={{ flex: 1, padding: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text2)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--fn)", transition: "all .12s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text2)"; }}
                >⛶ Fullscreen</button>
              </div>
            )}
          </div>
        </div>

        {/* Code viewer */}
        {wsState === "result" && (
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ padding: "11px 16px", fontSize: 11, fontWeight: 700, color: "var(--text2)", fontFamily: "var(--fm)", textTransform: "uppercase", letterSpacing: ".06em", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Generated Code</span>
              <button style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--text3)", background: "none", border: "none", cursor: "pointer" }}>Copy</button>
            </div>
            <div style={{ margin: "0 16px 16px", background: "#000", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ padding: "6px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: ".12em", textTransform: "uppercase" }}>Python · Blender</span>
                <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "rgba(255,68,34,0.7)" }}>{generatedCode.length} chars</span>
              </div>
              <pre style={{ padding: 12, fontFamily: "var(--fm)", fontSize: 11, lineHeight: 1.7, color: "rgba(255,255,255,0.8)", maxHeight: 160, overflowY: "auto", margin: 0 }}>
                {generatedCode || "No code generated."}
              </pre>
            </div>
          </div>
        )}

        {/* Hardware Components */}
        {wsState === "result" && generatedComponents.length > 0 && (
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ padding: "11px 16px", fontSize: 11, fontWeight: 700, color: "var(--text2)", fontFamily: "var(--fm)", textTransform: "uppercase", letterSpacing: ".06em" }}>Hardware Components</div>
            <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {generatedComponents.map((comp, idx) => (
                <div key={idx} style={{ background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.08)", padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{comp.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--fm)" }}>Qty: {comp.quantity}</div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--fm)", marginBottom: 10 }}>Category: {comp.category}</div>
                  
                  {componentLinks[comp.name] ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {componentLinks[comp.name].map((link: any, i: number) => (
                        <a key={i} href={link.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--red)", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={link.title}>
                          ↗ {link.title}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <button 
                      onClick={async () => {
                        setLoadingLinks(prev => ({ ...prev, [comp.name]: true }));
                        try {
                          const res = await fetch("http://localhost:3000/api/v1/items-search", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ prompt: "buy " + comp.name })
                          });
                          const data = await res.json();
                          const results = data.results || [];
                          setComponentLinks(prev => ({ ...prev, [comp.name]: results }));
                        } catch (e) {
                          console.error(e);
                        } finally {
                          setLoadingLinks(prev => ({ ...prev, [comp.name]: false }));
                        }
                      }}
                      style={{ padding: "6px 12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text2)", fontSize: 10, cursor: "pointer", fontFamily: "var(--fn)", transition: "border-color .15s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    >
                      {loadingLinks[comp.name] ? "Searching..." : "🛒 Find Sites"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assembly Steps */}
        {wsState === "result" && assemblySteps.length > 0 && (
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ padding: "11px 16px", fontSize: 11, fontWeight: 700, color: "var(--text2)", fontFamily: "var(--fm)", textTransform: "uppercase", letterSpacing: ".06em" }}>Assembly Instructions</div>
            <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {assemblySteps.map((step, idx) => (
                <div key={idx} style={{ fontSize: 12, lineHeight: 1.5, color: "var(--text2)" }}>
                  <span style={{ color: "var(--red)", fontWeight: 700, marginRight: 6 }}>{idx + 1}.</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {wsState === "result" && (
          <div>
            <div style={{ padding: "11px 16px", fontSize: 11, fontWeight: 700, color: "var(--text2)", fontFamily: "var(--fm)", textTransform: "uppercase", letterSpacing: ".06em" }}>Metadata</div>
            <div style={{ padding: "0 16px 16px" }}>
              {[
                { k: "Gen Time", v: "6.8s", c: "var(--amber)" },
                { k: "Resolution", v: "1024×1024", c: "#fff" },
                { k: "Model", v: "Sonnet 3.7", c: "#fff" },
                { k: "Polygons", v: "24.3K", c: "#fff" },
                { k: "Format", v: "PNG · .blend", c: "#fff" },
              ].map((row) => (
                <div key={row.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--text3)", letterSpacing: ".06em" }}>{row.k}</span>
                  <span style={{ fontFamily: "var(--fm)", fontSize: 11, color: row.c }}>{row.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
