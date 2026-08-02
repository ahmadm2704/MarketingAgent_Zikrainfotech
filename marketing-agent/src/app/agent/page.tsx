"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChatStore } from "@/lib/store";
import { streamMessage, deleteSession } from "@/lib/api";
import { MessageBubble, StreamingIndicator } from "@/components/chat/MessageBubble";
import {
  Send,
  Sparkles,
  Plus,
  Target,
  FileText,
  Mail,
  Globe,
  Search,
  Users,
  FlaskConical,
  Calendar,
  BarChart3,
  TrendingUp,
  ChevronDown,
  Sidebar,
  Trash2,
  Download,
} from "lucide-react";
import Link from "next/link";

const QUICK_PROMPTS = [
  {
    icon: Target,
    label: "Campaign Strategy",
    prompt: "Build me a complete Q4 marketing campaign strategy for my SaaS product targeting SMBs",
    color: "#A78BFA",
  },
  {
    icon: FileText,
    label: "Ad Copy",
    prompt: "Write 3 Google Ad copy variants for a project management tool targeting startup CTOs",
    color: "#60A5FA",
  },
  {
    icon: Mail,
    label: "Email Sequence",
    prompt: "Create a 5-email welcome sequence for new signups of a B2B analytics platform",
    color: "#22D3EE",
  },
  {
    icon: Globe,
    label: "Landing Page",
    prompt: "Write complete landing page copy for an AI writing assistant targeting content marketers",
    color: "#34D399",
  },
  {
    icon: Search,
    label: "SEO Research",
    prompt: "Research top SEO keywords for 'marketing automation software' in the US market",
    color: "#FB923C",
  },
  {
    icon: Users,
    label: "Competitor Analysis",
    prompt: "Analyze HubSpot's marketing strategy and find positioning gaps I can exploit",
    color: "#F472B6",
  },
  {
    icon: FlaskConical,
    label: "A/B Test",
    prompt: "Generate 4 A/B test variants for my email subject line: 'Try our new AI feature'",
    color: "#A78BFA",
  },
  {
    icon: Calendar,
    label: "Content Calendar",
    prompt: "Create a full August content calendar for a fintech startup on LinkedIn and Twitter",
    color: "#60A5FA",
  },
  {
    icon: BarChart3,
    label: "Performance Report",
    prompt: "Generate a Q3 marketing performance report template for Google Ads and Email campaigns",
    color: "#22D3EE",
  },
];

