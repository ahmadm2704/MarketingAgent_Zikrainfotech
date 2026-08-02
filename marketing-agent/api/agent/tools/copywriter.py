"""
AI Copywriter Tools - Generates marketing copy across all formats
"""
from langchain_core.tools import tool
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Union


class AdCopyInput(BaseModel):
    product_name: str = Field(description="Name of the product or service")
    target_audience: str = Field(description="Description of the target audience")
    key_benefits: str = Field(description="Main benefits or value propositions")
    tone: Optional[str] = Field(default="professional", description="Tone: professional, friendly, urgent, witty, luxury")
    platform: Optional[str] = Field(default="google", description="Platform: google, facebook, instagram, linkedin, twitter")
    variants: Optional[str] = Field(default="3", description="Number of copy variants to generate (as a string, e.g. '3')")


@tool("generate_ad_copy", args_schema=AdCopyInput)
def generate_ad_copy(
    product_name: str,
    target_audience: str,
    key_benefits: str,
    tone: str = "professional",
    platform: str = "google",
    variants: str = "3",
) -> str:
    """
    Generate high-converting advertising copy for a product/service.
    Creates multiple variants optimized for the specified platform.
    """
    try:
        variants_int = int(variants)
    except:
        variants_int = 3
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="mixtral-8x7b-32768", temperature=0.8)

    platform_specs = {
        "google": "Google Ads (headlines max 30 chars, descriptions max 90 chars)",
        "facebook": "Facebook/Meta Ads (primary text 125 chars, headline 27 chars)",
        "instagram": "Instagram Ads (caption 2200 chars, punchy hooks)",
        "linkedin": "LinkedIn Ads (professional tone, B2B focused, 150 char headline)",
        "twitter": "Twitter/X Ads (max 280 characters, hashtags included)",
    }

    spec = platform_specs.get(platform, platform_specs["google"])

    prompt = f"""You are an expert marketing copywriter with 15+ years of experience writing high-converting ads.

Create {variants_int} distinct ad copy variants for {spec}.

Product/Service: {product_name}
Target Audience: {target_audience}
Key Benefits: {key_benefits}
Tone: {tone}

For each variant provide:
1. **Headline** (attention-grabbing)
2. **Body Copy** (persuasive, benefit-focused)
3. **CTA** (clear call-to-action)
4. **Why it works** (brief reasoning)

Format each variant clearly with "VARIANT X:" header.
Use psychological triggers: urgency, social proof, fear of missing out, or benefit stacking as appropriate.
Make each variant distinctly different in approach."""

    response = llm.invoke(prompt)
    return response.content


class EmailSequenceInput(BaseModel):
    product_name: str = Field(description="Product or service name")
    goal: str = Field(description="Sequence goal: welcome, nurture, sales, re-engagement, onboarding")
    target_audience: str = Field(description="Target audience description")
    num_emails: Optional[str] = Field(default="5", description="Number of emails in sequence (as a string, e.g. '5')")
    company_name: Optional[str] = Field(default="Your Company", description="Company name")


@tool("generate_email_sequence", args_schema=EmailSequenceInput)
def generate_email_sequence(
    product_name: str,
    goal: str,
    target_audience: str,
    num_emails: str = "5",
    company_name: str = "Your Company",
) -> str:
    """
    Generate a complete email marketing sequence/drip campaign.
    Includes subject lines, preview text, body, and send timing.
    """
    try:
        num_emails_int = int(num_emails)
    except:
        num_emails_int = 5
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="mixtral-8x7b-32768", temperature=0.7)

    prompt = f"""You are an expert email marketing strategist who has written sequences for 500+ companies.

Create a {num_emails_int}-email {goal} sequence for {company_name}.

Product/Service: {product_name}
Audience: {target_audience}
Goal: {goal}

For each email provide:
📧 **EMAIL [N]: [Title]**
- **Send timing:** [Day X after trigger]
- **Subject Line:** [Compelling subject, 40-60 chars]
- **Preview Text:** [Curiosity-driving preview, 35-90 chars]
- **Body:**
  [Full email body with proper structure: hook, value, CTA]
- **CTA Button Text:** [Action-oriented button]
- **Goal of this email:** [What it achieves in the sequence]

---

Make each email build on the previous. Include storytelling, social proof, objection handling, and escalating urgency where appropriate."""

    response = llm.invoke(prompt)
    return response.content


