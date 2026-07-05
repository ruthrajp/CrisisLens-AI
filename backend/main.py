import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.routers import incidents, analysis, departments, dashboard
from backend.database import UPLOADS_DIR

app = FastAPI(
    title="CrisisLens AI Backend",
    description="Python FastAPI backend for CrisisLens AI incident triage system",
    version="1.0.0"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for standard dev container routing and reverse proxies
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded media files at /uploads
if os.path.exists(UPLOADS_DIR):
    app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Mount Routers onto /api prefix
app.include_router(incidents.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")
app.include_router(departments.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

# Global Health Check endpoint
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CrisisLens AI Python Backend"
    }

# Global Exception Handler
@app.exception_handler(Exception)
def global_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled Exception occurred for {request.url.path}: {exc}")
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "details": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
