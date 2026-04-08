import os
import uuid
import asyncio
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

from .factory_store import get_vault, list_all_vaults, ProjectState, LuminaVault
from .scraper import scraper
from .post_production import post_production
from .settings_manager import settings_manager
from .test_connection_service import test_connection_service
from .mastermind import mastermind
from .generator import generator
from .assembler import assembler

from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Lumina Studio V2 - AI Personal Production")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated media files (images, audio, video) from the vault
VAULT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "projects_vault")
os.makedirs(VAULT_DIR, exist_ok=True)
app.mount("/projects_vault", StaticFiles(directory=VAULT_DIR), name="projects_vault")

class GenerateRequest(BaseModel):
    source: str
    config: Optional[dict] = None

async def script_pipeline(project_id: str, source: str, config: Optional[dict] = None):
    vault = get_vault(project_id)
    try:
        if config:
            vault.data["config"].update(config)
            vault.save()
            
        # 1. Extraction Phase
        vault.update_status(ProjectState.SCRIPTING)
        content = await scraper.extract(source)
        vault.data["input"] = source
        vault.save()
        
        # 2. Mastermind Phase (Scripting)
        await mastermind.generate_script(vault, content)
        
    except Exception as e:
        vault.data["status"] = ProjectState.ERROR
        vault.data["error_log"] = f"Pipeline Stage 1 Error: {str(e)}"
        vault.save()

@app.get("/api/health")
async def health():
    return {"status": "online", "mode": "V2_DECOUPLED"}

@app.post("/api/projects/init")
async def init_project():
    project_id = f"lp_{uuid.uuid4().hex[:8]}"
    vault = get_vault(project_id)
    vault.save()
    return {"project_id": project_id}

@app.get("/api/projects")
async def list_projects():
    return list_all_vaults()

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    vault = get_vault(project_id)
    return vault.data

@app.post("/api/projects/{project_id}/generate-script")
async def generate_script_endpoint(project_id: str, request: GenerateRequest, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    if vault.data["status"] not in [ProjectState.DRAFT, ProjectState.ERROR]:
        raise HTTPException(status_code=400, detail="Project is already in production or awaiting approval.")
    
    background_tasks.add_task(script_pipeline, project_id, request.source, request.config)
    return {"message": "Script generation started"}

@app.post("/api/projects/{project_id}/generate-images")
async def generate_images_endpoint(project_id: str, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    if vault.data["status"] != ProjectState.AWAITING_SCRIPT_APPROVAL:
        raise HTTPException(status_code=400, detail="Script must be generated/approved before images.")
    
    background_tasks.add_task(generator.generate_images_only, vault)
    return {"message": "Visual Engine has started rendering storyboard"}

@app.post("/api/projects/{project_id}/generate-videos")
async def generate_videos_endpoint(project_id: str, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    if vault.data["status"] != ProjectState.AWAITING_ASSET_APPROVAL and vault.data["status"] != ProjectState.GENERATING_ASSETS:
        # If images are done, it should be AWAITING_ASSET_APPROVAL
        pass
    
    background_tasks.add_task(generator.generate_videos_only, vault)
    return {"message": "Video Engine has started animating scenes"}

@app.post("/api/projects/{project_id}/generate-assets")
async def generate_assets_endpoint(project_id: str, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    if vault.data["status"] != ProjectState.AWAITING_SCRIPT_APPROVAL:
        raise HTTPException(status_code=400, detail="Script must be approved before generating assets.")
    
    background_tasks.add_task(generator.generate_all_assets, vault)
    return {"message": "Asset generation started"}

@app.post("/api/projects/{project_id}/regenerate-scene/{scene_number}")
async def regenerate_scene_endpoint(project_id: str, scene_number: int, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    if vault.data["status"] != ProjectState.AWAITING_ASSET_APPROVAL:
        raise HTTPException(status_code=400, detail="Assets must be generated before you can regenerate a specific scene.")
    
    script = vault.data.get("script")
    scene = next((s for s in script["scenes"] if s["scene_number"] == scene_number), None)
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
        
    background_tasks.add_task(generator.process_scene, vault, scene_number - 1, scene)
    return {"message": f"Regenerating Scene {scene_number}"}

@app.post("/api/projects/{project_id}/finalize")
async def finalize_endpoint(project_id: str, background_tasks: BackgroundTasks):
    vault = get_vault(project_id)
    if vault.data["status"] != ProjectState.AWAITING_ASSET_APPROVAL:
        raise HTTPException(status_code=400, detail="Assets must be approved before finalizing.")
    
    async def final_pipeline(v: LuminaVault):
        # 1. Assemble Video
        await assembler.assemble_output(v)
        # 2. Post-Production
        await post_production.generate_youtube_package(v)
        
    background_tasks.add_task(final_pipeline, vault)
    return {"message": "Final assembly and SEO production started"}

@app.get("/api/settings")
async def get_settings():
    return settings_manager.settings

@app.post("/api/settings")
async def update_settings(new_settings: dict):
    settings_manager.save(new_settings)
    return {"message": "Settings updated"}
@app.post("/api/settings/test")
async def test_settings_connection(payload: dict):
    provider = payload.get("provider")
    api_key = payload.get("api_key")
    
    if provider == "openai":
        return await test_connection_service.test_openai(api_key)
    elif provider == "fal.ai":
        return await test_connection_service.test_fal(api_key)
    elif provider == "elevenlabs":
        return await test_connection_service.test_elevenlabs(api_key)
    elif provider == "google":
        return await test_connection_service.test_google(api_key)
    elif provider == "kie.ai":
        return await test_connection_service.test_kie(api_key)
    
    return {"status": "error", "message": f"Testing not supported for {provider}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
