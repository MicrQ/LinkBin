from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, HttpUrl
from auth import get_current_user
from db import get_supabase

router = APIRouter(prefix="/links", tags=["Links"])


class LinkIn(BaseModel):
    title: str
    url: HttpUrl


class LinkOut(BaseModel):
    id: int
    title: str
    url: HttpUrl
    created_at: str


@router.get("/", response_model=List[LinkOut])
def get_links(user_id: str = Depends(get_current_user)):
    """Return all links owned by the authenticated user."""
    supabase = get_supabase()

    result = (
        supabase
        .table("links")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return result.data


@router.post("/", response_model=LinkOut, status_code=status.HTTP_201_CREATED)
def create_link(payload: LinkIn, user_id: str = Depends(get_current_user)):
    """Create a new link for the authenticated user."""
    supabase = get_supabase()

    data = {
        "title": payload.title,
        "url": str(payload.url),
        "user_id": user_id,
    }

    result = (
        supabase
        .table("links")
        .insert(data)
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to insert link"
        )

    return result.data[0]
