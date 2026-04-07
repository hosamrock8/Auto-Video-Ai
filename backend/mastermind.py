import os
import json
import asyncio
from typing import List, Optional
from openai import OpenAI
import google.generativeai as genai
from pydantic import BaseModel
from tenacity import retry, stop_after_attempt, wait_exponential

from .factory_store import LuminaVault, ProjectState
from .settings_manager import settings_manager

class Scene(BaseModel):
    scene_number: int
    narrator_text: str
    image_prompt: str
    motion_direction: str

class VideoScript(BaseModel):
    title: str
    scenes: List[Scene]

# Costs per 1M tokens (GPT-4o-mini as reference)
COSTS = {
    "gpt-4o-mini": {"input": 0.150, "output": 0.600},
    "gemini-2.0-flash-exp": {"input": 0.0, "output": 0.0} # Free tier for now
}

class LuminaMastermind:
    def __init__(self):
        self._setup_clients()

    def _setup_clients(self):
        config = settings_manager.get_engine_config("llm")
        self.provider = config["provider"]
        self.api_key = config["api_key"] or os.getenv("OPENAI_API_KEY")
        self.model = config["model_id"]
        
        if self.provider == "openai" and self.api_key:
            self.client = OpenAI(api_key=self.api_key, base_url=config["custom_endpoint"] or None)
        elif self.provider == "google" and config["api_key"]:
            genai.configure(api_key=config["api_key"])
            self.client = genai.GenerativeModel(self.model)
        else:
            self.client = None

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_script(self, vault: LuminaVault, content: str):
        # Refresh client in case settings changed
        self._setup_clients()
        
        vault.update_status(ProjectState.SCRIPTING)
        
        system_prompt = (
            "You are a professional YouTube Scriptwriter and AI Video Architect. "
            "Your task is to transform the provided content into a structured video script. "
            "RULES:\n"
            "1. Narrator text MUST be in Arabic (modern, engaging).\n"
            "2. Image prompts MUST be in English, highly detailed, optimized for 3D Cartoon / Disney Pixar style.\n"
            "3. Motion directions MUST be in English, e.g., 'slow zoom', 'panning right', 'cinematic dolly'.\n"
            "4. Respond ONLY with valid JSON matching the schema."
        )

        try:
            if self.provider == "openai":
                response = await asyncio.to_thread(
                    self.client.beta.chat.completions.parse,
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Content to transform:\n\n{content}"}
                    ],
                    response_format=VideoScript
                )
                script_data = response.choices[0].message.parsed
                
                # Log cost
                usage = response.usage
                cost = (usage.prompt_tokens * (COSTS.get(self.model, COSTS["gpt-4o-mini"])["input"] / 1_000_000)) + \
                       (usage.completion_tokens * (COSTS.get(self.model, COSTS["gpt-4o-mini"])["output"] / 1_000_000))
                vault.log_cost("openai", self.model, cost)

            elif self.provider == "google":
                full_prompt = f"{system_prompt}\n\nContent to transform:\n\n{content}\n\nRespond in JSON format."
                response = await asyncio.to_thread(self.client.generate_content, full_prompt)
                
                # Strip markdown code blocks if any
                text = response.text
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                
                data = json.loads(text)
                script_data = VideoScript(**data)
                vault.log_cost("google", self.model, 0.0) # Free tier tracking

            # Store in vault
            vault.data["script"] = script_data.model_dump()
            vault.update_status(ProjectState.AWAITING_SCRIPT_APPROVAL)
            
        except Exception as e:
            vault.data["status"] = ProjectState.ERROR
            vault.data["error_log"] = f"Mastermind Error: {str(e)}"
            vault.save()
            raise e

mastermind = LuminaMastermind()
