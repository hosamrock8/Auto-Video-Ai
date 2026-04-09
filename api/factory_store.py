import os
import sys
import json
from datetime import datetime
from typing import List

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

IS_VERCEL = os.environ.get("VERCEL") == "1"
if IS_VERCEL:
    PROJECTS_DIR = "/tmp/projects_vault"
else:
    PROJECTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "projects_vault")

# Ensure directory exists (on Vercel /tmp is writable)
try:
    os.makedirs(PROJECTS_DIR, exist_ok=True)
except Exception as e:
    print(f"--- [STORAGE WARNING] Could not ensure PROJECTS_DIR: {e} ---")

from settings_manager import settings_manager

class ProjectState:
    DRAFT = "draft"
    SCRIPTING = "scripting"
    AWAITING_SCRIPT_APPROVAL = "awaiting_script_approval"
    GENERATING_ASSETS = "generating_assets"
    AWAITING_ASSET_APPROVAL = "awaiting_asset_approval"
    ASSEMBLING = "assembling"
    COMPLETED = "completed"
    ERROR = "error"

class LuminaVault:
    def __init__(self, project_id: str):
        self.id = project_id
        self.path = os.path.join(PROJECTS_DIR, project_id)
        os.makedirs(self.path, exist_ok=True)
        self.state_file = os.path.join(self.path, "state.json")
        self.data = self._load()

    def _load(self) -> dict:
        if os.path.exists(self.state_file):
            try:
                with open(self.state_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"--- [VAULT ERROR] Load failed ({self.id}): {e} ---")
        
        return {
            "id": self.id,
            "status": ProjectState.DRAFT,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "config": {"language": "ar", "style": "3d-cartoon", "ratio": "9:16"},
            "input": None,
            "script": None,
            "assets": {"audio": [], "images": [], "video_clips": []},
            "costs": {"total": 0.0, "details": []},
            "seo": {"title": "", "desc": "", "tags": []},
            "error_log": None
        }

    def save(self):
        self.data["updated_at"] = datetime.now().isoformat()
        with open(self.state_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)

    def log_cost(self, provider: str, model: str, cost: float, engine: str = "llm"):
        self.data["costs"]["details"].append({
            "provider": provider, "model": model, "cost": cost, "time": datetime.now().isoformat()
        })
        self.data["costs"]["total"] += cost
        
        # Update global telemetry
        settings_manager.record_usage(engine, cost)
        
        self.save()

    def update_status(self, status: str):
        self.data["status"] = status
        self.save()

def get_vault(project_id: str) -> LuminaVault:
    return LuminaVault(project_id)

def list_all_vaults() -> List[dict]:
    if not os.path.exists(PROJECTS_DIR):
        return []
    
    projects = []
    for d in os.listdir(PROJECTS_DIR):
        p_path = os.path.join(PROJECTS_DIR, d)
        if os.path.isdir(p_path):
            state_file = os.path.join(p_path, "state.json")
            if os.path.exists(state_file):
                try:
                    with open(state_file, 'r', encoding='utf-8') as f:
                        projects.append(json.load(f))
                except: pass
    return projects
