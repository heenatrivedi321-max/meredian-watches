import json
import logging
from datetime import datetime, timedelta
from pathlib import Path

from config import CONTENT_POOL_PATH

logger = logging.getLogger(__name__)


def fetch_media_insights(media_pk: int) -> dict:
    """
    Placeholder for fetching post insights via Instagram Graph API.
    Currently returns basic info from instagrapi's media_info.
    """
    try:
        from instagram import get_media_info
        info = get_media_info(media_pk)
        if info:
            return {
                "likes": info.get("like_count", 0),
                "comments": info.get("comment_count", 0),
                "views": info.get("view_count", 0),
                "fetched_at": datetime.now().isoformat(),
            }
    except Exception as e:
        logger.error("Failed to fetch insights for pk=%s: %s", media_pk, e)

    return {"likes": 0, "comments": 0, "views": 0, "error": "unavailable"}


def generate_daily_report() -> str:
    """
    Generate a plain-text summary of today's posting activity and engagement.
    Returns the report string.
    """
    if not CONTENT_POOL_PATH.exists():
        return "No content pool data found."

    with open(CONTENT_POOL_PATH, "r") as f:
        pool = json.load(f)

    today = datetime.now().strftime("%Y-%m-%d")
    history = pool.get("post_history", [])

    today_posts = [p for p in history if p.get("date", "").startswith(today)]

    total = pool.get("total_posts", 0)
    total_videos = len(pool.get("posted_videos", []))
    total_images = len(pool.get("posted_images", []))

    report_lines = [
        f"=== MERIDIAN Daily Report — {today} ===",
        f"Posts today: {len(today_posts)}",
        f"Total posts all-time: {total}",
        f"Total unique videos: {total_videos}",
        f"Total unique images: {total_images}",
        "",
    ]

    if today_posts:
        report_lines.append("Today's posts:")
        for p in today_posts:
            report_lines.append(
                f"  - [{p.get('type', '?').upper()}] {p.get('brand', '?')} "
                f"{p.get('model', '')} — code: {p.get('code', 'N/A')}"
            )
    else:
        report_lines.append("No posts were made today.")

    report_lines.append("")
    report_lines.append(f"Last posted brand: {pool.get('last_posted_brand', 'N/A')}")
    report_lines.append(f"Last post date: {pool.get('last_post_date', 'N/A')}")

    report = "\n".join(report_lines)
    logger.info("Daily report generated: %d posts today", len(today_posts))
    return report
