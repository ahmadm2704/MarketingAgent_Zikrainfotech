"""
Marketing Strategy Tools - Campaign strategy, A/B testing, content calendars
"""
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from typing import Optional, List


class CampaignStrategyInput(BaseModel):
    business_description: str = Field(description="What the business does")
    target_audience: str = Field(description="Primary target audience")
    goal: str = Field(description="Campaign goal: brand awareness, lead generation, sales, retention")
    budget: Optional[str] = Field(default=None, description="Approximate budget range")
    timeline: Optional[str] = Field(default="30 days", description="Campaign duration")
    competitors: Optional[str] = Field(default=None, description="Main competitors")
    current_challenges: Optional[str] = Field(default=None, description="Current marketing challenges")


@tool("generate_campaign_strategy", args_schema=CampaignStrategyInput)
def generate_campaign_strategy(
    business_description: str,
    target_audience: str,
    goal: str,
    budget: Optional[str] = None,
    timeline: str = "30 days",
    competitors: Optional[str] = None,
    current_challenges: Optional[str] = None,
) -> str:
    """
    Generate a comprehensive, actionable marketing campaign strategy with channels,
    messaging, tactics, KPIs, and execution roadmap.
    """
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="llama3-8b-8192", temperature=0.7)

    prompt = f"""You are a senior marketing strategist at a top-tier agency (think McKinsey x Creative). 
You've helped scale 100+ businesses from $0 to $10M+ in revenue.

Build a complete marketing campaign strategy:

Business: {business_description}
Target Audience: {target_audience}
Primary Goal: {goal}
Budget: {budget or 'Flexible'}
Timeline: {timeline}
Competitors: {competitors or 'Unknown'}
Current Challenges: {current_challenges or 'None specified'}

Deliver a FULL strategy document with:

# 🎯 CAMPAIGN STRATEGY: [Campaign Name]

## Executive Summary
(3-5 sentence overview)

## Target Audience Analysis
- **Primary Persona:** Name, demographics, psychographics
- **Pain Points:** Top 3-5 pain points
- **Where they hang out:** Channels & platforms
- **Buying triggers:** What motivates them to purchase

## Campaign Positioning & Messaging
- **Core Message:** (One sentence brand promise)
- **Unique Value Proposition:**
- **Key Messages per funnel stage:**
  - Awareness: 
  - Consideration: 
  - Decision:

## Channel Strategy
For each recommended channel:
📺 **[Channel]**
- Why this channel for this audience
- Content type & frequency
- Budget allocation %
- Expected results

## Campaign Timeline & Execution Roadmap
Week-by-week breakdown with specific actions

## KPIs & Success Metrics
- Primary KPI: 
- Secondary KPIs:
- Baseline targets (30/60/90 days)

## Budget Breakdown
Allocation by channel and activity

## Risk Mitigation
Top 3 risks and contingency plans

## Quick Wins (First 7 days)
Immediate actions to gain momentum"""

    response = llm.invoke(prompt)
    return response.content


class ABTestInput(BaseModel):
    asset_type: str = Field(description="Type: ad_headline, email_subject, cta_button, landing_page_hero, pricing")
    current_version: str = Field(description="The current version being tested against")
    context: str = Field(description="Product, audience, and goal context")
    num_variants: Optional[int] = Field(default=4, description="Number of test variants to generate")


@tool("generate_ab_test_variants", args_schema=ABTestInput)
def generate_ab_test_variants(
    asset_type: str,
    current_version: str,
    context: str,
    num_variants: int = 4,
) -> str:
    """
    Generate A/B test variants for any marketing asset with hypothesis and measurement plan.
    """
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="llama3-8b-8192", temperature=0.85)

    prompt = f"""You are a CRO (Conversion Rate Optimization) expert who has run 10,000+ A/B tests.

Generate {num_variants} A/B test variants for: {asset_type}

Current Version (Control): "{current_version}"
Context: {context}

For each variant:

🧪 **VARIANT [N] - [Test Hypothesis Name]**
**Copy:** [The actual variant text]
**Hypothesis:** Why this will outperform the control
**Psychological principle:** (urgency, social proof, curiosity, etc.)
**Expected impact:** High/Medium/Low confidence
**Who to show this to:** (Specific segment if applicable)

---

After all variants, provide:

## 📊 TEST SETUP GUIDE
- **Recommended testing order:** (Which to test first and why)
- **Sample size needed:** (Minimum for statistical significance)
- **Test duration:** (Minimum days to run)
- **Primary metric:** (What to measure)
- **How to declare a winner:** (Statistical threshold)

## 🏆 PREDICTION
Based on best practices, rank which variant is most likely to win and why."""

    response = llm.invoke(prompt)
    return response.content


class ContentCalendarInput(BaseModel):
    business_type: str = Field(description="Type of business")
    platforms: str = Field(description="Comma-separated platforms: instagram, linkedin, twitter, blog, email")
    content_pillars: str = Field(description="Main content themes (e.g., education, inspiration, product, community)")
    month: Optional[str] = Field(default=None, description="Month and year for the calendar (e.g., August 2025)")
    posting_frequency: Optional[str] = Field(default="daily", description="Frequency: daily, 3x/week, 5x/week")


@tool("generate_content_calendar", args_schema=ContentCalendarInput)
def generate_content_calendar(
    business_type: str,
    platforms: str,
    content_pillars: str,
    month: Optional[str] = None,
    posting_frequency: str = "daily",
) -> str:
    """
    Generate a complete monthly content calendar with post ideas, formats, and captions.
    """
    from langchain_groq import ChatGroq
    from datetime import datetime
    llm = ChatGroq(model="llama3-8b-8192", temperature=0.75)

    current_month = month or datetime.now().strftime("%B %Y")

    prompt = f"""You are a content strategist who manages social media for Fortune 500 brands.

Create a full content calendar for {current_month}.

Business: {business_type}
Platforms: {platforms}
Content Pillars: {content_pillars}
Posting Frequency: {posting_frequency}

Format:

# 📅 CONTENT CALENDAR - {current_month}

## Content Pillar Distribution
(Pie breakdown of content types)

## Week 1 (Days 1-7)
For each day:
**📅 [Date] | [Day of Week]**
| Platform | Content Type | Topic/Hook | Caption Preview | Best Time |
|----------|-------------|------------|-----------------|-----------|
| Instagram | Carousel | [Topic] | [First 50 chars...] | 9am EST |

## Week 2 (Days 8-14)
[Same format]

## Week 3 (Days 15-21)
[Same format]

## Week 4 (Days 22-28+)
[Same format]

## 🎯 Monthly Themes & Campaigns
Special events, holidays, or campaigns to leverage

## 📈 Content Mix Recommendations
Ratios and reasoning

## 🔄 Repurposing Strategy
How to turn one piece of content into 10"""

    response = llm.invoke(prompt)
    return response.content
