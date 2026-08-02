import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketMind AI — Your Fractional CMO",
  description:
    "MarketMind AI is an intelligent marketing deep agent powered by LangGraph. Generate campaigns, ad copy, email sequences, SEO research, competitor analysis, and more — all in one place.",
  keywords: [
    "AI marketing",
    "marketing agent",
    "campaign strategy",
    "ad copy generator",
    "email marketing AI",
    "SEO tools",
    "LangGraph",
    "marketing automation",
  ],
  openGraph: {
    title: "MarketMind AI — Your Fractional CMO",
    description: "AI-powered marketing intelligence. Build campaigns, write copy, analyze competitors.",
    type: "website",
  },
};

import Background3D from "@/components/3d/Background3D";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Background3D />
        <div style={{ position: "relative", zIndex: 1, height: "100vh", width: "100vw", overflow: "hidden" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
