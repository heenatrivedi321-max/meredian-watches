import logging
import time
import json
import random
from pathlib import Path
from typing import Optional

from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page

from config import IG_USERNAME, IG_PASSWORD, SESSION_PATH, SERVER_DIR

logger = logging.getLogger(__name__)

STATE_PATH = SERVER_DIR / "browser_state.json"
SLOW_MO = 500  # ms between actions — looks human


def _launch_browser(headless: bool = True) -> tuple:
    """Launch Chromium and return (playwright, browser, context, page)."""
    pw = sync_playwright().start()
    browser = pw.chromium.launch(
        headless=headless,
        args=[
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
        ],
    )

    # Restore session if available
    storage = None
    if STATE_PATH.exists():
        try:
            storage = json.loads(STATE_PATH.read_text())
            logger.info("Loading saved browser state")
        except Exception:
            storage = None

    context_opts = {
        "viewport": {"width": 1280, "height": 800},
        "user_agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/131.0.0.0 Safari/537.36"
        ),
        "locale": "en-US",
    }
    if storage:
        context_opts["storage_state"] = storage

    context = browser.new_context(**context_opts)
    context.set_default_timeout(30000)
    page = context.new_page()

    # Remove webdriver flag
    page.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
    """)

    return pw, browser, context, page


def _save_state(context: BrowserContext):
    """Persist browser cookies/storage for next run."""
    state = context.storage_state()
    STATE_PATH.write_text(json.dumps(state))
    logger.info("Browser state saved")


def login_user(headless: bool = True) -> tuple:
    """
    Login to Instagram via real browser.
    Returns (pw, browser, context, page) tuple.
    """
    pw, browser, context, page = _launch_browser(headless=headless)

    try:
        page.goto("https://www.instagram.com/accounts/login/", wait_until="networkidle")
        time.sleep(2 + random.random() * 2)

        # Check if already logged in (session restored)
        if "accounts/login" not in page.url:
            logger.info("Already logged in via saved session")
            return pw, browser, context, page

        # Fill username (Instagram uses name="email" for both email and phone)
        username_input = page.locator('input[name="username"], input[name="email"]')
        username_input.wait_for(state="visible", timeout=10000)
        username_input.click()
        time.sleep(0.3 + random.random() * 0.5)
        username_input.fill(IG_USERNAME)
        time.sleep(0.5 + random.random() * 0.5)

        # Fill password (Instagram uses name="pass")
        password_input = page.locator('input[name="password"], input[name="pass"]')
        password_input.click()
        time.sleep(0.3 + random.random() * 0.5)
        password_input.fill(IG_PASSWORD)
        time.sleep(0.5 + random.random() * 0.5)

        # Click login button
        login_btn = page.locator('button[type="submit"], input[type="submit"]')
        login_btn.click()

        # Wait for navigation
        time.sleep(5 + random.random() * 3)

        # Check for "Turn on Notifications" dialog — dismiss it
        try:
            not_now = page.locator('button:has-text("Not Now")')
            if not_now.is_visible(timeout=3000):
                not_now.click()
                time.sleep(1)
        except Exception:
            pass

        # Check if we landed on the feed
        if "accounts/login" in page.url:
            # Still on login page — check for challenge
            page_text = page.content()
            if "challenge" in page.url or "checkpoint" in page_text.lower():
                logger.error("Instagram challenge required — approve from your phone")
                raise RuntimeError("Instagram challenge required — check your phone")
            else:
                logger.error("Login failed — still on login page")
                # Take screenshot for debugging
                page.screenshot(path=str(SERVER_DIR / "login_debug.png"))
                raise RuntimeError("Login failed — screenshot saved to login_debug.png")

        # Success — save state
        _save_state(context)
        logger.info("Instagram login successful via browser")
        return pw, browser, context, page

    except Exception as e:
        # Clean up on failure
        try:
            browser.close()
            pw.stop()
        except Exception:
            pass
        raise


def post_reel(video_path: str, caption: str, thumbnail_path: Optional[str] = None) -> dict:
    """
    Upload a video as an Instagram Reel via browser automation.
    Returns dict with code and pk.
    """
    video = Path(video_path)
    if not video.exists():
        raise FileNotFoundError(f"Video not found: {video}")

    logger.info("Posting Reel via browser: %s", video.name)

    pw, browser, context, page = login_user()

    try:
        # Navigate to Instagram
        page.goto("https://www.instagram.com/", wait_until="networkidle")
        time.sleep(2 + random.random() * 2)

        # Click the "+" create button
        create_btn = page.locator('[aria-label="New post"], [aria-label="New Reel"], svg[aria-label="New post"]').first
        create_btn.wait_for(state="visible", timeout=10000)
        create_btn.click()
        time.sleep(1 + random.random())

        # Select "Reel" from the dropdown if present
        try:
            reel_option = page.locator('text="Reel"').first
            if reel_option.is_visible(timeout=2000):
                reel_option.click()
                time.sleep(1)
        except Exception:
            pass

        # Upload video via file chooser
        with page.expect_file_chooser(timeout=10000) as fc_info:
            # Click "Select from computer" or the upload area
            upload_area = page.locator('input[type="file"], [role="button"]:has-text("Select from computer"), [role="button"]:has-text("Drag and drop")').first
            upload_area.click()
        file_chooser = fc_info.value
        file_chooser.set_files(str(video))

        # Wait for video to process
        time.sleep(8 + random.random() * 5)

        # Click Next (may need to click through crop/filter screens)
        for _ in range(3):
            try:
                next_btn = page.locator('button:has-text("Next")').last
                if next_btn.is_visible(timeout=5000):
                    next_btn.click()
                    time.sleep(2 + random.random() * 2)
            except Exception:
                break

        # Fill caption
        try:
            caption_box = page.locator('[aria-label="Write a caption..."], textarea[aria-label*="caption"], div[role="textbox"][contenteditable="true"]').first
            caption_box.wait_for(state="visible", timeout=10000)
            caption_box.click()
            time.sleep(0.5)
            caption_box.fill(caption)
            time.sleep(1)
        except Exception as e:
            logger.warning("Could not fill caption: %s", e)

        # Click Share
        share_btn = page.locator('button:has-text("Share")').last
        share_btn.click()
        time.sleep(5 + random.random() * 3)

        # Extract the code from the URL or page
        code = ""
        try:
            # Wait for the post to appear
            time.sleep(3)
            current_url = page.url
            if "/reel/" in current_url:
                code = current_url.split("/reel/")[-1].strip("/")
            elif "/p/" in current_url:
                code = current_url.split("/p/")[-1].strip("/")
        except Exception:
            pass

        # Save state
        _save_state(context)

        result = {"code": code, "pk": None, "type": "reel"}
        logger.info("Reel posted — code=%s", code)
        return result

    except Exception as e:
        logger.error("Reel post failed: %s", e)
        page.screenshot(path=str(SERVER_DIR / "post_debug.png"))
        raise
    finally:
        try:
            browser.close()
            pw.stop()
        except Exception:
            pass


def post_image(image_path: str, caption: str) -> dict:
    """
    Upload a photo as an Instagram post via browser automation.
    Returns dict with code and pk.
    """
    image = Path(image_path)
    if not image.exists():
        raise FileNotFoundError(f"Image not found: {image}")

    logger.info("Posting image via browser: %s", image.name)

    pw, browser, context, page = login_user()

    try:
        # Navigate to Instagram
        page.goto("https://www.instagram.com/", wait_until="networkidle")
        time.sleep(2 + random.random() * 2)

        # Click the "+" create button
        create_btn = page.locator('[aria-label="New post"], svg[aria-label="New post"]').first
        create_btn.wait_for(state="visible", timeout=10000)
        create_btn.click()
        time.sleep(1 + random.random())

        # Upload image via file chooser
        with page.expect_file_chooser(timeout=10000) as fc_info:
            upload_area = page.locator('input[type="file"]').first
            upload_area.click()
        file_chooser = fc_info.value
        file_chooser.set_files(str(image))

        # Wait for image to load
        time.sleep(3 + random.random() * 2)

        # Click Next through crop/filter screens
        for _ in range(3):
            try:
                next_btn = page.locator('button:has-text("Next")').last
                if next_btn.is_visible(timeout=5000):
                    next_btn.click()
                    time.sleep(2 + random.random() * 2)
            except Exception:
                break

        # Fill caption
        try:
            caption_box = page.locator('[aria-label="Write a caption..."], textarea[aria-label*="caption"], div[role="textbox"][contenteditable="true"]').first
            caption_box.wait_for(state="visible", timeout=10000)
            caption_box.click()
            time.sleep(0.5)
            caption_box.fill(caption)
            time.sleep(1)
        except Exception as e:
            logger.warning("Could not fill caption: %s", e)

        # Click Share
        share_btn = page.locator('button:has-text("Share")').last
        share_btn.click()
        time.sleep(5 + random.random() * 3)

        # Extract the code
        code = ""
        try:
            time.sleep(3)
            current_url = page.url
            if "/p/" in current_url:
                code = current_url.split("/p/")[-1].strip("/")
            elif "/reel/" in current_url:
                code = current_url.split("/reel/")[-1].strip("/")
        except Exception:
            pass

        # Save state
        _save_state(context)

        result = {"code": code, "pk": None, "type": "image"}
        logger.info("Image posted — code=%s", code)
        return result

    except Exception as e:
        logger.error("Image post failed: %s", e)
        page.screenshot(path=str(SERVER_DIR / "post_debug.png"))
        raise
    finally:
        try:
            browser.close()
            pw.stop()
        except Exception:
            pass


def get_media_info(media_pk: int) -> dict:
    """Placeholder — browser automation doesn't easily fetch media info."""
    return {"likes": 0, "comments": 0, "views": 0, "error": "browser_mode"}