export default function AgentPage() {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sessionId,
    isLoading,
    streamingContent,
    activeToolCalls,
    addMessage,
    updateMessage,
    setSessionId,
    setLoading,
    setStreamingContent,
    setActiveToolCalls,
    clearChat,
  } = useChatStore();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isLoading || messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading, streamingContent, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
  }, []);

  const handleSend = useCallback(
    async (messageText?: string) => {
      const text = messageText || input.trim();
      if (!text || isLoading) return;

      setInput("");
      setLoading(true);
      setStreamingContent("");
      setActiveToolCalls([]);

      // Add user message
      addMessage({ role: "user", content: text });

      // Add placeholder assistant message
      const assistantMsgId = addMessage({
        role: "assistant",
        content: "",
        isStreaming: true,
      });

      try {
        let fullContent = "";
        const toolsUsed: string[] = [];
        let currentSessionId = sessionId;

        for await (const event of streamMessage(text, currentSessionId || undefined)) {
          if (event.type === "session" && event.session_id) {
            currentSessionId = event.session_id;
            setSessionId(event.session_id);
          } else if (event.type === "tool_call" && event.tool) {
            toolsUsed.push(event.tool);
            setActiveToolCalls([...toolsUsed]);
          } else if (event.type === "token" && event.content) {
            fullContent += event.content;
            setStreamingContent(fullContent);
            updateMessage(assistantMsgId, { content: fullContent, isStreaming: true });
          } else if (event.type === "done") {
            updateMessage(assistantMsgId, {
              content: fullContent,
              isStreaming: false,
              toolCalls: toolsUsed,
            });
            setStreamingContent("");
            setActiveToolCalls([]);
          } else if (event.type === "error") {
            updateMessage(assistantMsgId, {
              content: `❌ Error: ${event.message || "Something went wrong. Please check your API keys."}`,
              isStreaming: false,
            });
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Connection error. Is the backend running?";
        updateMessage(assistantMsgId, {
          content: `❌ **Connection Error**\n\n${errorMsg}\n\nPlease make sure the backend server is running on port 8000.`,
          isStreaming: false,
        });
      } finally {
        setLoading(false);
        setStreamingContent("");
        setActiveToolCalls([]);
        inputRef.current?.focus();
      }
    },
    [
      input,
      isLoading,
      sessionId,
      addMessage,
      updateMessage,
      setSessionId,
      setLoading,
      setStreamingContent,
      setActiveToolCalls,
    ]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = async () => {
    if (sessionId) {
      await deleteSession(sessionId).catch(() => {});
    }
    clearChat();
    setInput("");
    inputRef.current?.focus();
  };

  const handleExport = () => {
    const content = messages
      .map((m) => `[${m.role.toUpperCase()}]\n${m.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketmind-session-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 260 : 0,
          minWidth: sidebarOpen ? 260 : 0,
          background: "rgba(8, 11, 20, 0.6)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          overflow: "hidden",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              marginBottom: 16,
            }}
          >
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
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              MarketMind <span className="gradient-text">AI</span>
            </span>
          </Link>

          <button
            onClick={handleNewChat}
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "9px 16px", fontSize: 13 }}
          >
            <Plus size={14} />
            New Campaign Session
          </button>
        </div>

        {/* Quick Prompts in sidebar */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "0 4px",
              marginBottom: 8,
            }}
          >
            Quick Actions
          </p>
          {QUICK_PROMPTS.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.label}
                onClick={() => handleSend(p.prompt)}
                disabled={isLoading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderRadius: 10,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  textAlign: "left",
                  transition: "all 0.15s",
                  marginBottom: 2,
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${p.color}15`,
                    border: `1px solid ${p.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={13} style={{ color: p.color }} />
                </div>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <Link
              href="/campaigns"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "8px",
                borderRadius: 8,
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                fontSize: 12,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <TrendingUp size={13} />
              Dashboard
            </Link>
            {messages.length > 0 && (
              <button
                onClick={handleExport}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Export conversation"
              >
                <Download size={13} />
              </button>
            )}
            {messages.length > 0 && (
              <button
                onClick={handleNewChat}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Clear chat"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div
          style={{
            padding: "0 20px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-subtle)",
            background: "rgba(8,11,20,0.8)",
            backdropFilter: "blur(20px)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-ghost"
              style={{ padding: "6px 8px" }}
            >
              <Sidebar size={16} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10B981",
                  boxShadow: "0 0 8px rgba(16,185,129,0.6)",
                }}
              />
              <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                {isLoading ? "Agent thinking..." : "Agent ready"}
              </span>
              {sessionId && (
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  · {sessionId.slice(0, 8)}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/campaigns" className="btn btn-secondary" style={{ fontSize: 12, padding: "6px 14px" }}>
              <BarChart3 size={13} />
              Campaigns
            </Link>
          </div>
        </div>

        {/* Messages container */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 20px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {isEmpty ? (
            /* Empty state */
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "var(--gradient-brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  boxShadow: "0 8px 30px rgba(124,58,237,0.4)",
                }}
                className="float"
              >
                <Sparkles size={28} color="white" />
              </div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginBottom: 8,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                What are we building today?
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: 36,
                  fontSize: 15,
                  maxWidth: 400,
                  lineHeight: 1.6,
                }}
              >
                I&apos;m your AI marketing strategist. Tell me about your product, audience, or goal.
              </p>

              {/* Quick prompt grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                  maxWidth: 640,
                  width: "100%",
                }}
              >
                {QUICK_PROMPTS.slice(0, 6).map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.label}
                      onClick={() => handleSend(p.prompt)}
                      disabled={isLoading}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        padding: "14px 12px",
                        borderRadius: 12,
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-subtle)",
                        cursor: "pointer",
                        color: "var(--text-secondary)",
                        fontSize: 12,
                        fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "var(--bg-card-hover)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = p.color;
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor =
                          "var(--border-subtle)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: `${p.color}15`,
                          border: `1px solid ${p.color}25`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={16} style={{ color: p.color }} />
                      </div>
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Messages */
            <div
              style={{
                maxWidth: 780,
                width: "100%",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={msg.isStreaming}
                  streamingContent={msg.isStreaming ? streamingContent : undefined}
                />
              ))}

              {isLoading && !messages.some((m) => m.isStreaming) && (
                <StreamingIndicator toolCalls={activeToolCalls} />
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Scroll to bottom button */}
          {showScrollDown && (
            <button
              onClick={scrollToBottom}
              style={{
                position: "sticky",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-secondary)",
                zIndex: 10,
                boxShadow: "var(--shadow-md)",
              }}
            >
              <ChevronDown size={16} />
            </button>
          )}
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "12px 20px 16px",
            borderTop: "1px solid var(--border-subtle)",
            background: "rgba(8,11,20,0.9)",
            backdropFilter: "blur(20px)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              maxWidth: 780,
              margin: "0 auto",
              position: "relative",
            }}
          >
            {/* Active tool indicator */}
            {activeToolCalls.length > 0 && (
              <div
                style={{
                  marginBottom: 8,
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                {activeToolCalls.slice(-2).map((tool) => (
                  <div
                    key={tool}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "rgba(124,58,237,0.1)",
                      border: "1px solid rgba(124,58,237,0.25)",
                      fontSize: 11,
                      color: "var(--brand-purple-light)",
                      fontWeight: 600,
                    }}
                  >
                    ⚙️ {tool.replace(/_/g, " ")}...
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                borderRadius: 16,
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                padding: "10px 12px",
                transition: "border-color 0.2s",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to build a campaign, write copy, research keywords..."
                disabled={isLoading}
                rows={1}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  resize: "none",
                  fontFamily: "'Inter', sans-serif",
                  maxHeight: 180,
                  minHeight: 24,
                  padding: "2px 0",
                }}
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background:
                    input.trim() && !isLoading
                      ? "var(--gradient-brand)"
                      : "var(--bg-surface)",
                  border: "none",
                  cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                  boxShadow:
                    input.trim() && !isLoading
                      ? "0 4px 15px rgba(124,58,237,0.4)"
                      : "none",
                }}
              >
                <Send
                  size={15}
                  style={{
                    color: input.trim() && !isLoading ? "white" : "var(--text-muted)",
                  }}
                />
              </button>
            </div>
            <p
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
