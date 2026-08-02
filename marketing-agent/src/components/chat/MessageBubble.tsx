"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, User, Copy, Check, Wrench } from "lucide-react";
import { useState } from "react";
import type { Message } from "@/lib/store";

const TOOL_DISPLAY: Record<string, { label: string; emoji: string; color: string }> = {
  generate_campaign_strategy: { label: "Building Campaign Strategy", emoji: "🎯", color: "#A78BFA" },
  generate_ad_copy: { label: "Writing Ad Copy", emoji: "✍️", color: "#60A5FA" },
  generate_email_sequence: { label: "Crafting Email Sequence", emoji: "📧", color: "#22D3EE" },
  generate_landing_page_copy: { label: "Writing Landing Page", emoji: "🌐", color: "#34D399" },
  generate_social_posts: { label: "Creating Social Posts", emoji: "📱", color: "#F472B6" },
  generate_ab_test_variants: { label: "Generating A/B Variants", emoji: "🧪", color: "#FB923C" },
  generate_content_calendar: { label: "Planning Content Calendar", emoji: "📅", color: "#60A5FA" },
  research_seo_keywords: { label: "Researching Keywords", emoji: "🔍", color: "#22D3EE" },
  analyze_competitor: { label: "Analyzing Competitors", emoji: "🕵️", color: "#A78BFA" },
  get_marketing_insights: { label: "Gathering Market Insights", emoji: "📊", color: "#34D399" },
  analyze_campaign_metrics: { label: "Analyzing Performance", emoji: "📈", color: "#FB923C" },
  generate_performance_report: { label: "Generating Report", emoji: "📋", color: "#F472B6" },
};

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  streamingContent?: string;
}

import { motion } from "framer-motion";

export function MessageBubble({ message, isStreaming, streamingContent }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const content = isStreaming && streamingContent ? streamingContent : message.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        display: "flex",
        gap: 12,
        padding: "4px 0",
        alignItems: "flex-start",
        flexDirection: isUser ? "row-reverse" : "row",
        animation: "fadeInUp 0.3s ease forwards",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: isUser
            ? "rgba(124,58,237,0.15)"
            : "var(--gradient-brand)",
          border: isUser ? "1px solid rgba(124,58,237,0.3)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: isUser ? "none" : "0 4px 15px rgba(124,58,237,0.4)",
        }}
      >
        {isUser ? (
          <User size={16} style={{ color: "var(--brand-purple-light)" }} />
        ) : (
          <Sparkles size={16} color="white" />
        )}
      </div>

      {/* Message content */}
      <div style={{ flex: 1, maxWidth: "85%", minWidth: 0 }}>
        {/* Tool calls indicator */}
        {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {message.toolCalls.map((tool) => {
              const info = TOOL_DISPLAY[tool] || {
                label: tool.replace(/_/g, " "),
                emoji: "⚙️",
                color: "#A78BFA",
              };
              return (
                <div
                  key={tool}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: `${info.color}15`,
                    border: `1px solid ${info.color}30`,
                    fontSize: 11,
                    fontWeight: 600,
                    color: info.color,
                  }}
                >
                  <Wrench size={10} />
                  {info.emoji} {info.label}
                </div>
              );
            })}
          </div>
        )}

        {/* Bubble */}
        <div
          style={{
            background: isUser
              ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.15))"
              : "var(--bg-card)",
            border: isUser
              ? "1px solid rgba(124,58,237,0.25)"
              : "1px solid var(--border-subtle)",
            borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
            padding: "12px 16px",
            position: "relative",
          }}
          className="group"
        >
          {isUser ? (
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "var(--text-primary)",
                lineHeight: 1.6,
              }}
            >
              {content}
            </p>
          ) : (
            <div className="markdown-content" style={{ fontSize: 14 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content + (isStreaming ? " ▋" : "")}
              </ReactMarkdown>
            </div>
          )}

          {/* Copy button */}
          {!isUser && !isStreaming && content && (
            <button
              onClick={handleCopy}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                borderRadius: 6,
                color: "var(--text-muted)",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
              className="copy-btn"
              title="Copy message"
            >
              {copied ? (
                <Check size={14} style={{ color: "var(--brand-green)" }} />
              ) : (
                <Copy size={14} />
              )}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginTop: 4,
            textAlign: isUser ? "right" : "left",
          }}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <style>{`
        .copy-btn { opacity: 0 !important; }
        div:hover > div > .copy-btn { opacity: 1 !important; }
      `}</style>
    </motion.div>
  );
}

// Streaming loading indicator
export function StreamingIndicator({ toolCalls }: { toolCalls: string[] }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "4px 0" }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "var(--gradient-brand)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
        }}
        className="pulse-glow"
      >
        <Sparkles size={16} color="white" />
      </div>

      <div>
        {toolCalls.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {toolCalls.map((tool) => {
              const info = TOOL_DISPLAY[tool] || {
                label: tool.replace(/_/g, " "),
                emoji: "⚙️",
                color: "#A78BFA",
              };
              return (
                <div
                  key={tool}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: `${info.color}15`,
                    border: `1px solid ${info.color}30`,
                    fontSize: 11,
                    fontWeight: 600,
                    color: info.color,
                    animation: "pulseGlow 1.5s ease-in-out infinite",
                  }}
                >
                  <Wrench size={10} />
                  {info.emoji} {info.label}...
                </div>
              );
            })}
          </div>
        )}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "4px 16px 16px 16px",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {toolCalls.length > 0 ? (
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Running analysis...
            </span>
          ) : (
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Thinking...
            </span>
          )}
          <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--brand-purple-light)",
                  animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
