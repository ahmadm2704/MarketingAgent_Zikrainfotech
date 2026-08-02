"""
Supabase Database Manager - Handles all DB operations for MarketMind AI
"""
import os
from supabase import create_client, Client
from datetime import datetime
from typing import Optional, List, Dict, Any

_supabase_client: Optional[Client] = None


def get_supabase() -> Client:
    global _supabase_client
    if _supabase_client is None:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
        _supabase_client = create_client(url, key)
    return _supabase_client


# ---- Sessions ----

def create_session(session_id: str, metadata: Dict = None) -> Dict:
    """Create a new chat session."""
    db = get_supabase()
    data = {
        "session_id": session_id,
        "created_at": datetime.utcnow().isoformat(),
        "metadata": metadata or {},
    }
    result = db.table("sessions").insert(data).execute()
    return result.data[0] if result.data else data


def get_session(session_id: str) -> Optional[Dict]:
    """Get session by ID."""
    db = get_supabase()
    result = db.table("sessions").select("*").eq("session_id", session_id).execute()
    return result.data[0] if result.data else None


# ---- Messages ----

def save_message(session_id: str, role: str, content: str, tool_calls: List = None) -> Dict:
    """Save a message to the database."""
    db = get_supabase()
    data = {
        "session_id": session_id,
        "role": role,
        "content": content,
        "tool_calls": tool_calls or [],
        "created_at": datetime.utcnow().isoformat(),
    }
    result = db.table("messages").insert(data).execute()
    return result.data[0] if result.data else data


def get_messages(session_id: str) -> List[Dict]:
    """Get all messages for a session."""
    db = get_supabase()
    result = (
        db.table("messages")
        .select("*")
        .eq("session_id", session_id)
        .order("created_at")
        .execute()
    )
    return result.data or []


# ---- Campaigns ----

def save_campaign(
    session_id: str,
    name: str,
    campaign_type: str,
    content: str,
    metadata: Dict = None,
) -> Dict:
    """Save a generated campaign/asset to the database."""
    db = get_supabase()
    data = {
        "session_id": session_id,
        "name": name,
        "campaign_type": campaign_type,
        "content": content,
        "metadata": metadata or {},
        "created_at": datetime.utcnow().isoformat(),
        "is_favorite": False,
    }
    result = db.table("campaigns").insert(data).execute()
    return result.data[0] if result.data else data


def get_campaigns(session_id: Optional[str] = None, campaign_type: Optional[str] = None) -> List[Dict]:
    """Get campaigns with optional filters."""
    db = get_supabase()
    query = db.table("campaigns").select("*")
    if session_id:
        query = query.eq("session_id", session_id)
    if campaign_type:
        query = query.eq("campaign_type", campaign_type)
    result = query.order("created_at", desc=True).execute()
    return result.data or []


def toggle_campaign_favorite(campaign_id: str) -> Dict:
    """Toggle favorite status of a campaign."""
    db = get_supabase()
    campaign = db.table("campaigns").select("is_favorite").eq("id", campaign_id).execute()
    if campaign.data:
        new_val = not campaign.data[0]["is_favorite"]
        result = db.table("campaigns").update({"is_favorite": new_val}).eq("id", campaign_id).execute()
        return result.data[0] if result.data else {}
    return {}


def delete_campaign(campaign_id: str) -> bool:
    """Delete a campaign."""
    db = get_supabase()
    db.table("campaigns").delete().eq("id", campaign_id).execute()
    return True
