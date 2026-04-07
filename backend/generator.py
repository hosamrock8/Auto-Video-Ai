import os
import asyncio
import httpx
from typing import List, Optional, Dict, Any
from tenacity import retry, stop_after_attempt, wait_exponential

from .factory_store import LuminaVault, ProjectState
from .settings_manager import settings_manager

class LuminaGenerator:
    def __init__(self):
        self.semaphore = asyncio.Semaphore(5) # Max 5 parallel generations

    def _get_config(self, engine_name: str) -> Dict[str, Any]:
        return settings_manager.get_engine_config(engine_name)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def generate_audio(self, vault: LuminaVault, scene_idx: int, text: str):
        config = self._get_config("audio")
        provider = config["provider"]
        api_key = config["api_key"] or os.getenv("ELEVENLABS_API_KEY")
        
        async with self.semaphore:
            if provider == "elevenlabs":
                voice_id = "pNInz6obpg8ndEao7m8D" # Rachel (Example)
                base_url = config["custom_endpoint"] or "https://api.elevenlabs.io/v1/text-to-speech"
                url = f"{base_url}/{voice_id}"
                
                headers = {"xi-api-key": api_key, "Content-Type": "application/json"}
                data = {
                    "text": text,
                    "model_id": config["model_id"] or "eleven_multilingual_v2",
                    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
                }

                async with httpx.AsyncClient() as client:
                    response = await client.post(url, json=data, timeout=60.0)
                    if response.status_code == 200:
                        audio_dir = os.path.join(vault.path, "audio")
                        os.makedirs(audio_dir, exist_ok=True)
                        file_path = os.path.join(audio_dir, f"scene_{scene_idx+1}.mp3")
                        with open(file_path, "wb") as f:
                            f.write(response.content)
                        vault.log_cost("elevenlabs", config["model_id"], (len(text) / 1000) * 0.01)
                        return f"/projects_vault/{vault.id}/audio/scene_{scene_idx+1}.mp3"
            
            # Fallback for other providers like fal.ai / kie.ai
            elif provider in ["fal.ai", "kie.ai"]:
                url = config["custom_endpoint"] or f"https://fal.run/{config['model_id']}"
                headers = {"Authorization": f"Key {api_key}", "Content-Type": "application/json"}
                data = {"input": text} # Simplified for generic audio APIs

                async with httpx.AsyncClient() as client:
                    response = await client.post(url, json=data, timeout=60.0)
                    if response.status_code == 200:
                        result = response.json()
                        audio_url = result.get("audio_url") or result.get("url")
                        audio_res = await client.get(audio_url)
                        file_path = os.path.join(vault.path, "audio", f"scene_{scene_idx+1}.mp3")
                        os.makedirs(os.path.dirname(file_path), exist_ok=True)
                        with open(file_path, "wb") as f:
                            f.write(audio_res.content)
                        return f"/projects_vault/{vault.id}/audio/scene_{scene_idx+1}.mp3"

        raise Exception(f"Audio provider {provider} failed or not implemented")

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def generate_image(self, vault: LuminaVault, scene_idx: int, prompt: str):
        config = self._get_config("image")
        provider = config["provider"]
        api_key = config["api_key"] or os.getenv("FAL_KEY")
        
        url = config["custom_endpoint"] or f"https://fal.run/fal-ai/{config['model_id']}"
        headers = {"Authorization": f"Key {api_key}", "Content-Type": "application/json"}
        
        # Adjust data format based on model/provider if needed
        data = {
            "prompt": prompt, 
            "image_size": "landscape_16_9" if vault.data["config"]["ratio"] == "16:9" else "portrait_16_9"
        }

        async with self.semaphore:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=data, timeout=60.0)
                if response.status_code == 200:
                    result = response.json()
                    image_url = result.get("images", [{}])[0].get("url") or result.get("url")
                    
                    img_res = await client.get(image_url)
                    images_dir = os.path.join(vault.path, "images")
                    os.makedirs(images_dir, exist_ok=True)
                    file_path = os.path.join(images_dir, f"scene_{scene_idx+1}.jpg")
                    with open(file_path, "wb") as f:
                        f.write(img_res.content)
                    
                    vault.log_cost(provider, config["model_id"], 0.003)
                    return f"/projects_vault/{vault.id}/images/scene_{scene_idx+1}.jpg"

        raise Exception(f"Image generation failed for {provider}")

    async def generate_music(self, vault: LuminaVault, prompt: str):
        # Implementation for background music
        config = self._get_config("music")
        # Similar logic to image/audio via fal.ai or other API
        pass

    async def generate_sfx(self, vault: LuminaVault, scene_idx: int, prompt: str):
        # Implementation for scene sound effects
        pass

    async def process_scene(self, vault: LuminaVault, scene_idx: int, scene_data: dict):
        audio_task = self.generate_audio(vault, scene_idx, scene_data["narrator_text"])
        image_task = self.generate_image(vault, scene_idx, scene_data["image_prompt"])
        
        audio_url, image_url = await asyncio.gather(audio_task, image_task)
        
        asset_entry = {
            "scene": scene_idx + 1,
            "audio": audio_url,
            "image": image_url,
            "motion": scene_data["motion_direction"]
        }
        
        existing_assets = vault.data["assets"].get("scenes", [])
        updated = False
        for i, asset in enumerate(existing_assets):
            if asset["scene"] == scene_idx + 1:
                existing_assets[i] = asset_entry
                updated = True
                break
        if not updated: existing_assets.append(asset_entry)
            
        vault.data["assets"]["scenes"] = sorted(existing_assets, key=lambda x: x["scene"])
        vault.save()

    async def generate_all_assets(self, vault: LuminaVault):
        vault.update_status(ProjectState.GENERATING_ASSETS)
        script = vault.data.get("script")
        if not script or "scenes" not in script:
            raise Exception("No script found to generate assets")

        scenes = script["scenes"]
        tasks = [self.process_scene(vault, i, scene) for i, scene in enumerate(scenes)]
        await asyncio.gather(*tasks)
        vault.update_status(ProjectState.AWAITING_ASSET_APPROVAL)

generator = LuminaGenerator()
