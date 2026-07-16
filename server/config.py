import os
import logging
from pathlib import Path
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

SERVER_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = SERVER_DIR.parent / "public"
CONTENT_POOL_PATH = SERVER_DIR / "content_pool.json"
SESSION_PATH = SERVER_DIR / "session.json"

load_dotenv(SERVER_DIR / ".env")

# ── Environment variables ──────────────────────────────────────────────────────
VITE_SHOPIFY_STORE_DOMAIN = os.getenv("VITE_SHOPIFY_STORE_DOMAIN")
SHOPIFY_ADMIN_TOKEN = os.getenv("SHOPIFY_ADMIN_TOKEN")
IG_USERNAME = os.getenv("IG_USERNAME")
IG_PASSWORD = os.getenv("IG_PASSWORD")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
POST_TIME_1 = os.getenv("POST_TIME_1", "11:30")
POST_TIME_2 = os.getenv("POST_TIME_2", "18:30")
TIMEZONE = os.getenv("TIMEZONE", "Asia/Kolkata")

# ── Watches catalog ─────────────────────────────────────────────────────────────
WATCHES = [
    {
        "id": "emporio-armani",
        "brand": "Emporio Armani",
        "model": "Men's Quartz Watch",
        "shopifyVariantId": "44409313722411",
        "videos": [
            str(PUBLIC_DIR / "Armani_Ad_Master.mp4"),
            str(PUBLIC_DIR / "Armani_Rotating_Final.mp4"),
        ],
        "images": [
            str(PUBLIC_DIR / "watches-nobg" / "ea_watch.png"),
            str(PUBLIC_DIR / "watches-nobg" / "ea_watch-2.png"),
            str(PUBLIC_DIR / "watches-nobg" / "ea_watch-3.png"),
        ],
    },
    {
        "id": "fossil-gold-me3280",
        "brand": "Fossil",
        "model": "Gold ME3280",
        "shopifyVariantId": "44409313755179",
        "videos": [
            str(PUBLIC_DIR / "Fossil_Gold_Master.mp4"),
        ],
        "images": [
            str(PUBLIC_DIR / "watches-nobg" / "fossil-gold-me3280.png"),
            str(PUBLIC_DIR / "watches-nobg" / "fossil-gold-me3280-2.png"),
            str(PUBLIC_DIR / "watches-nobg" / "fossil-gold-me3280-3.png"),
            str(PUBLIC_DIR / "watches-nobg" / "fossil-gold-me3280-4.png"),
            str(PUBLIC_DIR / "watches-nobg" / "fossil-gold-me3280-lifestyle.png"),
        ],
    },
    {
        "id": "fossil-brown",
        "brand": "Fossil",
        "model": "Brown Leather",
        "shopifyVariantId": None,
        "videos": [
            str(PUBLIC_DIR / "Fossil_Brown_Master.mp4"),
        ],
        "images": [],
    },
    {
        "id": "olevs-skeleton",
        "brand": "OLEVS",
        "model": "Skeleton Automatic",
        "shopifyVariantId": None,
        "videos": [
            str(PUBLIC_DIR / "Gold_skeleton_watch_showcase_202606290837.mp4"),
            str(PUBLIC_DIR / "Luxury_watch_spinning_gears_202607141816.mp4"),
        ],
        "images": [],
    },
    {
        "id": "hexa-diver",
        "brand": "HEXA",
        "model": "Diver Pro",
        "shopifyVariantId": None,
        "videos": [
            str(PUBLIC_DIR / "Diver_watch_crashing_through_water_202607141829.mp4"),
            str(PUBLIC_DIR / "Watch_rotating_in_liquid_explosion_202607141039.mp4"),
        ],
        "images": [],
    },
    {
        "id": "forsining-rose",
        "brand": "FORSINING",
        "model": "Rose Gold Dress",
        "shopifyVariantId": None,
        "videos": [
            str(PUBLIC_DIR / "Rose-gold_men's_watch_202607141839.mp4"),
            str(PUBLIC_DIR / "Luxury_watch_commercial_rose_gold_202607141826.mp4"),
        ],
        "images": [],
    },
]

