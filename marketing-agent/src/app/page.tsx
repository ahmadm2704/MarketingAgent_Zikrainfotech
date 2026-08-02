"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  FileText,
  Mail,
  Search,
  BarChart3,
  Calendar,
  FlaskConical,
  ChevronRight,
  ArrowRight,
  Star,
  Globe,
  Users,
  Rocket,
} from "lucide-react";

const tools = [
  {
    icon: Target,
    title: "Campaign Strategy",
    description: "Full go-to-market strategies with channels, timeline, KPIs, and budget allocation.",
    color: "purple",
    badge: "Most Popular",
  },
  {
    icon: FileText,
    title: "Ad Copy Generator",
    description: "High-converting ads for Google, Meta, LinkedIn, Instagram & Twitter.",
    color: "blue",
    badge: null,
  },
  {
    icon: Mail,
    title: "Email Sequences",
    description: "Complete drip campaigns with subject lines, body, and send timing.",
    color: "cyan",
    badge: null,
  },
  {
    icon: Globe,
    title: "Landing Page Copy",
    description: "Hero sections, features, FAQs, and CTAs that actually convert.",
    color: "green",
    badge: null,
  },
  {
    icon: Search,
    title: "SEO Research",
    description: "Keyword discovery, content gaps, and meta tag templates.",
    color: "orange",
    badge: null,
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    description: "Deep competitive intelligence and positioning gaps.",
    color: "pink",
    badge: null,
  },
  {
    icon: FlaskConical,
    title: "A/B Test Variants",
    description: "Generate test variants with hypotheses and measurement plans.",
    color: "purple",
    badge: null,
  },
  {
    icon: Calendar,
    title: "Content Calendar",
    description: "Full month of content across all your channels.",
    color: "blue",
    badge: "New",
  },
  {
    icon: BarChart3,
    title: "Performance Reports",
    description: "Executive-level campaign analysis and optimization plans.",
    color: "cyan",
    badge: null,
  },
];

