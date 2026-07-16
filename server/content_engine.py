import json
import logging
import random
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from config import (
    WATCHES,
    REELS_VIDEOS,
    PRODUCT_IMAGES,
    BRAND_ROTATION_ORDER,
    POST_TYPE_ORDER,
    CONTENT_POOL_PATH,
    POST_TIME_1,
    POST_TIME_2,
)

logger = logging.getLogger(__name__)


def _load_pool() -> dict:
    if CONTENT_POOL_PATH.exists():
        with open(CONTENT_POOL_PATH, "r") as f:
            return json.load(f)
    return {
        "posted_videos": [],
        "posted_images": [],
        "last_posted_brand": None,
        "post_history": [],
        "analytics": {},
        "total_posts": 0,
        "last_post_date": None,
    }


def _save_pool(pool: dict) -> None:
    with open(CONTENT_POOL_PATH, "w") as f:
        json.dump(pool, f, indent=2)
    logger.debug("Content pool saved")


def _next_brand(pool: dict) -> str:
    """Pick next brand using rotation order, never repeating the previous day's brand."""
    last = pool.get("last_posted_brand")
    candidates = [b for b in BRAND_ROTATION_ORDER if b != last]
    if not candidates:
        candidates = BRAND_ROTATION_ORDER[:]
    return random.choice(candidates)


def _brand_watches(brand: str) -> list:
    return [w for w in WATCHES if w["brand"] == brand]


def _video_available(video_path: str, pool: dict) -> bool:
    """Check if a video was posted in the last 30 days."""
    thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()
    for entry in pool.get("posted_videos", []):
        if entry["path"] == video_path and entry.get("date", "") >= thirty_days_ago:
            return False
    return True


def _pick_reel(brand: str, pool: dict) -> Optional[dict]:
    """Pick an available reel for the brand. Falls back to generic pool."""
    brand_watches = _brand_watches(brand)

    # 1. Try brand-specific videos first
    for watch in brand_watches:
        for vpath in watch.get("videos", []):
            if _video_available(vpath, pool):
                return {"path": vpath, "type": "reel", "watch": watch, "orientation": _get_orientation(vpath)}

    # 2. Try generic reels pool
    for reel in REELS_VIDEOS:
        if _video_available(reel["path"], pool):
            watch = random.choice(brand_watches) if brand_watches else WATCHES[0]
            return {"path": reel["path"], "type": "reel", "watch": watch, "orientation": reel.get("orientation", "landscape")}

    return None


def _get_orientation(video_path: str) -> str:
    """Look up orientation from the global REELS_VIDEOS list."""
    for r in REELS_VIDEOS:
        if r["path"] == video_path:
            return r.get("orientation", "landscape")
    return "landscape"


def _pick_image(brand: str, pool: dict) -> Optional[dict]:
    """Pick an available product image for the brand."""
    brand_watches = _brand_watches(brand)

    # 1. Brand-specific images
    for watch in brand_watches:
        for ipath in watch.get("images", []):
            if ipath not in pool.get("posted_images", []):
                return {"path": ipath, "type": "image", "watch": watch}

    # 2. Generic image pool (only if brand has no images)
    all_brand_images = []
    for w in brand_watches:
        all_brand_images.extend(w.get("images", []))
    if not all_brand_images:
        for ipath in PRODUCT_IMAGES:
            if ipath not in pool.get("posted_images", []):
                watch = random.choice(brand_watches) if brand_watches else WATCHES[0]
                return {"path": ipath, "type": "image", "watch": watch}

    return None


def plan_daily_content(count: int = 2) -> list:
    """
    Plan `count` posts for the day.
    Returns list of dicts: {watch, video/image_path, type, caption_setting, time}
    """
    pool = _load_pool()
    posts = []

    for i in range(count):
        # Alternate reel/image
        post_type = POST_TYPE_ORDER[i % len(POST_TYPE_ORDER)]

        # Pick brand (rotate, avoid repeat)
        brand = _next_brand(pool) if i == 0 else _next_brand(pool)

        if post_type == "reel":
            content = _pick_reel(brand, pool)
            if content is None:
                # Fallback to image
                content = _pick_image(brand, pool)
                if content:
                    post_type = "image"
        else:
            content = _pick_image(brand, pool)
            if content is None:
                # Fallback to reel
                content = _pick_reel(brand, pool)
                if content:
                    post_type = "reel"

        if content is None:
            logger.warning("No content available for post %d — skipping", i + 1)
            continue

        content["type"] = post_type
        content["caption_setting"] = "reel" if post_type == "reel" else "carousel"

        # Assign time
        times = [POST_TIME_1, POST_TIME_2]
        content["time"] = times[i] if i < len(times) else times[-1]

        posts.append(content)
        logger.info(
            "Planned post %d: %s %s (%s) at %s",
            i + 1, content["type"].upper(),
            content["watch"]["brand"], content["watch"]["model"],
            content["time"],
        )

    # Update pool state
    today = datetime.now().strftime("%Y-%m-%d")
    pool["last_post_date"] = today
    if posts:
        pool["last_posted_brand"] = posts[-1]["watch"]["brand"]
    _save_pool(pool)

    return posts


def mark_posted(media_info: dict, post_plan: dict) -> None:
    """Record a successful post in the content pool."""
    pool = _load_pool()
    now = datetime.now().isoformat()

    entry = {
        "path": post_plan.get("path", ""),
        "type": post_plan["type"],
        "brand": post_plan["watch"]["brand"],
        "model": post_plan["watch"]["model"],
        "media_pk": media_info.get("pk"),
        "code": media_info.get("code"),
        "date": now,
    }

    if post_plan["type"] == "reel":
        pool.setdefault("posted_videos", []).append(entry)
    else:
        pool.setdefault("posted_images", []).append(entry)

    pool.setdefault("post_history", []).append(entry)
    pool["total_posts"] = pool.get("total_posts", 0) + 1
    pool["last_post_date"] = datetime.now().strftime("%Y-%m-%d")
    _save_pool(pool)
    logger.info("Marked as posted: %s %s", post_plan["watch"]["brand"], post_plan["type"])
