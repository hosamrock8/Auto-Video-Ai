import os
import json
from typing import Dict, Any

SETTINGS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "global_settings.json")

DEFAULT_SETTINGS = {
    "llm": {
        "provider": "openai",
        "api_key": "",
        "custom_endpoint": "",
        "model_id": "gpt-4o-mini"
    },
    "image": {
        "provider": "fal.ai",
        "api_key": "",
        "custom_endpoint": "https://fal.run/fal-ai/flux/schnell",
        "model_id": "flux-schnell"
    },
    "video": {
        "provider": "google",
        "api_key": "",
        "custom_endpoint": "",
        "model_id": "gemini-2.0-flash-exp"
    },
    "audio": {
        "provider": "elevenlabs",
        "api_key": "",
        "custom_endpoint": "https://api.elevenlabs.io/v1/text-to-speech",
        "model_id": "eleven_multilingual_v2"
    },
    "music": {
        "provider": "fal.ai",
        "api_key": "",
        "custom_endpoint": "https://fal.run/fal-ai/stable-audio",
        "model_id": "stable-audio"
    },
    "sfx": {
        "provider": "fal.ai",
        "api_key": "",
        "custom_endpoint": "https://fal.run/fal-ai/sound-effects",
        "model_id": "sfx-generator"
    },
    "global": {
        "aspect_ratio": "9:16",
        "resolution": "1080p",
        "language": "english",
        "watermark": False,
        "fallback_enabled": True,
        "max_cost_limit": 5.0,
        "budget_alert": True
    }
}

class SettingsManager:
    def __init__(self):
        self.settings = self._load()

    def _load(self) -> Dict[str, Any]:
        if os.path.exists(SETTINGS_PATH):
            try:
                with open(SETTINGS_PATH, 'r', encoding='utf-8') as f:
                    # Merge with defaults to handle new categories
                    saved = json.load(f)
                    for cat, data in DEFAULT_SETTINGS.items():
                        if cat not in saved:
                            saved[cat] = data
                    return saved
            except:
                pass
        return DEFAULT_SETTINGS

    def save(self, new_settings: Dict[str, Any]):
        self.settings = new_settings
        with open(SETTINGS_PATH, 'w', encoding='utf-8') as f:
            json.dump(self.settings, f, ensure_ascii=False, indent=2)

    def get_engine_config(self, engine_name: str) -> Dict[str, Any]:
        return self.settings.get(engine_name, DEFAULT_SETTINGS.get(engine_name))

settings_manager = SettingsManager()
