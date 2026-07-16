import logging
import random
from typing import Optional

from groq import Groq

from config import GROQ_API_KEY, HASHTAG_SETS

logger = logging.getLogger(__name__)

_client: Optional[Groq] = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


SYSTEM_PROMPT = """You are MERIDIAN, a luxury watch e-commerce brand (@meri.dianwatches).
Write Instagram captions for our watch posts.

Rules:
- Tone: confident, witty, luxury-focused
- NO emojis whatsoever
- Hook: one punchy, controversial or aspirational statement
- Body: 1-2 lines of watch context or brand philosophy
- CTA: one of "Save this for later" / "Tag someone who gets it" / "Drop a if you know" / "Follow @meri.dianwatches for more"
- Hashtags: include the provided hashtags naturally at the end
- Keep total caption under 300 characters for Reels, under 500 for images

Return ONLY valid JSON with keys: hook, body, cta, hashtags (comma-separated string).
No markdown fences, no explanation — just the JSON object."""


def generate_caption(
    brand: str,
    model: str,
    content_type: str,
    setting: str = "feed",
    hashtag_set_index: Optional[int] = None,
) -> dict:
    """
    Generate an Instagram caption using Groq + Llama 3.3 70B.

    Returns dict with keys: hook, body, cta, hashtags
    """
    cl = _get_client()

    # Pick hashtag set
    if hashtag_set_index is None:
        hashtag_set_index = random.randint(0, len(HASHTAG_SETS) - 1)
    hashtags = HASHTAG_SETS[hashtag_set_index % len(HASHTAG_SETS)]
    picked = random.sample(hashtags, min(5, len(hashtags)))
    hashtag_str = " ".join(f"#{h}" for h in picked)

    user_msg = f"""Write a caption for this Instagram {content_type}:
Brand: {brand}
Model: {model}
Content type: {content_type}
Setting: {setting}

Include these hashtags: {hashtag_str}"""

    try:
        response = cl.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ],
            temperature=0.8,
            max_tokens=400,
        )

        raw = response.choices[0].message.content.strip()
        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1]
        if raw.endswith("```"):
            raw = raw.rsplit("```", 1)[0]
        raw = raw.strip()

        import json
        data = json.loads(raw)
        caption = {
            "hook": data.get("hook", ""),
            "body": data.get("body", ""),
            "cta": data.get("cta", ""),
            "hashtags": data.get("hashtags", hashtag_str),
        }
        logger.info("Caption generated for %s %s", brand, model)
        return caption

    except Exception as e:
        logger.error("Groq caption generation failed: %s — using fallback", e)
        # Fallback caption
        return {
            "hook": f"{brand} {model} — quiet luxury speaks volumes.",
            "body": "Crafted for those who move in silence and let their wrist do the talking.",
            "cta": "Save this for later.",
            "hashtags": hashtag_str,
        }


def build_full_caption(caption: dict) -> str:
    """Assemble caption dict into a single string ready for posting."""
    parts = []
    if caption.get("hook"):
        parts.append(caption["hook"])
    if caption.get("body"):
        parts.append(caption["body"])
    if caption.get("cta"):
        parts.append(caption["cta"])
    if caption.get("hashtags"):
        parts.append(caption["hashtags"])
    return "\n\n".join(parts)