# ── Content pool (shared across watches) ────────────────────────────────────────
REELS_VIDEOS = [
    # Portrait (already 9:16 — no crop needed)
    {"path": str(PUBLIC_DIR / "Fossil_Brown_Master.mp4"), "orientation": "portrait", "duration": 13},
    {"path": str(PUBLIC_DIR / "Watch_gears_Clean.mp4"), "orientation": "portrait", "duration": 10},
    {"path": str(PUBLIC_DIR / "Watch_gears_forming_watch_dial_202606291025.mp4"), "orientation": "portrait", "duration": 10},
    {"path": str(PUBLIC_DIR / "Luxury_watch_on_slate_pedestal_202606291151.mp4"), "orientation": "portrait", "duration": 10},
    # Landscape (need center-crop to 9:16)
    {"path": str(PUBLIC_DIR / "Armani_Ad_Master.mp4"), "orientation": "landscape", "duration": 13},
    {"path": str(PUBLIC_DIR / "Armani_Rotating_Final.mp4"), "orientation": "landscape", "duration": 13},
    {"path": str(PUBLIC_DIR / "Fossil_Gold_Master.mp4"), "orientation": "landscape", "duration": 13},
    {"path": str(PUBLIC_DIR / "Watch_rotating_in_liquid_explosion_202607141039.mp4"), "orientation": "landscape", "duration": 10},
    {"path": str(PUBLIC_DIR / "Watch_with_moon_phase_202607141844.mp4"), "orientation": "landscape", "duration": 10},
    {"path": str(PUBLIC_DIR / "Gold_skeleton_watch_showcase_202606290837.mp4"), "orientation": "landscape", "duration": 10},
    {"path": str(PUBLIC_DIR / "Luxury_watch_commercial_rose_gold_202607141826.mp4"), "orientation": "landscape", "duration": 10},
    {"path": str(PUBLIC_DIR / "Luxury_watch_commercial_diamond_202607141833.mp4"), "orientation": "landscape", "duration": 10},
    {"path": str(PUBLIC_DIR / "Diver_watch_crashing_through_water_202607141829.mp4"), "orientation": "landscape", "duration": 10},
    {"path": str(PUBLIC_DIR / "Rose-gold_men's_watch_202607141839.mp4"), "orientation": "landscape", "duration": 10},
    {"path": str(PUBLIC_DIR / "Luxury_watch_spinning_gears_202607141816.mp4"), "orientation": "landscape", "duration": 10},
]

PRODUCT_IMAGES = [
    str(PUBLIC_DIR / "watches-nobg" / "ea_watch.png"),
    str(PUBLIC_DIR / "watches-nobg" / "ea_watch-2.png"),
    str(PUBLIC_DIR / "watches-nobg" / "ea_watch-3.png"),
    str(PUBLIC_DIR / "watches-nobg" / "fossil-gold-me3280.png"),
    str(PUBLIC_DIR / "watches-nobg" / "fossil-gold-me3280-2.png"),
    str(PUBLIC_DIR / "watches-nobg" / "fossil-gold-me3280-3.png"),
    str(PUBLIC_DIR / "watches-nobg" / "fossil-gold-me3280-4.png"),
    str(PUBLIC_DIR / "watches-nobg" / "fossil-gold-me3280-lifestyle.png"),
]

# ── Hashtag sets (rotated daily) ────────────────────────────────────────────────
HASHTAG_SETS = [
    [
        "luxurywatches", "watchoftheday", "wristwatch", "watchcollection",
        "horology", "watchfam", "watchesofinstagram", "timepiece",
        "watchenthusiast", "luxurylifestyle", "meridianwatches", "watchlover",
        "styleandwatches", "menswatch", "watchpassion",
    ],
    [
        "watchcollector", "swisswatches", "watchstyle", "luxurywatch",
        "wristgame", "watchaddict", "fine timepieces", "watchgeek",
        "designerwatches", "watchinspo", "meridianwatches", "watchvibes",
        "premiumwatches", "watchworld", "elegantwatches",
    ],
    [
        "watchesoftheday", "watchcravings", "watchdaily", "bestwatches",
        "watchlife", "watchmania", "watchsociety", "watchculture",
        "wristcheck", "watchsnob", "meridianwatches", "watchperfection",
        "topwatches", "watchpassion2026", "luxurytime",
    ],
    [
        "watchobsessed", "watchesonthewrist", "watchshots", "watchholic",
        "instawatch", "watchlove", "wristwear", "watchoftheday",
        "watchgasm", "watchjunkie", "meridianwatches", "watchgame",
        "classywatches", "timelesswatches", "watchaddict2026",
    ],
    [
        "watchenthusiastlife", "watchcollectorlife", "finewatches",
        "watchdetails", "watchart", "watchcraft", "watchprecision",
        "luxurywrist", "watchpremium", "watchdaily2026", "meridianwatches",
        "watchperfection2026", "watchiconic", "watchclass", "timelessstyle",
    ],
]

# ── Brand rotation order ────────────────────────────────────────────────────────
BRAND_ROTATION_ORDER = [
    "Emporio Armani",
    "Fossil",
    "OLEVS",
    "HEXA",
    "FORSINING",
]

# ── Content type weights (for variety) ──────────────────────────────────────────
POST_TYPE_ORDER = ["reel", "image", "reel"]

logger.info("Config loaded — %d watches, %d reels, %d images in pool",
            len(WATCHES), len(REELS_VIDEOS), len(PRODUCT_IMAGES))
