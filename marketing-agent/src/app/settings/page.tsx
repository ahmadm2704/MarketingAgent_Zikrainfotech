"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Key,
  Globe,
  Server,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Zap,
} from "lucide-react";
import { checkHealth } from "@/lib/api";

interface SettingField {
  id: string;
  label: string;
  placeholder: string;
  description: string;
  type: "password" | "text" | "url";
  required: boolean;
}

const SETTINGS: SettingField[] = [
  {
    id: "NEXT_PUBLIC_API_URL",
    label: "Backend API URL",
    placeholder: "http://localhost:8000",
    description: "URL of your FastAPI backend server",
    type: "url",
    required: true,
  },
  {
    id: "GROQ_API_KEY",
    label: "Groq API Key",
    placeholder: "gsk_...",
    description: "Required for the LangGraph agent (Llama 3 70B)",
    type: "password",
    required: true,
  },
  {
    id: "ANTHROPIC_API_KEY",
    label: "Anthropic API Key",
    placeholder: "sk-ant-...",
    description: "Optional: for Claude models as an alternative",
    type: "password",
    required: false,
  },
  {
    id: "SUPABASE_URL",
    label: "Supabase Project URL",
    placeholder: "https://xxxxx.supabase.co",
    description: "Your Supabase project URL for data persistence",
    type: "url",
    required: true,
  },
  {
    id: "SUPABASE_ANON_KEY",
    label: "Supabase Anon Key",
    placeholder: "eyJhbGci...",
    description: "Supabase anon/public key for client-side access",
    type: "password",
    required: true,
  },
  {
    id: "SERPAPI_KEY",
    label: "SerpAPI Key",
    placeholder: "your-serpapi-key",
    description: "Optional: enables real-time web search for SEO & competitor tools",
    type: "password",
    required: false,
  },
];

function SettingRow({ field }: { field: SettingField }) {
  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(`marketmind_${field.id}`, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="card"
      style={{ padding: "20px 24px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              {field.label}
            </h3>
            {field.required && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#F472B6",
                  background: "rgba(236,72,153,0.1)",
                  padding: "1px 6px",
                  borderRadius: 999,
                  border: "1px solid rgba(236,72,153,0.25)",
                }}
              >
                Required
              </span>
            )}
            {!field.required && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  background: "var(--bg-surface)",
                  padding: "1px 6px",
                  borderRadius: 999,
                  border: "1px solid var(--border-subtle)",
                }}
              >
                Optional
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{field.description}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            type={field.type === "password" && !showValue ? "password" : "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={field.placeholder}
            className="input"
            style={{ paddingRight: field.type === "password" ? "40px" : undefined }}
          />
          {field.type === "password" && (
            <button
              onClick={() => setShowValue(!showValue)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: 0,
              }}
            >
              {showValue ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}
        </div>
        <button
          onClick={handleSave}
          className={saved ? "btn" : "btn btn-secondary"}
          style={{
            padding: "10px 16px",
            background: saved ? "rgba(16,185,129,0.15)" : undefined,
            borderColor: saved ? "rgba(16,185,129,0.3)" : undefined,
            color: saved ? "#34D399" : undefined,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? "Saved!" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [checking, setChecking] = useState(false);

  const checkBackend = async () => {
    setChecking(true);
    setBackendStatus("checking");
    const healthy = await checkHealth();
    setBackendStatus(healthy ? "online" : "offline");
    setChecking(false);
  };

  useEffect(() => {
    checkBackend();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div className="orb orb-purple" style={{ width: 400, height: 400, top: -100, left: -100, opacity: 0.2 }} />

      {/* Header */}
      <div
        style={{
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(8,11,20,0.9)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/agent" className="btn btn-ghost" style={{ padding: "6px 10px" }}>
            <ArrowLeft size={15} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "var(--gradient-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={14} color="white" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Settings
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Backend Status */}
        <div
          className="card glass"
          style={{ padding: "20px 24px", marginBottom: 24 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: backendStatus === "online" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${backendStatus === "online" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Server size={18} style={{ color: backendStatus === "online" ? "#34D399" : "#F87171" }} />
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Backend Status</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: backendStatus === "online" ? "#34D399" : backendStatus === "offline" ? "#F87171" : "#FCD34D",
                    }}
                  />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>
                    {backendStatus === "checking" ? "Checking..." : backendStatus === "online" ? "FastAPI server online" : "Backend offline"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={checkBackend}
              disabled={checking}
              className="btn btn-secondary"
              style={{ padding: "8px 14px", fontSize: 12 }}
            >
              <RefreshCw size={13} style={{ animation: checking ? "spin 1s linear infinite" : "none" }} />
              {checking ? "Checking..." : "Recheck"}
            </button>
          </div>

          {backendStatus === "offline" && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
              }}
            >
              <AlertCircle size={14} style={{ color: "#F87171", flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 12, color: "#F87171", fontWeight: 600, marginBottom: 4 }}>Backend not reachable</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Start the backend: <code style={{ color: "var(--brand-purple-light)" }}>cd marketing-agent-backend && python main.py</code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* API Keys Section */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Key size={16} style={{ color: "var(--brand-purple-light)" }} />
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>API Configuration</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SETTINGS.map((field) => (
              <SettingRow key={field.id} field={field} />
            ))}
          </div>
        </div>

        {/* Setup Instructions */}
        <div
          className="card glass"
          style={{ padding: "24px", marginTop: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Zap size={16} style={{ color: "#FCD34D" }} />
            <h2 style={{ fontSize: 15, fontWeight: 800 }}>Quick Setup Guide</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { num: 1, text: "Create a Supabase project and run the schema from database/schema.sql", link: "https://supabase.com" },
              { num: 2, text: "Get your OpenAI API key (GPT-4o access required)", link: "https://platform.openai.com" },
              { num: 3, text: "Copy .env.example to .env in the backend folder and fill in your keys", link: null },
              { num: 4, text: "Run the backend: python main.py (or uvicorn main:app --reload)", link: null },
              { num: 5, text: "Deploy to Vercel: connect your GitHub repo and set environment variables", link: "https://vercel.com" },
            ].map((step) => (
              <div
                key={step.num}
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "var(--gradient-brand)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    color: "white",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {step.num}
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {step.text}
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--brand-purple-light)", marginLeft: 6 }}
                    >
                      → {new URL(step.link).hostname}
                    </a>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Environment Variables */}
        <div
          className="card"
          style={{ padding: "20px 24px", marginTop: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Globe size={15} style={{ color: "var(--brand-purple-light)" }} />
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Frontend .env.local</h3>
          </div>
          <pre
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 10,
              padding: "14px 16px",
              fontSize: 12,
              color: "#34D399",
              overflow: "auto",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              lineHeight: 1.7,
            }}
          >
{`NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`}
          </pre>
        </div>

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
