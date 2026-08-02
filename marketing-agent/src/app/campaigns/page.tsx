"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getCampaigns,
  toggleFavorite,
  deleteCampaign,
  formatCampaignType,
  type Campaign,
} from "@/lib/api";
import {
  Sparkles,
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
  Star,
  Trash2,
  Eye,
  Plus,
  ArrowLeft,
  Filter,
  Download,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";

const TYPE_ICONS: Record<string, { icon: typeof Target; color: string }> = {
  strategy: { icon: Target, color: "#A78BFA" },
  ad_copy: { icon: FileText, color: "#60A5FA" },
  email_sequence: { icon: Mail, color: "#22D3EE" },
  landing_page: { icon: Globe, color: "#34D399" },
  social_posts: { icon: TrendingUp, color: "#F472B6" },
  ab_test: { icon: FlaskConical, color: "#FB923C" },
  content_calendar: { icon: Calendar, color: "#60A5FA" },
  seo_research: { icon: Search, color: "#22D3EE" },
  competitor_analysis: { icon: Users, color: "#A78BFA" },
  market_insights: { icon: BarChart3, color: "#34D399" },
  performance_report: { icon: BarChart3, color: "#FB923C" },
  campaign_metrics: { icon: TrendingUp, color: "#F472B6" },
};

const FILTERS = [
  { label: "All", value: "" },
  { label: "Strategy", value: "strategy" },
  { label: "Ad Copy", value: "ad_copy" },
  { label: "Email", value: "email_sequence" },
  { label: "Landing Page", value: "landing_page" },
  { label: "Social", value: "social_posts" },
  { label: "A/B Tests", value: "ab_test" },
  { label: "SEO", value: "seo_research" },
  { label: "Calendar", value: "content_calendar" },
];

function CampaignCard({ campaign, onDelete, onFavorite }: {
  campaign: Campaign;
  onDelete: (id: string) => void;
  onFavorite: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const info = TYPE_ICONS[campaign.campaign_type] || { icon: FileText, color: "#A78BFA" };
  const Icon = info.icon;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(campaign.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([campaign.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${campaign.name.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
  };

  return (
    <div
      className="card"
      style={{
        padding: "20px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Card header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${info.color}15`,
              border: `1px solid ${info.color}25`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={16} style={{ color: info.color }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: 2,
              }}
            >
              {campaign.name}
            </h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span
                style={{
                  fontSize: 11,
                  color: info.color,
                  fontWeight: 600,
                  background: `${info.color}12`,
                  padding: "1px 7px",
                  borderRadius: 999,
                  border: `1px solid ${info.color}25`,
                }}
              >
                {formatCampaignType(campaign.campaign_type)}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {new Date(campaign.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite(campaign.id); }}
            style={{
              padding: "6px",
              borderRadius: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: campaign.is_favorite ? "#FCD34D" : "var(--text-muted)",
            }}
            title="Toggle favorite"
          >
            <Star size={14} fill={campaign.is_favorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleCopy}
            style={{
              padding: "6px",
              borderRadius: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
            title="Copy content"
          >
            {copied ? <Check size={14} style={{ color: "#34D399" }} /> : <Copy size={14} />}
          </button>
          <button
            onClick={handleExport}
            style={{
              padding: "6px",
              borderRadius: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
            title="Export"
          >
            <Download size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(campaign.id); }}
            style={{
              padding: "6px",
              borderRadius: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Preview */}
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.55,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: expanded ? undefined : 3,
          WebkitBoxOrient: "vertical",
          whiteSpace: expanded ? "pre-wrap" : undefined,
          wordBreak: "break-word",
        }}
      >
        {campaign.content}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: 10,
          fontSize: 12,
          color: "var(--text-muted)",
          fontWeight: 600,
        }}
      >
        <Eye size={12} />
        {expanded ? "Show less" : "Show full content"}
        <ChevronRight
          size={12}
          style={{
            transform: expanded ? "rotate(90deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const loadCampaigns = useCallback(async () => {
    try {
      const data = await getCampaigns(activeFilter || undefined);
      setCampaigns(data);
    } catch {
      // Backend not connected - show empty state
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleDelete = async (id: string) => {
    await deleteCampaign(id).catch(() => {});
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleFavorite = async (id: string) => {
    await toggleFavorite(id).catch(() => {});
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_favorite: !c.is_favorite } : c))
    );
  };

  const filtered = campaigns.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = !showFavorites || c.is_favorite;
    return matchesSearch && matchesFavorite;
  });

  const typeStats = campaigns.reduce((acc, c) => {
    acc[c.campaign_type] = (acc[c.campaign_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      {/* Orb decorations */}
      <div className="orb orb-purple" style={{ width: 400, height: 400, top: -100, left: -100, opacity: 0.2 }} />
      <div className="orb orb-blue" style={{ width: 300, height: 300, top: 100, right: -100, opacity: 0.15 }} />

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
          <Link href="/agent" className="btn btn-ghost" style={{ padding: "6px 10px", gap: 6 }}>
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
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Campaign Library
            </span>
          </div>
        </div>

        <Link href="/agent" className="btn btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
          <Plus size={13} />
          New Campaign
        </Link>
      </div>

      <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {[
            { label: "Total Assets", value: campaigns.length, icon: FileText, color: "#A78BFA" },
            { label: "Favorites", value: campaigns.filter((c) => c.is_favorite).length, icon: Star, color: "#FCD34D" },
            { label: "Strategies", value: typeStats.strategy || 0, icon: Target, color: "#60A5FA" },
            { label: "Copy Assets", value: (typeStats.ad_copy || 0) + (typeStats.email_sequence || 0) + (typeStats.landing_page || 0), icon: FileText, color: "#34D399" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="card glass"
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ maxWidth: 280 }}
          />

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1px solid",
                  borderColor:
                    activeFilter === f.value ? "var(--brand-purple)" : "var(--border-subtle)",
                  background:
                    activeFilter === f.value ? "rgba(124,58,237,0.15)" : "transparent",
                  color:
                    activeFilter === f.value
                      ? "var(--brand-purple-light)"
                      : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid",
              borderColor: showFavorites ? "#FCD34D" : "var(--border-subtle)",
              background: showFavorites ? "rgba(252,211,77,0.1)" : "transparent",
              color: showFavorites ? "#FCD34D" : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Star size={12} fill={showFavorites ? "currentColor" : "none"} />
            Favorites
          </button>
        </div>

        {/* Campaign Grid */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="shimmer"
                style={{ height: 140, borderRadius: 16, border: "1px solid var(--border-subtle)" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 40px",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Filter size={22} style={{ color: "var(--text-muted)" }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              {campaigns.length === 0
                ? "No campaigns yet"
                : "No campaigns match your filters"}
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
              {campaigns.length === 0
                ? "Start a conversation with the agent to generate your first campaign!"
                : "Try adjusting your search or filter criteria"}
            </p>
            <Link href="/agent" className="btn btn-primary" style={{ fontSize: 13 }}>
              <Plus size={13} />
              Create First Campaign
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
          >
            {filtered.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onDelete={handleDelete}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
