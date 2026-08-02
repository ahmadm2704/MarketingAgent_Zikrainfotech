"""
MarketMind AI - FastAPI Main Application
"""
import os
import uuid
import json
import asyncio
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("[INFO] MarketMind AI Agent starting up...")
    print("[INFO] Compiling LangGraph...")
    yield
    print("[INFO] MarketMind AI Agent shutting down...")


app = FastAPI(
    title="MarketMind AI",
    description="Marketing Deep Agent API powered by LangGraph",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ.get("FRONTEND_URL", "http://localhost:3000"),
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Request/Response Models ----

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    stream: Optional[bool] = True


class ChatResponse(BaseModel):
    session_id: str
    message: str
    tool_calls_made: List[str] = []


class SaveCampaignRequest(BaseModel):
    session_id: Optional[str] = None
    name: str
    campaign_type: str
    content: str
    metadata: Optional[dict] = {}


class CampaignResponse(BaseModel):
    id: str
    name: str
    campaign_type: str
    content: str
    is_favorite: bool
    created_at: str


# ---- Health Check ----

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "MarketMind AI",
        "version": "1.0.0",
        "tools_available": 12,
    }


# ---- Chat Endpoint ----

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Main chat endpoint - routes messages through the LangGraph agent.
    Supports streaming and non-streaming responses.
    """
    try:
        from agent.agent import get_agent
        from database.db import (
            create_session,
            get_session,
            save_message,
            get_messages,
        )

        # Get or create session
        session_id = request.session_id or str(uuid.uuid4())

        if not get_session(session_id):
            create_session(session_id)

        # Save user message
        save_message(session_id, "user", request.message)

        # Build message history for agent
        history = get_messages(session_id)
        messages = []
        for msg in history[:-1]:  # Exclude the message we just saved (will be added fresh)
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))

        messages.append(HumanMessage(content=request.message))

        # Run agent
        agent = get_agent()
        state = {"messages": messages, "campaign_context": None, "session_id": session_id}

        result = await asyncio.to_thread(agent.invoke, state)

        # Extract response
        agent_messages = result["messages"]
        last_ai_message = None
        tool_outputs = []
        tool_calls_made = []

        for msg in agent_messages:
            if hasattr(msg, "tool_calls") and msg.tool_calls:
                tool_calls_made.extend([tc["name"] for tc in msg.tool_calls])
            if hasattr(msg, "type") and msg.type == "tool" and hasattr(msg, "content") and msg.content:
                tool_outputs.append(str(msg.content))
            if hasattr(msg, "content") and msg.content and not getattr(msg, "tool_calls", None):
                if hasattr(msg, "type") and msg.type == "ai":
                    last_ai_message = msg.content

        if not last_ai_message:
            # Fallback: get last AI message content
            for msg in reversed(agent_messages):
                if hasattr(msg, "content") and msg.content and isinstance(msg.content, str):
                    last_ai_message = msg.content
                    break

        # Combine tool outputs with the AI's final message
        combined_response = ""
        if tool_outputs:
            combined_response += "### Tool Output\n\n" + "\n\n---\n\n".join(tool_outputs) + "\n\n"
        
        response_content = combined_response + (last_ai_message or "I processed your request but couldn't generate a response. Please try again.")

        # Save assistant message
        save_message(session_id, "assistant", response_content, tool_calls_made)

        return ChatResponse(
            session_id=session_id,
            message=response_content,
            tool_calls_made=tool_calls_made,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")


@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    """Streaming chat endpoint using Server-Sent Events."""

    async def generate():
        try:
            from agent.agent import get_agent
            from database.db import create_session, get_session, save_message, get_messages

            session_id = request.session_id or str(uuid.uuid4())

            if not get_session(session_id):
                create_session(session_id)

            save_message(session_id, "user", request.message)

            history = get_messages(session_id)
            messages = []
            for msg in history[:-1]:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append(AIMessage(content=msg["content"]))
            messages.append(HumanMessage(content=request.message))

            agent = get_agent()
            state = {"messages": messages, "campaign_context": None, "session_id": session_id}

            # Send session_id first
            yield f"data: {{\"type\": \"session\", \"session_id\": \"{session_id}\"}}\n\n"

            full_response = ""
            tool_outputs = []
            tool_calls_made = []

            result = await asyncio.to_thread(agent.invoke, state)

            for msg in result["messages"]:
                if hasattr(msg, "tool_calls") and msg.tool_calls:
                    for tc in msg.tool_calls:
                        tool_name = tc["name"]
                        tool_calls_made.append(tool_name)
                        yield f"data: {{\"type\": \"tool_call\", \"tool\": \"{tool_name}\"}}\n\n"

                if hasattr(msg, "type") and msg.type == "tool" and hasattr(msg, "content") and msg.content:
                    tool_outputs.append(str(msg.content))

                if hasattr(msg, "content") and msg.content and not getattr(msg, "tool_calls", None):
                    if hasattr(msg, "type") and msg.type == "ai":
                        full_response = msg.content

            # Prepend tool outputs to the final response
            if tool_outputs:
                combined_text = "### Tool Output\n\n" + "\n\n---\n\n".join(tool_outputs) + "\n\n" + full_response
                full_response = combined_text
                
                # Auto-save to campaigns
                for idx, t_out in enumerate(tool_outputs):
                    try:
                        from database.db import save_campaign
                        t_name = tool_calls_made[idx] if idx < len(tool_calls_made) else "asset"
                        
                        # Clean up tool name to match frontend campaign_type enum
                        c_type = t_name.replace("generate_", "").replace("research_", "").replace("analyze_", "")
                        if not c_type: c_type = "asset"
                        
                        save_campaign(
                            session_id=session_id,
                            name=t_name.replace("_", " ").title(),
                            campaign_type=c_type,
                            content=t_out,
                            metadata={"auto_saved": True}
                        )
                    except Exception as e:
                        print(f"Failed to auto-save campaign: {e}")
                
            # Stream in chunks
            chunk_size = 50
            for i in range(0, len(full_response), chunk_size):
                chunk = full_response[i:i+chunk_size]
                yield f"data: {{\"type\": \"token\", \"content\": {json.dumps(chunk)}}}\n\n"
                await asyncio.sleep(0.01)

            save_message(session_id, "assistant", full_response, tool_calls_made)
            yield f"data: {{\"type\": \"done\", \"session_id\": \"{session_id}\"}}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ---- Session Endpoints ----

@app.get("/sessions/{session_id}/messages")
async def get_session_messages(session_id: str):
    """Get all messages for a session."""
    try:
        from database.db import get_messages
        messages = get_messages(session_id)
        return {"session_id": session_id, "messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a session and all its messages."""
    try:
        from database.db import get_supabase
        db = get_supabase()
        db.table("messages").delete().eq("session_id", session_id).execute()
        db.table("sessions").delete().eq("session_id", session_id).execute()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---- Campaign Endpoints ----

