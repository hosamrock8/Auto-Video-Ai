import httpx
import asyncio
from typing import Dict, Any

class TestConnectionService:
    @staticmethod
    async def test_openai(api_key: str) -> Dict[str, Any]:
        if not api_key: return {"status": "error", "message": "Key missing"}
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    "https://api.openai.com/v1/models",
                    headers={"Authorization": f"Bearer {api_key}"},
                    timeout=5.0
                )
                if res.status_code == 200:
                    return {"status": "success", "message": "Successfully connected to OpenAI"}
                return {"status": "error", "message": f"OpenAI Error: {res.text[:50]}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    async def test_fal(api_key: str) -> Dict[str, Any]:
        if not api_key: return {"status": "error", "message": "Key missing"}
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    "https://fal.run/api/keys/me",
                    headers={"Authorization": f"Key {api_key}"},
                    timeout=5.0
                )
                if res.status_code == 200:
                    return {"status": "success", "message": "Successfully connected to Fal.ai"}
                return {"status": "error", "message": "Fal.ai Error: Invalid access"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    async def test_elevenlabs(api_key: str) -> Dict[str, Any]:
        if not api_key: return {"status": "error", "message": "Key missing"}
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    "https://api.elevenlabs.io/v1/user",
                    headers={"Xi-Api-Key": api_key},
                    timeout=5.0
                )
                if res.status_code == 200:
                    return {"status": "success", "message": "Successfully connected to ElevenLabs"}
                return {"status": "error", "message": "ElevenLabs Error: Invalid credentials"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    async def test_google(api_key: str) -> Dict[str, Any]:
        if not api_key: return {"status": "error", "message": "Key missing"}
        # Google Gemini check often requires a simple model list or generate attempt
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}",
                    timeout=5.0
                )
                if res.status_code == 200:
                    return {"status": "success", "message": "Successfully connected to Google Gemini"}
                return {"status": "error", "message": "Google Gemini Error: Invalid Key"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    async def test_kie(api_key: str) -> Dict[str, Any]:
        if not api_key: return {"status": "error", "message": "Key missing"}
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    "https://api.kie.ai/v1/models",
                    headers={"Authorization": f"Bearer {api_key}"},
                    timeout=5.0
                )
                if res.status_code == 200:
                    return {"status": "success", "message": "Successfully connected to Kie.ai"}
                return {"status": "error", "message": f"Kie.ai Error: {res.text[:50]}"}
        except Exception as e:
            return {"status": "error", "message": f"Kie Connection Error: {str(e)}"}

test_connection_service = TestConnectionService()
