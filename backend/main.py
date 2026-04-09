import os
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from mangum import Mangum

app = FastAPI(title="Lumina V2 - Stabilized")

# Prefix Stripping Middleware to handle Vercel's routePrefix logic
@app.middleware("http")
async def strip_prefix(request, call_next):
    # If Vercel passes the /_/backend prefix into the app, we strip it
    path = request.scope.get("path", "")
    if path.startswith("/_/backend"):
        request.scope["path"] = path.replace("/_/backend", "", 1)
    
    # Also handle raw_path if present
    raw_path = request.scope.get("raw_path", b"")
    if raw_path.startswith(b"/_/backend"):
        request.scope["raw_path"] = raw_path.replace(b"/_/backend", b"", 1)
        
    return await call_next(request)

@app.get("/api/health")
async def health():
    return {"status": "stabilized_online", "vercel": os.environ.get("VERCEL")}

@app.get("/{rest_of_path:path}")
async def catch_all(rest_of_path: str):
    return {"path": rest_of_path, "status": "catch_all_active"}

# The handler object Vercel/AWS Lambda look for
handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
