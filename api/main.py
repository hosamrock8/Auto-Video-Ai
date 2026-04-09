import os
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from mangum import Mangum

app = FastAPI(title="Lumina V2 - Stabilized")

# No middleware needed for standard Vercel architecture

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
