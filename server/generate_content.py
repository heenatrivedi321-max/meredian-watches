#!/usr/bin/env python3
"""
Meridian Content Generator
Run this to generate Instagram posts (images + captions) for the next few days.

Usage:
  python3 generate_content.py              # Generate 2 posts (1 day)
  python3 generate_content.py --days 3     # Generate 6 posts (3 days)
  python3 generate_content.py --list       # List all generated content
"""

import os
import sys
import json
import random
import hashlib
import argparse
import urllib.parse
from datetime import datetime, timedelta
from pathlib import Path

import requests
import groq
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

# ── Config ──────────────────────────────────────────────
CONTENT_DIR = Path(__file__).parent / "content"
CONTENT_DIR.mkdir(exist_ok=True)

WATCHES = [
    {"brand": "OLEVS", "model": "Brown Leather", "price": "₹4,420", "vibe": "classic gentleman, leather, boardroom"},
    {"brand": "OLEVS", "model": "Moon Phase", "price": "₹4,419", "vibe": "celestial, blue dial, astronomical elegance"},
    {"brand": "HEXA", "model": "Hustler Auto", "price": "₹7,999", "vibe": "industrial, green dial, kinetic mechanical"},
    {"brand": "FORSINING", "model": "Tourbillon", "price": "₹9,106", "vibe": "skeleton gears, exposed movement, mechanical art"},
    {"brand": "OLEVS", "model": "Diamond Dress", "price": "₹4,420", "vibe": "ruby red dial, diamonds, bold luxury"},
    {"brand": "OLEVS", "model": "Prem Chrono", "price": "₹4,420", "vibe": "diver style, sport luxury, two-tone steel"},
    {"brand": "EMPORIO ARMANI", "model": "AR1148", "price": "₹24,999", "vibe": "Italian luxury, minimalist, architectural design"},
    {"brand": "FOSSIL", "model": "Gold ME3280", "price": "₹22,000", "vibe": "gold-tone, warm luxury, commanding presence"},
]

POST_THEMES = [
    "lifestyle", "close-up", "moody", "product-focus", "wrist-shot",
    "flat-lay", "dramatic-lighting", "minimalist", "dark-background"
]

HASHTAG_SETS = [
    "#luxurywatches #watchfashion #meridianwatches #timepiece #wristgame #watchoftheday #accessories #mensfashion",
    "#watchcollector #horology #luxurylifestyle #watchstyle #instawatches #premiumwatches #watchvibes #elegance",
    "#watchesofinstagram #luxuryaccessories #watchenthusiast #timeluxury #watchaddict #fashionwatch #classyliving",
]

# ── Image Generation (Pollinations.ai — free, no auth) ──
def generate_image(prompt: str, filename: str) -> Path:
    seed = int(hashlib.md5(prompt.encode()).hexdigest()[:8], 16) % 999999
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1024&height=1024&nologo=true&seed={seed}"
    for attempt in range(3):
        try:
            r = requests.get(url, timeout=120)
            r.raise_for_status()
            filepath = CONTENT_DIR / filename
            filepath.write_bytes(r.content)
            print(f"  Image saved: {filepath.name} ({len(r.content)//1024}KB)")
            return filepath
        except Exception as e:
            if attempt < 2:
                print(f"  Retry {attempt+2}/3...")
                import time; time.sleep(3)
            else:
                raise


