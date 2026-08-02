"""
Analytics Tools - Campaign performance analysis and reporting
"""
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from typing import Optional


class CampaignMetricsInput(BaseModel):
    campaign_data: str = Field(description="Campaign metrics as JSON or plain text (impressions, clicks, conversions, spend, revenue, etc.)")
    campaign_type: Optional[str] = Field(default="paid_ads", description="Type: paid_ads, email, social, seo, content")
    goal: Optional[str] = Field(default=None, description="Original campaign goal")


@tool("analyze_campaign_metrics", args_schema=CampaignMetricsInput)
def analyze_campaign_metrics(
    campaign_data: str,
    campaign_type: str = "paid_ads",
    goal: Optional[str] = None,
) -> str:
    """
    Analyze campaign performance metrics and provide deep insights, diagnosis,
    and specific optimization recommendations.
    """
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="llama3-8b-8192", temperature=0.5)

    prompt = f"""You are a data-driven marketing analyst who has optimized thousands of campaigns.

Analyze this {campaign_type} campaign performance:

Data Provided:
{campaign_data}

Campaign Goal: {goal or 'Not specified'}

# 📊 CAMPAIGN PERFORMANCE ANALYSIS

## Key Metrics Summary
Calculate and present:
- CTR (Click-through rate)
- Conversion Rate
- CPC (Cost per click)
- CPA (Cost per acquisition)
- ROAS (Return on ad spend) if revenue data available
- Overall performance vs. industry benchmarks

## Performance Diagnosis

### 🟢 What's Working Well
Specific strengths with data backing

### 🔴 Critical Issues Found
Problems that are costing money or limiting growth

### 🟡 Areas for Improvement
Middle-ground opportunities

## Root Cause Analysis
For each issue identified, explain the likely root cause

## Optimization Action Plan

### Immediate Actions (This Week)
| Priority | Action | Expected Impact | Effort |
|----------|--------|-----------------|--------|

### Short-term Optimizations (30 days)
| Action | Why | Expected Result |
|--------|-----|-----------------|

### Strategic Recommendations (90 days)
Long-term strategy changes based on this data

## Projected Impact
If you implement these recommendations, estimate:
- Expected improvement in key metrics
- Projected ROI improvement

## A/B Tests to Run
Based on this data, prioritize these tests next"""

    response = llm.invoke(prompt)
    return response.content


class PerformanceReportInput(BaseModel):
    period: str = Field(description="Reporting period (e.g., 'Q3 2025', 'July 2025', 'Last 30 days')")
    channels: str = Field(description="Channels to include (e.g., 'Google Ads, Email, Instagram')")
    business_goals: str = Field(description="Business goals for this period")
    raw_data: Optional[str] = Field(default=None, description="Any raw data to include in analysis")


@tool("generate_performance_report", args_schema=PerformanceReportInput)
def generate_performance_report(
    period: str,
    channels: str,
    business_goals: str,
    raw_data: Optional[str] = None,
) -> str:
    """
    Generate a comprehensive executive marketing performance report with insights and next steps.
    """
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="llama3-8b-8192", temperature=0.5)

    prompt = f"""You are a CMO preparing a comprehensive marketing performance report for the board.

Reporting Period: {period}
Channels: {channels}
Business Goals: {business_goals}
Additional Data: {raw_data or 'None provided'}

Generate a professional executive report:

# 📈 MARKETING PERFORMANCE REPORT
## {period}

---

## Executive Summary
3-4 sentence overview of the period's performance, key wins, and challenges.

## Business Goal Progress
| Goal | Target | Achieved | Status |
|------|--------|----------|--------|

## Channel Performance Overview
For each channel:
### [Channel Name]
- **Key Metrics:** 
- **vs. Previous Period:** 
- **vs. Target:** 
- **Notable Insights:**

## Top Wins This Period 🏆
1.
2.
3.

## Lessons Learned 📚
Key learnings from what didn't work

## Budget Utilization
Spend breakdown and ROI by channel

## Competitive Landscape
Any notable competitor moves or market changes

## Recommendations for Next Period
**Top 3 priorities for {period} +1:**
1.
2.
3.

## Resource Requests
Budget or team resource needs for next period

---
*Report prepared by MarketMind AI Agent*"""

    response = llm.invoke(prompt)
    return response.content
