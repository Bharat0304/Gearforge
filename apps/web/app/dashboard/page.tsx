"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { askAi, sendToRenderer } from "../../lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingRender, setLoadingRender] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [renderResult, setRenderResult] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setError("");
    setLoadingCode(true);
    setGeneratedCode("");
    setGenerationId(null);
    setRenderResult(null);

    try {
      const res = await askAi(prompt);
      setGeneratedCode(res.response);
      setGenerationId(res.id);
    } catch (err: any) {
      setError(err.message || "Failed to generate code.");
    } finally {
      setLoadingCode(false);
    }
  };

  const handleRender = async () => {
    if (!generationId) return;
    setError("");
    setLoadingRender(true);

    try {
      const res = await sendToRenderer(generationId);
      setRenderResult(res.result);
    } catch (err: any) {
      setError(err.message || "Failed to render.");
    } finally {
      setLoadingRender(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">GearForge Studio</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            Log out
          </button>
        </div>

        {error && <div className="text-red-500 bg-red-50 dark:bg-red-900/30 p-4 rounded-lg font-medium">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Generate 3D Model</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Describe what you want to build in Blender.</p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A low poly coffee mug with a handle..."
              className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none outline-none"
            />
            <button
              onClick={handleGenerate}
              disabled={loadingCode || !prompt}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loadingCode ? "Generating script..." : "Generate Blender Script"}
            </button>
          </div>

          {/* Code Output Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Generated Script</h2>
              {generationId && (
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 py-1 px-2 rounded-full font-mono">
                  ID: {generationId.slice(0, 8)}...
                </span>
              )}
            </div>
            
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-auto border border-gray-200 dark:border-gray-700 h-64 mb-4">
              {generatedCode ? (
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                  {generatedCode}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Generated code will appear here.
                </div>
              )}
            </div>

            <button
              onClick={handleRender}
              disabled={loadingRender || !generationId}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loadingRender ? "Sending to Blender..." : "Render 3D Model"}
            </button>
          </div>
        </div>

        {/* Render Result Section */}
        {renderResult && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Render Result</h2>
            <div className={`p-4 rounded-lg font-mono text-sm ${renderResult.success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
              <p>Status: {renderResult.success ? "Success" : "Failed"}</p>
              {renderResult.renderPath && <p className="mt-2">Output Path: {renderResult.renderPath}</p>}
              {renderResult.stderr && (
                <div className="mt-4 border-t border-red-200 dark:border-red-800 pt-4">
                  <p className="font-semibold mb-2">Error Log:</p>
                  <pre className="whitespace-pre-wrap text-xs">{renderResult.stderr}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
