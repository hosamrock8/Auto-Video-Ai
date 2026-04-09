import os
import uuid
from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from mangum import Mangum

# Relative imports for the api package
from .settings_manager import settings_manager
from .test_connection_service import test_connection_service
from .factory_store import get_vault, list_all_vaults, ProjectState
from .mastermind import mastermind
from .generator import generator
from .assembler import assembler
from .scraper import scraper

app = FastAPI(title="Lumina Studio - Production Engine")

# --- Pydantic Models ---
class TestConnectionRequest(BaseModel):
    provider: str
    api_key: str

class GenerateScriptRequest(BaseModel):
    source: str
    config: Dict[str, Any]

# --- Core API Endpoints ---

@app.get("/api/health")
async def health():
    return {
        "status": "online",
        "vercel": os.environ.get("VERCEL") == "1",
        "engine": "Lumina V2.0"
    }

# --- Settings Management ---

@app.get("/api/settings")
async def get_settings():
    return settings_manager.settings

@app.post("/api/settings")
async def update_settings(new_settings: Dict[str, Any]):
    try:
        settings_manager.save(new_settings)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/settings/test")
async def test_connection(req: TestConnectionRequest):
    provider = req.provider.lower()
    api_key = req.api_key
    
    try:
        if provider == "openai":
            return await test_connection_service.test_openai(api_key)
        elif provider in ["fal.ai", "fal"]:
            return await test_connection_service.test_fal(api_key)
        elif provider == "elevenlabs":
            return await test_connection_service.test_elevenlabs(api_key)
        elif provider == "google":
            return await test_connection_service.test_google(api_key)
        elif provider in ["kie.ai", "kie"]:
            return await test_connection_service.test_kie(api_key)
        else:
            return {"status": "error", "message": f"Provider {provider} not supported for testing"}
    except Exception as e:
        # Prevent 500 status by returning a JSON error
        return {"status": "error", "message": f"Internal Server Error: {str(e)}"}

# --- Project & Production Orchestration ---

@app.post("/api/projects/init")
async def init_project():
    project_id = f"lp_{uuid.uuid4().hex[:8]}"
    vault = get_vault(project_id)
    vault.save()
    return {"status": "created", "project_id": project_id}

@app.get("/api/projects")
async def list_projects():
    return list_all_vaults()

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    vault = get_vault(project_id)
    return vault.data

@app.post("/api/projects/{project_id}/generate-script")
async def endpoint_generate_script(project_id: str, req: GenerateScriptRequest, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    
    async def task():
        try:
            # First, use scraper to extract clean content if it's text
            content = await scraper.extract(req.source)
            # Then generate script
            await mastermind.generate_script(vault, content)
        except Exception as e:
            vault.data["status"] = ProjectState.ERROR
            vault.data["error_log"] = f"Script Generation Task Failed: {str(e)}"
            vault.save()

    background_tasks.add_task(task)
    return {"status": "processing"}

@app.post("/api/projects/{project_id}/generate-images")
async def endpoint_generate_images(project_id: str, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    background_tasks.add_task(generator.generate_images_only, vault)
    return {"status": "processing"}

@app.post("/api/projects/{project_id}/generate-videos")
async def endpoint_generate_videos(project_id: str, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    background_tasks.add_task(generator.generate_videos_only, vault)
    return {"status": "processing"}

@app.post("/api/projects/{project_id}/generate-assets")
async def endpoint_generate_assets(project_id: str, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    background_tasks.add_task(generator.generate_all_assets, vault)
    return {"status": "processing"}

@app.post("/api/projects/{project_id}/finalize")
async def endpoint_finalize(project_id: str, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    background_tasks.add_task(assembler.assemble_output, vault)
    return {"status": "processing"}

# --- Vercel Handler ---
handler = Mangum(app)

# --- Standard Catch-all for routing debug ---
@app.get("/{rest_of_path:path}")
async def catch_all(rest_of_path: str):
    return {"path": rest_of_path, "status": "catch_all_active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
