import os
import json
import asyncio
from openai import OpenAI
from pydantic import BaseModel
from typing import List
from factory_store import LuminaVault

class YouTubePackage(BaseModel):
    titles: List[str]
    description: str
    tags: List[str]

class LuminaPostProduction:
    def __init__(self):
        key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=key) if key else None
        self.model = "gpt-4o-mini"

    async def generate_youtube_package(self, vault: LuminaVault):
        script = vault.data.get("script")
        if not script or "scenes" not in script:
            raise Exception("No script found to generate metadata.")

        system_prompt = (
            "You are a YouTube SEO Expert and Growth Hacker. "
            "Your task is to generate a high-engagement publishing package for the provided video script. "
            "RULES:\n"
            "1. Generate 3 click-worthy titles in Arabic.\n"
            "2. Generate a long, SEO-optimized description in Arabic including emojis and a brief summary.\n"
            "3. Generate 10-15 relevant tags and keywords (mix of Arabic and English).\n"
            "4. Format the response ONLY as valid JSON."
        )

        try:
            # OpenAI call is sync in the official SDK, wrap in to_thread
            response = await asyncio.to_thread(
                self.client.beta.chat.completions.parse,
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Video Script:\n\n{json.dumps(script, ensure_ascii=False)}"}
                ],
                response_format=YouTubePackage
            )

            package_data = response.choices[0].message.parsed
            vault.data["seo"] = package_data.model_dump()
            
            # Auto-Thumbnail selection (Simple logic: Pick the asset from Scene 1 or 2)
            scenes = vault.data.get("assets", {}).get("scenes", [])
            if scenes:
                # In V2, we pick the first scene's image as the default thumbnail
                vault.data["thumbnail"] = scenes[0]["image"]
            
            vault.save()
            
        except Exception as e:
            vault.data["error_log"] = f"Post-Production Error: {str(e)}"
            vault.save()

post_production = LuminaPostProduction()
