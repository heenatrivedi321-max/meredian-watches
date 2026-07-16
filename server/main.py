import sys
import logging
from pathlib import Path

# Ensure server dir is on path
SERVER_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SERVER_DIR))

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

from config import TIMEZONE, POST_TIME_1, POST_TIME_2
from content_engine import plan_daily_content, mark_posted
from caption_writer import generate_caption, build_full_caption
from video_prep import prepare_reel, generate_thumbnail, get_processed_path, get_thumbnail_path
from instagram import post_reel, post_image
from telegram_notify import notify, notify_post, notify_error, notify_daily_summary
from analytics import generate_daily_report

# ── Logging setup ───────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(SERVER_DIR / "server.log"),
    ],
)
logger = logging.getLogger("main")

# ── Schedule times ──────────────────────────────────────────────────────────────
h1, m1 = map(int, POST_TIME_1.split(":"))
h2, m2 = map(int, POST_TIME_2.split(":"))


def _execute_post(post_num: int):
    """Core posting routine."""
    logger.info("=== Starting post routine #%d ===", post_num)
    try:
        # Plan today's content
        posts = plan_daily_content(count=2)
        if post_num > len(posts):
            logger.warning("Post #%d requested but only %d planned — skipping", post_num, len(posts))
            return

        post = posts[post_num - 1]
        watch = post["watch"]
        content_path = post["path"]

        # Generate caption
        hashtag_index = post_num - 1  # Vary hashtag set between posts
        caption_data = generate_caption(
            brand=watch["brand"],
            model=watch["model"],
            content_type=post["type"],
            setting=post.get("caption_setting", "feed"),
            hashtag_set_index=hashtag_index,
        )
        full_caption = build_full_caption(caption_data)

        media_info = None

        if post["type"] == "reel":
            # Prepare video
            orientation = post.get("orientation", "landscape")
            if orientation == "landscape":
                processed_path = get_processed_path(content_path)
                thumb_path = get_thumbnail_path(content_path)
                logger.info("Processing landscape video → 9:16")
                prepare_reel(content_path, processed_path)
                generate_thumbnail(content_path, thumb_path)
                media_info = post_reel(processed_path, full_caption, thumbnail_path=thumb_path)
            else:
                # Portrait — post directly
                media_info = post_reel(content_path, full_caption)

        elif post["type"] == "image":
            media_info = post_image(content_path, full_caption)

        if media_info:
            code = media_info.code if hasattr(media_info, "code") else str(media_info.get("code", ""))
            # Mark as posted
            mark_posted(
                {"pk": media_info.pk if hasattr(media_info, "pk") else None, "code": code},
                post,
            )
            # Telegram notification
            notify_post(post["type"], watch["brand"], watch["model"], code)
            logger.info("Post #%d complete — %s %s (code=%s)", post_num, watch["brand"], watch["model"], code)
        else:
            logger.error("Post #%d failed — no media_info returned", post_num)
            notify_error(f"Post #{post_num}", "No media info returned from Instagram API")

    except FileNotFoundError as e:
        logger.error("File not found during post #%d: %s", post_num, e)
        notify_error(f"Post #{post_num}", f"File not found: {e}")
    except Exception as e:
        logger.error("Post #%d failed: %s", post_num, e, exc_info=True)
        notify_error(f"Post #{post_num}", str(e))


def post_job_1():
    _execute_post(1)


def post_job_2():
    _execute_post(2)


def analytics_job():
    """Generate and send daily analytics report."""
    logger.info("Generating daily analytics report")
    try:
        report = generate_daily_report()
        notify(report, parse_mode=None)
        logger.info("Daily report sent to Telegram")
    except Exception as e:
        logger.error("Analytics report failed: %s", e)
        notify_error("Analytics", str(e))


def main():
    logger.info("MERIDIAN Instagram Autopilot starting…")
    logger.info("Timezone: %s | Post times: %s, %s", TIMEZONE, POST_TIME_1, POST_TIME_2)

    # Quick connectivity check
    try:
        from instagram import login_user
        login_user()
        logger.info("Instagram login verified")
    except Exception as e:
        logger.warning("Initial Instagram login check failed: %s — will retry at post time", e)

    try:
        from telegram_notify import notify
        notify("<b>MERIDIAN Autopilot Started</b>\nServer is online and scheduling posts.")
    except Exception as e:
        logger.warning("Could not send startup notification: %s", e)

    # ── Scheduler ───────────────────────────────────────────────────────────────
    scheduler = BlockingScheduler(timezone=TIMEZONE)

    scheduler.add_job(
        post_job_1,
        CronTrigger(hour=h1, minute=m1, timezone=TIMEZONE),
        id="post_1",
        name=f"Post #1 at {POST_TIME_1}",
        misfire_grace_time=3600,
    )

    scheduler.add_job(
        post_job_2,
        CronTrigger(hour=h2, minute=m2, timezone=TIMEZONE),
        id="post_2",
        name=f"Post #2 at {POST_TIME_2}",
        misfire_grace_time=3600,
    )

    scheduler.add_job(
        analytics_job,
        CronTrigger(hour=22, minute=0, timezone=TIMEZONE),
        id="analytics",
        name="Daily analytics at 22:00",
        misfire_grace_time=3600,
    )

    logger.info("Scheduler started — waiting for trigger times…")

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("Scheduler shutting down")
        scheduler.shutdown()


if __name__ == "__main__":
    main()
