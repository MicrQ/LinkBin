
import os
import jwt
from fastapi import Depends, HTTPException, Request, status
from dotenv import load_dotenv

load_dotenv()

SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

if not SUPABASE_JWT_SECRET:
    raise RuntimeError("Missing SUPABASE_JWT_SECRET in environment")


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
            algorithms=["HS256"]
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