# ── Groq Caption Generation ─────────────────────────────
def generate_caption(watch: dict, theme: str) -> dict:
    client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

    prompt = f"""You are a luxury watch brand social media manager for MERIDIAN watches (Instagram: @meri.dianwatches).

Write an Instagram Reel/post caption for this watch:
- Brand: {watch['brand']}
- Model: {watch['model']}
- Price: {watch['price']}
- Vibe: {watch['vibe']}
- Image theme: {theme}

Rules:
- NO emojis
- Hook line that stops the scroll
- 2-3 sentences of confident, witty luxury copy
- End with a CTA (shop link in bio, DM to order, etc.)
- Include exactly 3-5 hashtags at the end (from luxury/watch niche)
- Tone: like a rich friend who doesn't try too hard
- Max 150 words

Return ONLY a JSON object with these keys:
{{"hook": "...", "body": "...", "cta": "...", "hashtags": "#one #two #three", "full_caption": "the complete caption text"}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.8,
        max_tokens=500,
    )

    text = response.choices[0].message.content.strip()
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text)


# ── Image Prompts ───────────────────────────────────────
def build_image_prompt(watch: dict, theme: str) -> str:
    base = f"A professional luxury watch advertisement photo of a {watch['brand']} {watch['model']} watch. "
    style_map = {
        "lifestyle": "Lifestyle shot on a well-dressed man's wrist, soft bokeh background, warm golden hour lighting, premium feel.",
        "close-up": "Extreme close-up macro photography of the watch dial, showing fine details, reflections, and craftsmanship.",
        "moody": "Dark moody studio shot with dramatic single-source lighting, deep shadows, cinematic atmosphere.",
        "product-focus": "Clean product photography on dark slate surface, studio lighting, sharp details, e-commerce quality.",
        "wrist-shot": "Watch on wrist in a luxury setting, confident pose, subtle background, Instagram aesthetic.",
        "flat-lay": "Flat lay arrangement with luxury accessories, leather wallet, sunglasses, dark background.",
        "dramatic-lighting": "Dramatic rim lighting on the watch, dark background, highlighting the metallic surfaces and crystal.",
        "minimalist": "Minimalist composition, single watch on clean dark background, negative space, modern luxury.",
        "dark-background": "Watch floating on pure black background with subtle reflections, high-end commercial photography.",
    }
    return base + style_map.get(theme, style_map["product-focus"]) + " 8K, photorealistic, no text, no watermarks."


# ── Main ────────────────────────────────────────────────
def generate_posts(num_posts: int = 1):
    existing = list(CONTENT_DIR.glob("*.json"))
    start_idx = len(existing)

    for i in range(num_posts):
        idx = start_idx + i
        watch = random.choice(WATCHES)
        theme = random.choice(POST_THEMES)
        hashtag_set = random.choice(HASHTAG_SETS)
        date = (datetime.now() + timedelta(days=idx // 2)).strftime("%Y-%m-%d")
        post_num = (idx % 2) + 1
        prefix = f"{date}_post{post_num}"

        print(f"\n{'='*50}")
        print(f"Post {idx+1}: {watch['brand']} {watch['model']} ({theme})")
        print(f"{'='*50}")

        # Generate image
        img_prompt = build_image_prompt(watch, theme)
        img_file = f"{prefix}.jpg"
        print(f"  Generating image...")
        try:
            generate_image(img_prompt, img_file)
        except Exception as e:
            print(f"  Image generation failed: {e}")
            img_file = None

        # Generate caption
        print(f"  Generating caption...")
        try:
            caption_data = generate_caption(watch, theme)
        except Exception as e:
            print(f"  Caption generation failed: {e}")
            caption_data = {
                "hook": f"The {watch['brand']} {watch['model']}.",
                "body": f"Timepiece excellence at {watch['price']}.",
                "cta": "Link in bio.",
                "hashtags": hashtag_set,
                "full_caption": f"The {watch['brand']} {watch['model']}.\n\nTimepiece excellence at {watch['price']}.\n\nLink in bio.\n\n{hashtag_set}",
            }

        # Save metadata
        meta = {
            "date": date,
            "post_number": post_num,
            "watch": watch,
            "theme": theme,
            "image": img_file,
            "caption": caption_data,
            "generated_at": datetime.now().isoformat(),
            "posted": False,
        }
        meta_file = CONTENT_DIR / f"{prefix}.json"
        with open(meta_file, "w") as f:
            json.dump(meta, f, indent=2)
        print(f"  Metadata: {meta_file.name}")
        print(f"  Caption: {caption_data.get('hook', '')[:80]}")

    print(f"\n{'='*50}")
    print(f"Done! {num_posts} posts in {CONTENT_DIR}")
    print(f"View: cd server && python3 view_content.py")


def list_content():
    posts = sorted(CONTENT_DIR.glob("*.json"))
    if not posts:
        print("No content yet. Run: python3 generate_content.py")
        return

    print(f"\n{'='*60}")
    print(f"MERIDIAN CONTENT LIBRARY ({len(posts)} posts)")
    print(f"{'='*60}")

    for p in posts:
        with open(p) as f:
            meta = json.load(f)
        status = "POSTED" if meta.get("posted") else "READY"
        has_img = "IMG" if meta.get("image") else "NO IMG"
        print(f"\n[{status}] [{has_img}] {meta['date']} Post #{meta['post_number']}")
        print(f"  Watch: {meta['watch']['brand']} {meta['watch']['model']}")
        print(f"  Theme: {meta['theme']}")
        print(f"  Hook:  {meta['caption'].get('hook', 'N/A')[:70]}")
        print(f"  File:  {p.name}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Meridian Content Generator")
    parser.add_argument("--days", type=int, default=1, help="Days of content (2 posts/day)")
    parser.add_argument("--list", action="store_true", help="List all generated content")
    args = parser.parse_args()

    if args.list:
        list_content()
    else:
        generate_posts(num_posts=args.days * 2)
