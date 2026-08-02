# 🧠 MarketMind AI — Z360 Deep Agent Challenge

> Your AI-powered Fractional CMO. Built with LangGraph, Next.js, and Supabase.

![MarketMind AI](https://img.shields.io/badge/LangGraph-Agent-purple) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green) ![Supabase](https://img.shields.io/badge/Supabase-DB-teal)

---

## 🎯 What is MarketMind AI?

MarketMind AI is a **Marketing Deep Agent Harness** that acts as your fractional CMO. It's not a generic chatbot — it has deep marketing domain knowledge and 12 custom tools that can execute real marketing workflows end-to-end.

**One core capability done exceptionally well:** *Full-stack marketing campaign execution from strategy to content to analysis — all in one conversation.*

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Supabase account (free tier works)
- OpenAI API key (GPT-4o access)

---

### Frontend Setup

```bash
cd marketing-agent

# Install dependencies (already done)
npm install

# Copy env file
cp .env.local.example .env.local

# Fill in your values in .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:3000

---

### Backend Setup

```bash
cd marketing-agent-backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy env file
copy .env.example .env

# Fill in your .env:
# OPENAI_API_KEY=sk-...
# SUPABASE_URL=https://xxx.supabase.co
# SUPABASE_SERVICE_KEY=your_service_key
# SERPAPI_KEY=your_serpapi_key (optional)

# Start backend
python main.py
# OR: uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

---

### Database Setup (Supabase)

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor
3. Paste and run the contents of `marketing-agent-backend/database/schema.sql`
4. Copy your Project URL and Service Role Key to `.env`

---

## 🛠️ Agent Tools (12 Total)

| Tool | Description | Use Case |
|------|-------------|----------|
| `generate_campaign_strategy` | Full go-to-market campaign strategy | "Build me a Q4 campaign for my SaaS" |
| `generate_ad_copy` | High-converting ads for any platform | "Write 3 Google Ad variants for my product" |
| `generate_email_sequence` | Complete drip campaigns | "Create a 5-email welcome sequence" |
| `generate_landing_page_copy` | Full landing page copy | "Write my landing page hero section" |
| `generate_social_posts` | Platform-optimized social content | "Write Instagram posts about my launch" |
| `generate_ab_test_variants` | A/B test variants with hypotheses | "Give me 4 subject line variants to test" |
| `generate_content_calendar` | Monthly content calendar | "Plan August content for LinkedIn & Twitter" |
| `research_seo_keywords` | Keyword research + content gaps | "Find keywords for 'marketing automation'" |
| `analyze_competitor` | Competitive intelligence | "Analyze HubSpot's marketing strategy" |
| `get_marketing_insights` | Industry trends & benchmarks | "What's working in B2B SaaS marketing?" |
| `analyze_campaign_metrics` | Performance diagnosis + optimization | "Analyze my campaign data and fix it" |
| `generate_performance_report` | Executive marketing reports | "Generate my Q3 performance report" |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js)                 │
│  Landing Page → Agent Chat → Campaigns → Settings   │
│        Streaming SSE │ Zustand State Management      │
└─────────────────────────────────────────────────────┘
                         │ HTTP / SSE
┌─────────────────────────────────────────────────────┐
│              BACKEND (FastAPI + LangGraph)           │
│  /chat (stream) │ /campaigns (CRUD) │ /sessions     │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │           LangGraph Agent Graph             │    │
│  │  [agent] ──tool_call──→ [tool_node]        │    │
│  │     ↑                        │             │    │
│  │     └──────── result ────────┘             │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  Custom Tools: copywriter │ strategy │ research │   │
│               analytics                             │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│                   SUPABASE                          │
│  sessions │ messages │ campaigns │ analytics_events │
└─────────────────────────────────────────────────────┘
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
# Push to GitHub, connect to Vercel
# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Backend → Railway
```bash
# Connect GitHub repo to Railway
# Add environment variables
# Railway auto-detects Dockerfile
```

---

## 📋 API Keys Needed

| Key | Where to Get | Required |
|-----|-------------|----------|
| `OPENAI_API_KEY` | platform.openai.com | ✅ Yes |
| `SUPABASE_URL` | supabase.com dashboard | ✅ Yes |
| `SUPABASE_SERVICE_KEY` | supabase.com → Settings → API | ✅ Yes |
| `ANTHROPIC_API_KEY` | console.anthropic.com | Optional |
| `SERPAPI_KEY` | serpapi.com | Optional |

---

## 📁 Project Structure

```
zikrainfotech project/
├── marketing-agent/              # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── agent/page.tsx    # Agent chat interface
│   │   │   ├── campaigns/page.tsx # Campaign library
│   │   │   └── settings/page.tsx # Settings & API keys
│   │   ├── components/
│   │   │   └── chat/
│   │   │       └── MessageBubble.tsx
│   │   └── lib/
│   │       ├── api.ts            # API client
│   │       └── store.ts          # Zustand state
│   └── vercel.json
│
└── marketing-agent-backend/      # FastAPI Backend
    ├── main.py                   # FastAPI app + all endpoints
    ├── agent/
    │   ├── agent.py              # LangGraph agent harness
    │   └── tools/
    │       ├── copywriter.py     # Ad copy, email, landing page, social
    │       ├── strategy.py       # Campaign strategy, A/B tests, calendar
    │       ├── research.py       # SEO, competitor, market insights
    │       └── analytics.py      # Metrics analysis, reporting
    ├── prompts/
    │   └── system_prompt.py      # Agent identity & instructions
    ├── database/
    │   ├── db.py                 # Supabase operations
    │   └── schema.sql            # Database schema
    └── Dockerfile                # For Railway/Fly.io deployment
```

---

## 💬 Example Prompts

```
"Build me a complete Q4 campaign strategy for a B2B project management tool 
targeting startup CTOs with a $50K budget"

"Write 3 Google Ad variants for my AI writing assistant targeting content 
marketers. Tone should be confident and direct."

"Create a 5-email welcome sequence for new users of my analytics platform. 
Company name is DataFlow."

"Research SEO keywords for 'email marketing automation' in the US market, 
focusing on commercial intent"

"Analyze HubSpot's marketing strategy and find 3 positioning gaps I can exploit"

"Generate a full August content calendar for my fintech startup on 
LinkedIn and Twitter with 3 posts per week"
```
