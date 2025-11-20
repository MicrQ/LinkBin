from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Supabase credentials not set correctly.")


def get_supabase() -> Client:
    """ Returns a Supabase client instance """
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
