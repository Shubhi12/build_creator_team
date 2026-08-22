from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.router import api_router
from app.seed import seed_db

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Backend API for Creator Business Operating System & Team Marketplace."
)

# Enable CORS for React Native Web / frontend client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed initial data on startup if empty
@app.on_event("startup")
def on_startup():
    try:
        seed_db()
    except Exception as e:
        print(f"Startup seed notice: {e}")

@app.get("/")
def root():
    return {
        "message": "Welcome to Creator OS & Talent Marketplace API",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }

# Include API endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)
