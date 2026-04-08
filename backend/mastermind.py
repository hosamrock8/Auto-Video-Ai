import os
import json
import asyncio
from typing import List
from pydantic import BaseModel
from tenacity import retry, stop_after_attempt, wait_exponential

from .factory_store import LuminaVault, ProjectState
from .settings_manager import settings_manager

# ── Pydantic schemas ─────────────────────────────────────────────────────────
class Scene(BaseModel):
    scene_number: int
    narrator_text: str
    image_prompt: str
    video_animation_prompt: str
    motion_direction: str

class VideoScript(BaseModel):
    title: str
    scenes: List[Scene]

# ── Cost table (per 1M tokens) ───────────────────────────────────────────────
COSTS = {
    "gpt-4o-mini":          {"input": 0.150, "output": 0.600},
    "gpt-4o":               {"input": 2.50,  "output": 10.0},
    "gemini-2.0-flash":     {"input": 0.0,   "output": 0.0},
    "gemini-1.5-flash":     {"input": 0.075, "output": 0.30},
    "gemini-1.5-pro":       {"input": 1.25,  "output": 5.00},
}

def _build_system_prompt(brand_persona: str, art_style: str = "Cinematic 3D") -> str:
    return (
        "You are a professional YouTube Scriptwriter and AI Video Architect.\n"
        f"BRAND_PERSONA_CONTEXT: {brand_persona}\n\n"
        "Transform the provided content into a structured video script.\n"
        "RULES:\n"
        "1. Narrator text MUST match the BRAND_PERSONA_CONTEXT tone and language.\n"
        f"2. Image prompts MUST be in English, highly descriptive, visually-stunning, and match the '{art_style}' style.\n"
        "3. image_prompt should focus on lighting, camera angle, and high-fidelity details.\n"
        "4. video_animation_prompt MUST describe the SPECIFIC motion in the scene.\n"
        "5. Respond ONLY with valid JSON matching the VideoScript schema — no markdown.\n"
        "6. Create 4 to 6 scenes suitable for a high-retention social video.\n"
    )

def _parse_script_json(raw: str) -> VideoScript:
    text = raw.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()
    return VideoScript(**json.loads(text))


class LuminaMastermind:

    # ── OpenAI / compatible (also used by OpenRouter & Kie.ai chat) ─────────
    async def _run_openai_compatible(self, vault: LuminaVault, content: str, config: dict, brand_persona: str, art_style: str) -> VideoScript:
        from openai import OpenAI

        provider = config.get("provider", "openai").lower()
        api_key  = config["api_key"] or os.getenv("OPENAI_API_KEY", "")
        model    = config["model_id"] or "gpt-4o-mini"

        # Determine base_url based on provider
        if provider == "openrouter":
            base_url = "https://openrouter.ai/api/v1"
        elif provider == "kie.ai":
            base_url = "https://api.kie.ai/v1"
        else:
            base_url = config.get("custom_endpoint") or None

        extra_headers = {}
        if provider == "openrouter":
            extra_headers["HTTP-Referer"] = "https://lumina-studio.local"
            extra_headers["X-Title"] = "Lumina Studio"

        client = OpenAI(
            api_key=api_key,
            base_url=base_url,
            default_headers=extra_headers if extra_headers else None,
        )

        try:
            # Try structured output first (OpenAI native)
            response = await asyncio.to_thread(
                client.beta.chat.completions.parse,
                model=model,
                messages=[
                    {"role": "system", "content": _build_system_prompt(brand_persona, art_style)},
                    {"role": "user",   "content": f"Content:\n\n{content}"},
                ],
                response_format=VideoScript,
            )
            script = response.choices[0].message.parsed
        except Exception:
            # Fallback: plain chat completion + JSON parse
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model=model,
                messages=[
                    {"role": "system", "content": _build_system_prompt(brand_persona, art_style)},
                    {"role": "user",   "content": f"Content:\n\n{content}\n\nRespond with ONLY valid JSON."},
                ],
            )
            raw_text = response.choices[0].message.content
            script = _parse_script_json(raw_text)

        # Log cost
        if hasattr(response, 'usage') and response.usage:
            usage = response.usage
            rate  = COSTS.get(model, {"input": 0.15, "output": 0.60})
            cost  = (usage.prompt_tokens * rate["input"] / 1_000_000) + \
                     (usage.completion_tokens * rate["output"] / 1_000_000)
            vault.log_cost(provider, model, cost)

        return script

    # ── Google Gemini (new google-genai SDK) ─────────────────────────────────
    async def _run_google(self, vault: LuminaVault, content: str, config: dict, brand_persona: str, art_style: str) -> VideoScript:
        from google import genai
        from google.genai import types

        api_key = config["api_key"] or os.getenv("GOOGLE_API_KEY", "")
        model   = config["model_id"] or "gemini-2.0-flash"
        client  = genai.Client(api_key=api_key)

        prompt = (
            f"{_build_system_prompt(brand_persona, art_style)}\n\n"
            f"Content:\n\n{content}\n\n"
            "Return ONLY a valid JSON object — no markdown fences."
        )
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.7, max_output_tokens=4096),
        )
        script = _parse_script_json(response.text)
        vault.log_cost("google", model, 0.0)
        return script

    # ── Entry point ──────────────────────────────────────────────────────────
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_script(self, vault: LuminaVault, content: str):
        vault.update_status(ProjectState.SCRIPTING)

        config        = settings_manager.get_engine_config("llm")
        global_config = settings_manager.get_engine_config("global")
        brand_persona = global_config.get("brand_persona", "")
        provider      = config.get("provider", "openai").lower()

        try:
            art_style = vault.data.get("config", {}).get("art_style", "Cinematic 3D")
            
            if provider == "google":
                script_data = await self._run_google(vault, content, config, brand_persona, art_style)
            else:
                script_data = await self._run_openai_compatible(vault, content, config, brand_persona, art_style)

            vault.data["script"] = script_data.model_dump()
            vault.update_status(ProjectState.AWAITING_SCRIPT_APPROVAL)

        except Exception as e:
            vault.data["status"]    = ProjectState.ERROR
            vault.data["error_log"] = f"Mastermind Error ({provider}): {str(e)}"
            vault.save()
            raise e


mastermind = LuminaMastermind()
