"""
MarketMind AI - LangGraph Marketing Deep Agent
Main agent harness with custom marketing tools
"""
import os
import json
from typing import TypedDict, Annotated, List, Optional
from datetime import datetime

from langchain_groq import ChatGroq
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode

from agent.tools.copywriter import (
    generate_ad_copy,
    generate_email_sequence,
    generate_landing_page_copy,
    generate_social_posts,
)
from agent.tools.strategy import (
    generate_campaign_strategy,
    generate_ab_test_variants,
    generate_content_calendar,
)
from agent.tools.research import (
    research_seo_keywords,
    analyze_competitor,
    get_marketing_insights,
)
from agent.tools.analytics import (
    analyze_campaign_metrics,
    generate_performance_report,
)
from prompts.system_prompt import MARKETING_AGENT_SYSTEM_PROMPT


class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    campaign_context: Optional[dict]
    session_id: Optional[str]


def create_marketing_agent():
    """Create and return the compiled LangGraph marketing agent."""

    # Define all tools
    tools = [
        generate_ad_copy,
        generate_email_sequence,
        generate_landing_page_copy,
        generate_social_posts,
        generate_campaign_strategy,
        generate_ab_test_variants,
        generate_content_calendar,
        research_seo_keywords,
        analyze_competitor,
        get_marketing_insights,
        analyze_campaign_metrics,
        generate_performance_report,
    ]

    # Initialize the LLM
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.7,
    )

    # Bind tools to LLM
    llm_with_tools = llm.bind_tools(tools)

    # Build the agent node
    def agent_node(state: AgentState):
        messages = state["messages"]
        # Add system prompt if first message
        if not any(isinstance(m, SystemMessage) for m in messages):
            messages = [SystemMessage(content=MARKETING_AGENT_SYSTEM_PROMPT)] + list(messages)

        response = llm_with_tools.invoke(messages)
        return {"messages": [response]}

    def should_continue(state: AgentState):
        """Determine whether to call tools or end."""
        messages = state["messages"]
        last_message = messages[-1]
        if hasattr(last_message, "tool_calls") and last_message.tool_calls:
            return "tools"
        return END

    # Build the graph
    tool_node = ToolNode(tools)

    workflow = StateGraph(AgentState)
    workflow.add_node("agent", agent_node)
    workflow.add_node("tools", tool_node)
    workflow.set_entry_point("agent")
    workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
    workflow.add_edge("tools", "agent")

    return workflow.compile()


# Singleton agent instance
_agent = None


def get_agent():
    global _agent
    if _agent is None:
        _agent = create_marketing_agent()
    return _agent
