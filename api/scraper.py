import re
import asyncio
import httpx
from bs4 import BeautifulSoup
import trafilatura
from youtube_transcript_api import YouTubeTranscriptApi
from typing import Optional

class LuminaScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

    def _extract_youtube_id(self, url: str) -> Optional[str]:
        regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
        match = re.search(regex, url)
        return match.group(1) if match else None

    async def get_youtube_transcript(self, video_id: str) -> str:
        try:
            # yt-transcript-api is sync, wrap in to_thread
            transcript_list = await asyncio.to_thread(YouTubeTranscriptApi.get_transcript, video_id, languages=['ar', 'en'])
            return " ".join([t['text'] for t in transcript_list])
        except Exception as e:
            return f"Error extracting YouTube transcript: {str(e)}"

    async def get_web_content(self, url: str) -> str:
        # 1. Try Trafilatura (High quality extraction)
        try:
            downloaded = await asyncio.to_thread(trafilatura.fetch_url, url)
            content = await asyncio.to_thread(trafilatura.extract, downloaded)
            if content:
                return content
        except:
            pass

        # 2. Fallback to BeautifulSoup
        try:
            async with httpx.AsyncClient(headers=self.headers, timeout=10.0) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    # Extract text from all <p> tags
                    paragraphs = soup.find_all('p')
                    return " ".join([p.get_text() for p in paragraphs])
        except Exception as e:
            return f"Error extracting web content: {str(e)}"
        
        return "Could not extract content from the provided URL."

    async def extract(self, source: str) -> str:
        source = source.strip()
        
        # 1. Check if it's a URL
        if source.startswith(("http://", "https://")):
            yt_id = self._extract_youtube_id(source)
            if yt_id:
                return await self.get_youtube_transcript(yt_id)
            else:
                return await self.get_web_content(source)
        
        # 2. Otherwise assume it's raw text
        return source

scraper = LuminaScraper()