class LandingPageInput(BaseModel):
    product_name: str = Field(description="Product or service name")
    target_audience: str = Field(description="Primary audience")
    main_benefit: str = Field(description="The #1 transformation or benefit")
    key_features: str = Field(description="Top 3-5 features")
    price_point: Optional[str] = Field(default=None, description="Price or pricing model")
    social_proof: Optional[str] = Field(default=None, description="Any testimonials, metrics, or logos to mention")


@tool("generate_landing_page_copy", args_schema=LandingPageInput)
def generate_landing_page_copy(
    product_name: str,
    target_audience: str,
    main_benefit: str,
    key_features: str,
    price_point: Optional[str] = None,
    social_proof: Optional[str] = None,
) -> str:
    """
    Generate complete landing page copy including hero, features, benefits, FAQ, and CTA sections.
    """
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="mixtral-8x7b-32768", temperature=0.7)

    prompt = f"""You are a world-class conversion copywriter (think David Ogilvy meets CXL).

Write complete landing page copy for:
Product: {product_name}
Audience: {target_audience}
Main Benefit: {main_benefit}
Features: {key_features}
Price: {price_point or 'Not specified'}
Social Proof: {social_proof or 'None provided'}

Write ALL sections:

## 🎯 HERO SECTION
**H1 Headline:** (Bold, benefit-driven, <10 words)
**Subheadline:** (Expand on H1, clarify who it's for, 1-2 sentences)
**Hero CTA:** 
**Secondary CTA:**

## 💡 PROBLEM SECTION
(Agitate the pain points your audience feels)

## ✨ SOLUTION SECTION
(Position product as the bridge from pain to transformation)

## 🔥 FEATURES & BENEFITS
(For each feature: Feature → Benefit → Emotional payoff)

## 👥 SOCIAL PROOF SECTION
(Testimonial templates, stats, trust badges)

## ❓ FAQ SECTION
(5-7 objection-handling questions and answers)

## 💰 PRICING/CTA SECTION
(Value stacking, risk reversal, urgency)

## 📝 FOOTER CTA
(Final compelling close)"""

    response = llm.invoke(prompt)
    return response.content


class SocialPostsInput(BaseModel):
    topic: str = Field(description="Topic, product, or campaign to write about")
    platforms: Optional[str] = Field(default="instagram,linkedin,twitter", description="Comma-separated platforms")
    tone: Optional[str] = Field(default="engaging", description="Tone of the posts")
    num_posts_per_platform: Optional[int] = Field(default=3, description="Posts per platform")


@tool("generate_social_posts", args_schema=SocialPostsInput)
def generate_social_posts(
    topic: str,
    platforms: str = "instagram,linkedin,twitter",
    tone: str = "engaging",
    num_posts_per_platform: int = 3,
) -> str:
    """
    Generate social media posts optimized for each platform's format and audience.
    """
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="mixtral-8x7b-32768", temperature=0.85)

    platform_list = [p.strip() for p in platforms.split(",")]

    prompt = f"""You are a viral social media strategist with millions of followers across platforms.

Create {num_posts_per_platform} posts for each of these platforms: {', '.join(platform_list)}

Topic: {topic}
Tone: {tone}

Platform-specific guidelines:
- Instagram: Storytelling, emojis, 5-10 hashtags, engaging hook in first line
- LinkedIn: Professional insights, thought leadership, 3 hashtags max, data-driven
- Twitter/X: Punchy, threads welcome, 1-3 hashtags, conversational
- Facebook: Community-focused, longer narrative OK, question to spark comments
- TikTok: Script format, trending hooks, challenge or educational angle

For each post provide:
📱 **[PLATFORM] - Post [N]**
[Full post text]
**Hashtags:** 
**Best posting time:** 
**Expected engagement type:** (saves, shares, comments, etc.)

---"""

    response = llm.invoke(prompt)
    return response.content
