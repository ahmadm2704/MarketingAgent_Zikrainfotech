// API client for MarketMind AI backend

const API_BASE = (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) 
  ? "/api" 
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

export interface ChatMessage {
  role: "user" | "assistant" | "tool";
  content: string;
  tool_calls?: string[];
  created_at?: string;
}

export interface ChatResponse {
  session_id: string;
  message: string;
  tool_calls_made: string[];
}

export interface Campaign {
  id: string;
  session_id: string;
  name: string;
  campaign_type: string;
  content: string;
  metadata: Record<string, unknown>;
  is_favorite: boolean;
  created_at: string;
}

// ---- Chat ----

export async function sendMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function* streamMessage(
  message: string,
  sessionId?: string
): AsyncGenerator<{ type: string; content?: string; tool?: string; session_id?: string; message?: string }> {
  const res = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId, stream: true }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          yield data;
        } catch {
          // skip malformed
        }
      }
    }
  }
}

export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/messages`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.messages || [];
}

export async function deleteSession(sessionId: string): Promise<void> {
  await fetch(`${API_BASE}/sessions/${sessionId}`, { method: "DELETE" });
}

// ---- Campaigns ----

export async function getCampaigns(campaignType?: string): Promise<Campaign[]> {
  const params = campaignType ? `?campaign_type=${campaignType}` : "";
  const res = await fetch(`${API_BASE}/campaigns${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.campaigns || [];
}

export async function saveCampaign(data: {
  session_id?: string;
  name: string;
  campaign_type: string;
  content: string;
  metadata?: Record<string, unknown>;
}): Promise<Campaign> {
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function toggleFavorite(campaignId: string): Promise<Campaign> {
  const res = await fetch(`${API_BASE}/campaigns/${campaignId}/favorite`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  await fetch(`${API_BASE}/campaigns/${campaignId}`, { method: "DELETE" });
}

// ---- Health ----

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

// ---- Utility ----

export function formatCampaignType(type: string): string {
  const map: Record<string, string> = {
    strategy: "Campaign Strategy",
    ad_copy: "Ad Copy",
    email_sequence: "Email Sequence",
    landing_page: "Landing Page",
    social_posts: "Social Posts",
    ab_test: "A/B Test",
    content_calendar: "Content Calendar",
    seo_research: "SEO Research",
    competitor_analysis: "Competitor Analysis",
    market_insights: "Market Insights",
    performance_report: "Performance Report",
    campaign_metrics: "Campaign Metrics",
  };
  return map[type] || type;
}

export const CAMPAIGN_TYPE_COLORS: Record<string, string> = {
  strategy: "purple",
  ad_copy: "blue",
  email_sequence: "cyan",
  landing_page: "green",
  social_posts: "pink",
  ab_test: "orange",
  content_calendar: "blue",
  seo_research: "cyan",
  competitor_analysis: "purple",
  market_insights: "green",
  performance_report: "orange",
  campaign_metrics: "pink",
};
