import asyncio
import os
from scraper import scraper
from mastermind import mastermind
from factory_store import get_vault, ProjectState

async def test_phase2():
    print("🚀 Testing Phase 2: Scraper & Mastermind...")
    
    # 1. Test Scraper (Standard Text)
    text = "Artificial Intelligence is transforming video production by automating repetitive tasks."
    content = await scraper.extract(text)
    print(f"✅ Content Extracted: {content[:50]}...")

    # 2. Test Mastermind (Requires OPENAI_API_KEY)
    if not os.getenv("OPENAI_API_KEY"):
        print("⚠️ Skipping Mastermind test: OPENAI_API_KEY not set.")
        return

    project_id = "test_p2"
    vault = get_vault(project_id)
    vault.data["status"] = ProjectState.DRAFT
    vault.save()

    print("🤖 Generating Script...")
    await mastermind.generate_script(vault, content)
    
    vault = get_vault(project_id)
    if vault.data["status"] == ProjectState.AWAITING_SCRIPT_APPROVAL:
        print("✅ Script Generated & Vault Updated!")
        print(f"💰 Total Cost: ${vault.data['costs']['total']:.6f}")
        print(f"📄 Scenes: {len(vault.data['script']['scenes'])}")
    else:
        print(f"❌ Script Generation Failed. Status: {vault.data['status']}")
        print(f"📝 Error: {vault.data.get('error_log')}")

if __name__ == "__main__":
    asyncio.run(test_phase2())
