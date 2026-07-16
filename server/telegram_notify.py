import logging
import requests
from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

logger = logging.getLogger(__name__)

BASE_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


def notify(message: str, parse_mode: str = "HTML") -> bool:
    """
    Send a Telegram message to the configured chat.
    Returns True on success, False on failure.
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.warning("Telegram credentials not configured — skipping notification")
        return False

    url = f"{BASE_URL}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": parse_mode,
    }

    try:
        resp = requests.post(url, json=payload, timeout=10)
        if resp.status_code == 200:
            logger.debug("Telegram notification sent")
            return True
        else:
            logger.warning("Telegram API returned %d: %s", resp.status_code, resp.text)
            return False
    except Exception as e:
        logger.error("Failed to send Telegram notification: %s", e)
        return False


def notify_post(media_type: str, brand: str, model: str, code: str) -> bool:
    """Send a formatted post notification."""
    if media_type == "reel":
        link = f"https://www.instagram.com/reel/{code}/"
    else:
        link = f"https://www.instagram.com/p/{code}/"
    msg = (
        f"<b>POSTED {media_type.upper()}</b>\n"
        f"Brand: {brand}\n"
        f"Model: {model}\n"
        f"Link: {link}"
    )
    return notify(msg)


def notify_error(context: str, error: str) -> bool:
    """Send an error notification."""
    msg = f"<b>ERROR</b>\nContext: {context}\nDetail: {error}"
    return notify(msg)


def notify_daily_summary(total_today: int, posts: list) -> bool:
    """Send end-of-day summary."""
    lines = [f"<b>DAILY SUMMARY</b>\nTotal posts today: {total_today}"]
    for p in posts:
        lines.append(f"- {p.get('type', 'N/A').upper()} | {p.get('brand', '?')} {p.get('model', '')}")
    return notify("\n".join(lines))
