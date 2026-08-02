import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent — MarketMind AI",
  description: "Chat with your AI marketing strategist. Build campaigns, write copy, and analyze performance.",
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
