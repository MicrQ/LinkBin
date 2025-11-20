
import os
import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

from db import get_supabase

load_dotenv()

SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

if not SUPABASE_JWT_SECRET:
    raise RuntimeError("Missing SUPABASE_JWT_SECRET in environment")


router = APIRouter(prefix="/auth", tags=["Auth"])


class SignupIn(BaseModel):
    email: EmailStr
    password: str


def extract_token(request: Request) -> str:
    """ Extract the Bearer token from the Authorization header """

    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header"
        )

    return auth_header.split(" ", 1)[1]


def decode_supabase_token(token: str) -> str:
    """ Validates the JWT token and returns the user_id """
    try:
        decoded = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        user_id = decoded.get("sub")

        if not user_id:
            raise ValueError("Token missing subject (sub) claim")

        return user_id

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )


def get_current_user(request: Request) -> str:
    """ FastAPI dependency that returns the authenticated user's ID """

    token = extract_token(request)
    return decode_supabase_token(token)


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(payload: SignupIn):
    """ Create a new user using the Supabase auth API (server-side) """
    supabase = get_supabase()

    try:
        result = supabase.auth.sign_up(
            {"email": payload.email, "password": payload.password}
        )
    except Exception:
        try:
            result = supabase.auth.admin.create_user(
                {"email": payload.email, "password": payload.password}
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create user: {str(e)}"
            )

    if isinstance(result, dict):  # supabase response may vary
        if result.get("error"):
            err = result["error"]
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=err,
            )
        return result.get("data") or result

    # If result is a tuple-like (data, error)
    if hasattr(result, "get") is False and isinstance(result, tuple):
        data, error = result if len(result) == 2 else (result, None)
        if error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(error),
            )
        return data

    return result
