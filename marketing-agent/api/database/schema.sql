-- MarketMind AI - Supabase Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'tool')),
    content TEXT NOT NULL,
    tool_calls JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_session_idx ON messages(session_id);
CREATE INDEX IF NOT EXISTS messages_created_idx ON messages(created_at);

-- Campaigns / Generated Assets table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT,
    name TEXT NOT NULL,
    campaign_type TEXT NOT NULL,
    -- Types: strategy, ad_copy, email_sequence, landing_page, social_posts,
    --        ab_test, content_calendar, seo_research, competitor_analysis,
    --        market_insights, performance_report, campaign_metrics
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS campaigns_type_idx ON campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS campaigns_session_idx ON campaigns(session_id);
CREATE INDEX IF NOT EXISTS campaigns_favorite_idx ON campaigns(is_favorite);

-- Analytics Events (for tracking agent usage)
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT,
    event_type TEXT NOT NULL,
    tool_used TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) - Enable for production
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Helpful views
CREATE OR REPLACE VIEW campaign_stats AS
SELECT
    campaign_type,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE is_favorite = TRUE) as favorites,
    MAX(created_at) as last_created
FROM campaigns
GROUP BY campaign_type;

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