const stats = [
  { label: "Marketing Tools", value: "12+", icon: Zap },
  { label: "Copy Templates", value: "50+", icon: FileText },
  { label: "Campaigns Generated", value: "∞", icon: Target },
  { label: "Time Saved", value: "10x", icon: TrendingUp },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  purple: {
    bg: "rgba(124, 58, 237, 0.12)",
    text: "#A78BFA",
    border: "rgba(124, 58, 237, 0.25)",
    glow: "rgba(124, 58, 237, 0.3)",
  },
  blue: {
    bg: "rgba(59, 130, 246, 0.12)",
    text: "#60A5FA",
    border: "rgba(59, 130, 246, 0.25)",
    glow: "rgba(59, 130, 246, 0.3)",
  },
  cyan: {
    bg: "rgba(6, 182, 212, 0.12)",
    text: "#22D3EE",
    border: "rgba(6, 182, 212, 0.25)",
    glow: "rgba(6, 182, 212, 0.3)",
  },
  green: {
    bg: "rgba(16, 185, 129, 0.12)",
    text: "#34D399",
    border: "rgba(16, 185, 129, 0.25)",
    glow: "rgba(16, 185, 129, 0.3)",
  },
  orange: {
    bg: "rgba(249, 115, 22, 0.12)",
    text: "#FB923C",
    border: "rgba(249, 115, 22, 0.25)",
    glow: "rgba(249, 115, 22, 0.3)",
  },
  pink: {
    bg: "rgba(236, 72, 153, 0.12)",
    text: "#F472B6",
    border: "rgba(236, 72, 153, 0.25)",
    glow: "rgba(236, 72, 153, 0.3)",
  },
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Animated background orbs */}
      <div
        className="orb orb-purple"
        style={{
          width: 600,
          height: 600,
          top: -200,
          left: -200,
          opacity: 0.35,
        }}
      />
      <div
        className="orb orb-blue"
        style={{
          width: 500,
          height: 500,
          top: 200,
          right: -150,
          opacity: 0.25,
        }}
      />
      <div
        className="orb orb-cyan"
        style={{
          width: 400,
          height: 400,
          bottom: 100,
          left: "40%",
          opacity: 0.2,
        }}
      />

      {/* Mouse-following glow */}
      {mounted && (
        <div
          style={{
            position: "fixed",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            left: mousePos.x,
            top: mousePos.y,
            pointerEvents: "none",
            zIndex: 0,
            transition: "left 0.1s ease, top 0.1s ease",
          }}
        />
      )}

      {/* Navigation */}
      <nav
        className="glass"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "0 40px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          borderRadius: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--gradient-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(124,58,237,0.5)",
            }}
          >
            <Sparkles size={18} color="white" />
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            MarketMind{" "}
            <span className="gradient-text">AI</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/agent"
            className="btn btn-primary"
            style={{ fontSize: 14, padding: "8px 18px" }}
          >
            <Rocket size={15} />
            Launch Agent
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: "100px 40px 80px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div
          className="badge badge-purple fade-in-up"
          style={{ marginBottom: 24, fontSize: 13 }}
        >
          <Sparkles size={12} />
          Powered by LangGraph + GPT-4o
        </div>

        <h1
          className="fade-in-up"
          style={{
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: 24,
            animationDelay: "0.1s",
            letterSpacing: "-0.03em",
          }}
        >
          Your AI-Powered{" "}
          <span className="gradient-text">Fractional CMO</span>
        </h1>

        <p
          className="fade-in-up"
          style={{
            fontSize: "clamp(16px, 2.5vw, 20px)",
            color: "var(--text-secondary)",
            maxWidth: 620,
            margin: "0 auto 40px",
            lineHeight: 1.65,
            animationDelay: "0.2s",
          }}
        >
          MarketMind AI builds complete marketing campaigns, writes killer copy,
          researches competitors, and analyzes performance — all in a single conversation.
        </p>

        <div
          className="fade-in-up"
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            animationDelay: "0.3s",
          }}
        >
          <Link href="/agent" className="btn btn-primary" style={{ fontSize: 15, padding: "13px 28px" }}>
            <Sparkles size={16} />
            Start Building Campaigns
            <ArrowRight size={16} />
          </Link>
          <Link href="/campaigns" className="btn btn-secondary" style={{ fontSize: 15, padding: "13px 24px" }}>
            <BarChart3 size={16} />
            View Dashboard
          </Link>
        </div>

        {/* Hero visual */}
        <div
          className="fade-in-up glass"
          style={{
            marginTop: 60,
            borderRadius: 20,
            padding: "6px",
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.1))",
            animationDelay: "0.4s",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              background: "var(--bg-secondary)",
              borderRadius: 16,
              padding: "20px 24px",
              textAlign: "left",
            }}
          >
            {/* Terminal-like header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
              <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-tertiary)" }}>
                MarketMind Agent · Live Session
              </span>
            </div>

            {/* Mock conversation */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  background: "rgba(124,58,237,0.12)",
                  borderRadius: "12px 12px 4px 12px",
                  padding: "10px 14px",
                  maxWidth: "70%",
                  alignSelf: "flex-end",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                <p style={{ fontSize: 13, color: "var(--text-primary)", margin: 0 }}>
                  Build me a complete Q4 campaign strategy for my SaaS product targeting mid-market CTOs
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "var(--gradient-brand)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={14} color="white" />
                </div>
                <div
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "4px 12px 12px 12px",
                    padding: "10px 14px",
                    border: "1px solid var(--border-subtle)",
                    flex: 1,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <div
                      style={{
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "rgba(16,185,129,0.12)",
                        color: "#34D399",
                        fontSize: 11,
                        fontWeight: 600,
                        border: "1px solid rgba(16,185,129,0.25)",
                      }}
                    >
                      ⚙️ Running: generate_campaign_strategy
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                    <strong style={{ color: "var(--text-primary)" }}>🎯 Q4 Campaign Strategy: "Own The Decision"</strong>
                    <br />
                    Targeting mid-market CTOs with a 3-channel approach: LinkedIn thought leadership,
                    Google branded search, and personalized email sequences...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          padding: "0 40px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass card"
                style={{ padding: "20px", textAlign: "center" }}
              >
                <Icon size={20} style={{ color: "var(--brand-purple-light)", margin: "0 auto 8px" }} />
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                  className="gradient-text"
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tools Grid */}
      <section
        style={{
          padding: "0 40px 100px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Everything a CMO needs,{" "}
              <span className="gradient-text">in one agent</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
              12 specialized marketing tools, all accessible through natural conversation.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {tools.map((tool) => {
              const Icon = tool.icon;
              const colors = colorMap[tool.color];
              return (
                <Link
                  key={tool.title}
                  href="/agent"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="card"
                    style={{
                      padding: "24px",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      height: "100%",
                    }}
                  >
                    {tool.badge && (
                      <div
                        style={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          padding: "3px 8px",
                          borderRadius: 999,
                          background: colors.bg,
                          color: colors.text,
                          fontSize: 11,
                          fontWeight: 700,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {tool.badge}
                      </div>
                    )}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Icon size={20} style={{ color: colors.text }} />
                    </div>
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        marginBottom: 8,
                        color: "var(--text-primary)",
                      }}
                    >
                      {tool.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                      {tool.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 16,
                        color: colors.text,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Try it
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "0 40px 100px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
            padding: "60px 40px",
            borderRadius: 24,
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.08))",
            border: "1px solid rgba(124,58,237,0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="orb orb-purple"
            style={{
              width: 300,
              height: 300,
              top: -100,
              left: -100,
              opacity: 0.4,
            }}
          />
          <Star size={32} style={{ color: "var(--brand-purple-light)", marginBottom: 16 }} />
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
            Ready to scale your marketing?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 28, fontSize: 16 }}>
            Start your first conversation with MarketMind AI and see what a real marketing agent can do.
          </p>
          <Link href="/agent" className="btn btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
            <Sparkles size={16} />
            Launch MarketMind AI
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "var(--text-tertiary)",
          fontSize: 13,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={14} style={{ color: "var(--brand-purple-light)" }} />
          <span>MarketMind AI · Z360 Deep Agent Challenge</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/agent" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>
            Agent
          </Link>
          <Link href="/campaigns" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>
            Campaigns
          </Link>
          <Link href="/settings" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>
            Settings
          </Link>
        </div>
      </footer>
    </div>
  );
}
