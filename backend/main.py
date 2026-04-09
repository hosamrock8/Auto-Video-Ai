import os
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="Lumina MINIMAL")

@app.get("/api/health")
async def health():
    return {"status": "minimal_online", "vercel": os.environ.get("VERCEL")}

@app.get("/{rest_of_path:path}")
async def catch_all(rest_of_path: str):
    return {"path": rest_of_path, "status": "catch_all_active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
