from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.links import router as links_router
from api.auth import router as auth_router
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="LinkBin API", version="1.0.0")

# CORS
origins = [
    os.getenv('FRONTEND_URL', ''),  # local url or vercl url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(links_router)
app.include_router(auth_router)


@app.get("/", tags=["Health"])
def health():
    return {"status": "ok"}