@app.post("/api/campaigns")
async def save_campaign(request: SaveCampaignRequest):
    """Save a generated marketing asset."""
    try:
        from database.db import save_campaign as db_save_campaign
        campaign = db_save_campaign(
            session_id=request.session_id or "",
            name=request.name,
            campaign_type=request.campaign_type,
            content=request.content,
            metadata=request.metadata,
        )
        return campaign
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/campaigns/stats")
async def get_campaign_stats():
    """Get campaign statistics."""
    try:
        from database.db import get_supabase
        db = get_supabase()
        result = db.table("campaign_stats").select("*").execute()
        return {"stats": result.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/campaigns")
async def get_campaigns(campaign_type: Optional[str] = None):
    """Get all saved campaigns."""
    try:
        from database.db import get_campaigns as db_get_campaigns
        campaigns = db_get_campaigns(campaign_type=campaign_type)
        return {"campaigns": campaigns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/api/campaigns/{campaign_id}/favorite")
async def toggle_favorite(campaign_id: str):
    """Toggle favorite status of a campaign."""
    try:
        from database.db import toggle_campaign_favorite
        result = toggle_campaign_favorite(campaign_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str):
    """Delete a campaign."""
    try:
        from database.db import delete_campaign as db_delete_campaign
        db_delete_campaign(campaign_id)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
