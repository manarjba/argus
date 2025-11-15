from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base

# Import routers
from app.api.endpoints import articles, operations

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(articles.router, prefix="/api/v1", tags=["articles"])
app.include_router(operations.router, prefix="/api/v1", tags=["operations"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Argus Cybersecurity Threat Intelligence API",
        "version": settings.PROJECT_VERSION
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}