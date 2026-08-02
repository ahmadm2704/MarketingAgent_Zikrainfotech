"""
Research Tools - SEO keyword research, competitor analysis, market insights
"""
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from typing import Optional


class SEOKeywordInput(BaseModel):
    topic: str = Field(description="Main topic or product to research keywords for")
    industry: Optional[str] = Field(default=None, description="Industry vertical")
    target_country: Optional[str] = Field(default="US", description="Target country for keywords")
    keyword_intent: Optional[str] = Field(default="all", description="Intent: informational, commercial, transactional, navigational, all")


@tool("research_seo_keywords", args_schema=SEOKeywordInput)
def research_seo_keywords(
    topic: str,
    industry: Optional[str] = None,
    target_country: str = "US",
    keyword_intent: str = "all",
) -> str:
    """
    Research SEO keywords, search intent, content gaps, and meta tag recommendations
    for a given topic or product.
    """
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.5)

    prompt = f"""You are an SEO expert with access to keyword research data patterns for the {target_country} market.

Perform comprehensive keyword research for:
Topic: {topic}
Industry: {industry or 'General'}
Intent Filter: {keyword_intent}

Provide:

# 🔍 SEO KEYWORD RESEARCH REPORT

## Primary Keywords (High Priority)
| Keyword | Est. Monthly Volume | Difficulty | Intent | CPC Est. |
|---------|--------------------|-----------  |--------|----------|
[10 primary keywords]

## Long-tail Keywords (Low Competition, High Intent)
| Keyword | Est. Volume | Difficulty | Why Target This |
|---------|------------|------------|-----------------|
[15 long-tail keywords]

## Question Keywords (Featured Snippet Opportunities)
- [10 question-based keywords people search]

## Negative Keywords (Exclude from Paid Ads)
[Keywords that would waste budget]

## Content Gap Analysis
Topics competitors rank for that you should create content about:
1. 
2.
...

## Recommended Content Strategy
Top 5 content pieces to create with target keywords

## Meta Tag Templates
**Title Tag Formula:** [Template with primary keyword]
**Meta Description Formula:** [Template, 150-160 chars]

## 🚀 Quick Win Opportunities
Keywords where ranking on page 1 is achievable within 60-90 days"""

    response = llm.invoke(prompt)
    return response.content


class CompetitorInput(BaseModel):
    competitor_name: str = Field(description="Competitor brand or company name")
    your_product: Optional[str] = Field(default=None, description="Your product/service for comparison")
    analysis_focus: Optional[str] = Field(default="all", description="Focus: messaging, pricing, channels, content, all")


@tool("analyze_competitor", args_schema=CompetitorInput)
def analyze_competitor(
    competitor_name: str,
    your_product: Optional[str] = None,
    analysis_focus: str = "all",
) -> str:
    """
    Analyze competitor marketing strategy including messaging, positioning, channels,
    and identify gaps and opportunities.
    """
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.6)

    prompt = f"""You are a competitive intelligence analyst who helps brands outmaneuver competitors.

Analyze the marketing strategy of: {competitor_name}
Your product (for comparison): {your_product or 'Not specified'}
Analysis focus: {analysis_focus}

Note: Base this on general knowledge of this brand's typical marketing patterns.

# 🕵️ COMPETITOR ANALYSIS: {competitor_name}

## Brand Positioning & Messaging
- **Tagline/Brand Promise:**
- **Core Value Proposition:**
- **Target Audience Segments:**
- **Brand Voice & Tone:**
- **Key Messages they use:**

## Marketing Channels (Estimated Activity)
| Channel | Activity Level | Estimated Spend | Strategy |
|---------|---------------|-----------------|----------|

## Content Strategy
- **Content pillars they focus on:**
- **Content formats they use:**
- **Publishing frequency:**
- **Top performing content types:**

## Pricing & Packaging
- **Price positioning:** (premium/mid/budget)
- **Pricing model:**
- **Common promotional tactics:**

## Strengths & Weaknesses
**Strengths:**
1. 
2.
3.

**Weaknesses/Gaps:**
1.
2.
3.

## Your Competitive Opportunities
Based on their gaps, here's how to differentiate:
1.
2.
3.

## Counter-Messaging Strategy
How to position against them:
- **Their claim:** → **Your counter:** 

## Channels They're Ignoring
Opportunities to capture audience they're missing"""

    response = llm.invoke(prompt)
    return response.content


class MarketInsightsInput(BaseModel):
    industry: str = Field(description="Industry or market to research")
    specific_question: Optional[str] = Field(default=None, description="Specific marketing question or challenge")


@tool("get_marketing_insights", args_schema=MarketInsightsInput)
def get_marketing_insights(
    industry: str,
    specific_question: Optional[str] = None,
) -> str:
    """
    Get current marketing trends, benchmarks, and actionable insights for a specific industry.
    """
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.65)

    prompt = f"""You are a market research analyst and marketing consultant specializing in {industry}.

Provide comprehensive marketing insights for the {industry} industry.
{f'Specific question: {specific_question}' if specific_question else ''}

# 📊 MARKETING INSIGHTS: {industry.upper()}

## Industry Trends (Current)
Top 5 marketing trends shaping this industry right now:
1.
2.
...

## Benchmark Metrics
| Metric | Industry Average | Top Quartile |
|--------|-----------------|--------------|
| Email Open Rate | | |
| Ad CTR | | |
| Conversion Rate | | |
| CAC (Customer Acquisition Cost) | | |
| LTV:CAC Ratio | | |
| Social Engagement Rate | | |

## What's Working Right Now
Top 3 marketing tactics driving results in {industry}:

## What's NOT Working Anymore
Tactics that are losing effectiveness:

## Audience Behavior Shifts
How target customers in this industry are changing:

## Channel Performance Rankings
Best to worst performing channels for this industry:
1. 🥇 (Best)
2.
...

## Best Practices from Top Performers
What market leaders are doing differently:

## Emerging Opportunities
Underexplored channels or tactics with high potential:

## Actionable Recommendations
Top 5 immediate actions for a {industry} business:
1.
2.
..."""

    response = llm.invoke(prompt)
    return response.content
