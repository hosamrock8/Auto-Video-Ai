import mastermind

test_urls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ", # YouTube
    "https://en.wikipedia.org/wiki/Artificial_intelligence", # Web (Long)
]

def verify():
    for url in test_urls:
        print(f"\n--- Testing Extraction for: {url} ---")
        try:
            content = mastermind.extract_content_from_url(url)
            if content:
                print(f"✅ Success! Extracted {len(content)} characters.")
                print(f"Sample: {content[:150]}...")
            else:
                print("❌ Failed: No content extracted.")
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    verify()
